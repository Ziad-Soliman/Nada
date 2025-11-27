
import React, { useEffect, useState } from 'react';
import { PlayerState, GameStats, NotionStudent, ClassId } from '../types';
import { ArrowLeft, Award, Users, Download, Search, Filter, Cloud, Database, RefreshCw, Eye, Trophy, Calendar, Wifi, WifiOff, X } from 'lucide-react';
import Button from './Button';
import Avatar from './Avatar';
import { getAllStudents } from '../services/storage';
import { fetchNotionStudents } from '../services/notion';

interface DashboardScreenProps {
  currentPlayer: PlayerState;
  onBack: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ currentPlayer, onBack }) => {
  const [dataSource, setDataSource] = useState<'local' | 'cloud'>('local');
  const [localStudents, setLocalStudents] = useState<PlayerState[]>([]);
  const [cloudStudents, setCloudStudents] = useState<NotionStudent[]>([]);
  const [isLoadingCloud, setIsLoadingCloud] = useState(false);
  const [cloudError, setCloudError] = useState<string | null>(null);
  
  const [filterText, setFilterText] = useState('');
  const [classFilter, setClassFilter] = useState<'ALL' | ClassId>('ALL');
  
  const [selectedStudent, setSelectedStudent] = useState<PlayerState | NotionStudent | null>(null);

  // Initial Load
  useEffect(() => {
    refreshData();
  }, [dataSource]);

  const refreshData = async () => {
    if (dataSource === 'local') {
        const allData = getAllStudents();
        setLocalStudents(allData);
    } else {
        setIsLoadingCloud(true);
        setCloudError(null);
        const result = await fetchNotionStudents();
        setIsLoadingCloud(false);
        if (result.success && result.data) {
            setCloudStudents(result.data);
        } else {
            setCloudError(result.error || "Failed to connect to Notion.");
        }
    }
  };

  const getRank = (totalScore: number) => {
    if (totalScore > 2000) return "Galactic Legend";
    if (totalScore > 1000) return "Mission Commander";
    if (totalScore > 500) return "Star Pilot";
    if (totalScore > 100) return "Space Cadet";
    return "Rookie";
  };
  
  const formatDate = (isoString: string) => {
      try {
          if (!isoString) return "-";
          return new Date(isoString).toLocaleDateString() + " " + new Date(isoString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      } catch (e) {
          return "Unknown";
      }
  };

  const getStatsForStudent = (s: PlayerState | NotionStudent) => {
      if ('stats' in s) {
          // Local PlayerState
           const totalXP = Object.values(s.stats).reduce((acc, curr) => acc + curr.totalScore, 0);
           const totalGames = Object.values(s.stats).reduce((acc, curr) => acc + curr.timesPlayed, 0);
           return { totalXP, totalGames, rank: getRank(totalXP), isLocal: true };
      } else {
          // NotionStudent
          return { totalXP: s.totalScore, totalGames: 0, rank: getRank(s.totalScore), isLocal: false };
      }
  };

  // --- FILTERING LOGIC ---
  const studentsToDisplay = dataSource === 'local' ? localStudents : cloudStudents;
  
  const filteredList = studentsToDisplay.filter(s => {
    const matchesName = (s.firstName + ' ' + s.lastName).toLowerCase().includes(filterText.toLowerCase());
    const matchesClass = classFilter === 'ALL' || s.classId === classFilter;
    return matchesName && matchesClass;
  });

  // --- STATS CALCULATION ---
  const totalStudents = studentsToDisplay.length;
  const totalClassXP = studentsToDisplay.reduce((acc, s) => {
      return acc + (('stats' in s) ? Object.values(s.stats).reduce((a,c: GameStats)=>a+c.totalScore,0) : s.totalScore);
  }, 0);
  const avgXP = totalStudents > 0 ? Math.round(totalClassXP / totalStudents) : 0;


  const handleExport = () => {
    if (filteredList.length === 0) return;
    
    let csvContent = "";
    if (dataSource === 'local') {
        const headers = ["First Name", "Last Name", "Class", "Total XP", "Rank", "Last Played", "Space", "Dino", "Cave", "Ocean", "City"];
        const rows = (filteredList as PlayerState[]).map(s => {
            const stats = s.stats;
            const total = Object.values(stats).reduce((a,c)=>a+c.totalScore,0);
            return [
                s.firstName, s.lastName, s.classId, total, getRank(total), new Date(s.lastPlayed).toLocaleString(),
                stats.space.totalScore, stats.dino.totalScore, stats.cave.totalScore, stats.ocean.totalScore, stats.city.totalScore
            ].join(",");
        });
        csvContent = [headers.join(","), ...rows].join("\n");
    } else {
        const headers = ["First Name", "Last Name", "Class", "Total XP", "Last Played"];
        const rows = (filteredList as NotionStudent[]).map(s => [
             s.firstName, s.lastName, s.classId, s.totalScore, new Date(s.lastPlayed).toLocaleString()
        ].join(","));
        csvContent = [headers.join(","), ...rows].join("\n");
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `majesty_maths_${dataSource}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- STUDENT DETAIL MODAL ---
  const renderStudentDetails = () => {
      if (!selectedStudent) return null;
      const { totalXP, rank, isLocal } = getStatsForStudent(selectedStudent);
      const sLocal = isLocal ? (selectedStudent as PlayerState) : null;
      const sCloud = !isLocal ? (selectedStudent as NotionStudent) : null;

      return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
              <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                  {/* Header */}
                  <div className="p-6 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-white/10 flex justify-between items-start">
                      <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl bg-slate-800 border-2 border-slate-600 overflow-hidden shadow-lg flex items-center justify-center">
                              {sLocal ? (
                                  <Avatar config={sLocal.character} size="sm" className="w-full h-full transform scale-125 translate-y-2" />
                              ) : (
                                  <span className="text-2xl font-bold text-slate-500">{selectedStudent.firstName.charAt(0)}</span>
                              )}
                          </div>
                          <div>
                              <h3 className="text-2xl font-['Orbitron'] font-bold text-white">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                              <div className="flex gap-2 mt-1">
                                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                      Class {selectedStudent.classId}
                                  </span>
                                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                      {rank}
                                  </span>
                              </div>
                          </div>
                      </div>
                      <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                          <X className="w-5 h-5 text-slate-400" />
                      </button>
                  </div>

                  {/* Body */}
                  <div className="p-6 overflow-y-auto space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 text-center">
                              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Total XP</p>
                              <p className="text-3xl font-bold text-cyan-400 font-['Orbitron']">{totalXP}</p>
                          </div>
                          <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 text-center">
                              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Last Active</p>
                              <p className="text-sm font-bold text-white mt-2">{formatDate(selectedStudent.lastPlayed)}</p>
                          </div>
                      </div>

                      {sLocal ? (
                          <div className="space-y-3">
                              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                  <Trophy className="w-4 h-4 text-yellow-500" /> Game Performance
                              </h4>
                              <div className="grid grid-cols-1 gap-3">
                                  {Object.entries(sLocal.stats).map(([key, stat]) => (
                                      <div key={key} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-white/5">
                                          <div className="flex items-center gap-3">
                                              <div className={`w-2 h-8 rounded-full ${stat.totalScore > 0 ? 'bg-cyan-500' : 'bg-slate-700'}`}></div>
                                              <span className="font-bold text-slate-300 capitalize">{key}</span>
                                          </div>
                                          <div className="flex items-center gap-4">
                                              <div className="text-right">
                                                  <span className="block text-xs text-slate-500">Score</span>
                                                  <span className="font-bold text-white">{stat.totalScore}</span>
                                              </div>
                                              <div className="text-right">
                                                  <span className="block text-xs text-slate-500">Best</span>
                                                  <span className="font-bold text-yellow-500">{stat.highScore}</span>
                                              </div>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      ) : (
                          <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl">
                              <p className="text-sm text-blue-200 flex items-center gap-2">
                                  <Cloud className="w-4 h-4" />
                                  Viewing Cloud Data. Detailed per-game breakdown is available on the student's local device.
                              </p>
                          </div>
                      )}
                  </div>

                  <div className="p-4 bg-slate-950/50 border-t border-white/10 text-center">
                      <Button onClick={() => setSelectedStudent(null)} variant="secondary" className="w-full">Close Profile</Button>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="w-full max-w-6xl bg-[#f8fafc] text-slate-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in flex flex-col h-[85vh] border border-white/10 relative">
      
      {/* HEADER */}
      <div className="bg-slate-900 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center border-b-4 border-yellow-500 relative overflow-hidden gap-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
        
        <div className="relative z-10 flex items-center gap-4 w-full md:w-auto">
          <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl text-white shadow-lg shadow-orange-500/20">
             <Award className="w-8 h-8" />
          </div>
          <div>
             <h2 className="text-2xl md:text-3xl font-['Cinzel'] font-bold text-white tracking-wide">Command Center</h2>
             <p className="text-slate-400 text-xs md:text-sm font-medium flex items-center gap-2">
                Year 3 Performance Tracker
                {dataSource === 'cloud' ? 
                   <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-bold uppercase flex items-center gap-1"><Wifi className="w-3 h-3"/> Online</span> : 
                   <span className="px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30 text-[10px] font-bold uppercase flex items-center gap-1"><Database className="w-3 h-3"/> Local Storage</span>
                }
             </p>
          </div>
        </div>

        <div className="flex gap-3 relative z-10 w-full md:w-auto justify-end">
          <Button variant="secondary" onClick={onBack} className="!py-2 !px-4 !text-sm !bg-slate-800 !text-slate-300 !border-slate-700 hover:!text-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Exit
          </Button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white border-b border-slate-200 p-4 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-0 z-20">
          
          {/* Source Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200 w-full md:w-auto">
              <button 
                onClick={() => setDataSource('local')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${dataSource === 'local' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                  <Database className="w-4 h-4" /> Local Data
              </button>
              <button 
                onClick={() => setDataSource('cloud')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${dataSource === 'cloud' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                  <Cloud className="w-4 h-4" /> Cloud Data
              </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search cadet..." 
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" 
                />
              </div>
              
              <div className="flex gap-2">
                 <div className="relative">
                    <select 
                        value={classFilter} 
                        onChange={(e) => setClassFilter(e.target.value as any)}
                        className="appearance-none bg-white border border-slate-200 text-slate-600 py-2 pl-4 pr-10 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-50"
                    >
                        <option value="ALL">All Classes</option>
                        <option value="3A">Class 3A</option>
                        <option value="3B">Class 3B</option>
                        <option value="3C">Class 3C</option>
                    </select>
                    <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                 </div>
                 
                 <button 
                    onClick={refreshData} 
                    disabled={isLoadingCloud}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl border border-slate-200 transition-colors disabled:opacity-50" 
                    title="Refresh Data"
                >
                    <RefreshCw className={`w-5 h-5 ${isLoadingCloud ? 'animate-spin' : ''}`} />
                 </button>
                 
                 <button 
                  onClick={handleExport}
                  className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center gap-2 px-4"
                >
                    <Download className="w-4 h-4" /> <span className="hidden md:inline text-sm font-bold">Export</span>
                </button>
              </div>
          </div>
      </div>

      {/* DASHBOARD CONTENT AREA */}
      <div className="flex-1 overflow-auto bg-slate-50 p-6 md:p-8">
        
        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Total Cadets</p>
                    <p className="text-4xl font-bold text-slate-800 font-['Orbitron']">{totalStudents}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                    <Users className="w-6 h-6" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Avg XP Level</p>
                    <p className="text-4xl font-bold text-slate-800 font-['Orbitron']">{avgXP}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                    <Award className="w-6 h-6" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                 <div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Last Update</p>
                    <p className="text-lg font-bold text-slate-800 font-['Orbitron']">
                        {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-500">
                    <Calendar className="w-6 h-6" />
                </div>
            </div>
        </div>

        {/* Error State for Cloud */}
        {dataSource === 'cloud' && cloudError && (
             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600">
                <WifiOff className="w-5 h-5" />
                <span className="font-bold text-sm">Connection Error: {cloudError}. Ensure Notion Variables are set in Vercel.</span>
             </div>
        )}

        {/* DATA TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {isLoadingCloud && filteredList.length === 0 ? (
                <div className="p-12 text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-500 font-bold">Syncing with Notion Database...</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-5 font-bold">Cadet Name</th>
                                <th className="px-6 py-5 font-bold">Class</th>
                                <th className="px-6 py-5 font-bold">Total XP</th>
                                <th className="px-6 py-5 font-bold">Rank</th>
                                <th className="px-6 py-5 font-bold">Last Active</th>
                                <th className="px-6 py-5 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredList.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                                        No profiles found. {dataSource === 'cloud' ? 'Check Notion connection.' : 'Start a game to create a local profile.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredList.map((student, idx) => {
                                    const { totalXP, rank } = getStatsForStudent(student);
                                    
                                    return (
                                        <tr key={('id' in student) ? student.id : idx} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 group-hover:bg-white group-hover:border-blue-200 group-hover:text-blue-600 transition-all shadow-sm">
                                                        {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-slate-700 block">{student.firstName} {student.lastName}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                    student.classId === '3A' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                    student.classId === '3B' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                    'bg-green-50 text-green-600 border border-green-100'
                                                }`}>
                                                    {student.classId}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold font-['Orbitron'] text-slate-700">{totalXP}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                                    totalXP >= 1000 ? 'bg-purple-50 text-purple-600 border-purple-200' : 
                                                    totalXP >= 500 ? 'bg-green-50 text-green-600 border-green-200' : 
                                                    'bg-slate-50 text-slate-500 border-slate-200'
                                                }`}>
                                                    {rank}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                                                {formatDate(student.lastPlayed)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => setSelectedStudent(student)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="View Detail"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      </div>
      
      {/* Modals */}
      {renderStudentDetails()}

    </div>
  );
};

export default DashboardScreen;
