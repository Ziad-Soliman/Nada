
import React, { useEffect, useState } from 'react';
import { PlayerState, NotionStudent, ClassId } from '../types';
import { ArrowLeft, Award, Users, Download, Search, Filter, Cloud, RefreshCw, Eye, X, Wifi, WifiOff, Globe } from 'lucide-react';
import Button from './Button';
import { fetchNotionStudents } from '../services/notion';

interface DashboardScreenProps {
  currentPlayer: PlayerState;
  onBack: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onBack }) => {
  const [students, setStudents] = useState<NotionStudent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [filterText, setFilterText] = useState('');
  const [classFilter, setClassFilter] = useState<'ALL' | ClassId>('ALL');
  
  const [selectedStudent, setSelectedStudent] = useState<NotionStudent | null>(null);

  // Initial Load - Force Cloud Fetch
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    const result = await fetchNotionStudents();
    setIsLoading(false);
    
    if (result.success && result.data) {
        setStudents(result.data);
    } else {
        setError(result.error || "Failed to connect to Notion. Please check your internet connection or API configuration.");
    }
  };

  // Helper for Rank Calculation based on Total XP
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

  // Helper to generate consistent colors for avatars based on name
  const getAvatarColor = (name: string) => {
    const colors = [
        'bg-red-500 border-red-400 text-white', 
        'bg-blue-500 border-blue-400 text-white', 
        'bg-green-500 border-green-400 text-white', 
        'bg-yellow-500 border-yellow-400 text-white', 
        'bg-purple-500 border-purple-400 text-white', 
        'bg-pink-500 border-pink-400 text-white', 
        'bg-indigo-500 border-indigo-400 text-white',
        'bg-cyan-500 border-cyan-400 text-white'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // --- FILTERING LOGIC ---
  const filteredList = students.filter(s => {
    const fullName = (s.firstName + ' ' + s.lastName).toLowerCase();
    const matchesName = fullName.includes(filterText.toLowerCase());
    const matchesClass = classFilter === 'ALL' || s.classId === classFilter;
    return matchesName && matchesClass;
  });

  // --- STATS CALCULATION ---
  const totalStudents = students.length;
  const totalClassXP = students.reduce((acc, s) => acc + s.totalScore, 0);
  const avgXP = totalStudents > 0 ? Math.round(totalClassXP / totalStudents) : 0;

  const handleExport = () => {
    if (filteredList.length === 0) return;
    
    const headers = ["First Name", "Last Name", "Class", "Total XP", "Rank", "Last Played"];
    const rows = filteredList.map(s => [
            s.firstName, 
            s.lastName, 
            s.classId, 
            s.totalScore, 
            getRank(s.totalScore), 
            new Date(s.lastPlayed).toLocaleString()
    ].join(","));
    
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `majesty_maths_cloud_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- STUDENT DETAIL MODAL ---
  const renderStudentDetails = () => {
      if (!selectedStudent) return null;
      const rank = getRank(selectedStudent.totalScore);
      const initials = (selectedStudent.firstName.charAt(0) + selectedStudent.lastName.charAt(0)).toUpperCase();
      const avatarStyle = getAvatarColor(selectedStudent.firstName + selectedStudent.lastName);

      return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4">
              <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col relative animate-scale-in">
                  
                  {/* Close Button */}
                  <button 
                      onClick={() => setSelectedStudent(null)} 
                      className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full transition-colors z-10"
                  >
                      <X className="w-5 h-5 text-slate-300" />
                  </button>

                  {/* Header */}
                  <div className="p-8 pb-4 flex flex-col items-center text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>
                      
                      <div className={`w-24 h-24 rounded-full border-4 shadow-xl flex items-center justify-center mb-4 ${avatarStyle}`}>
                          <span className="text-3xl font-bold font-['Orbitron']">{initials}</span>
                      </div>
                      
                      <h3 className="text-2xl font-['Orbitron'] font-bold text-white tracking-wide">
                          {selectedStudent.firstName} {selectedStudent.lastName}
                      </h3>
                      
                      <div className="flex gap-2 mt-2">
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 border border-slate-600 text-slate-300">
                             Class {selectedStudent.classId}
                          </span>
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 uppercase tracking-wide">
                             {rank}
                          </span>
                      </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-950/50 p-5 rounded-2xl border border-white/5 text-center hover:border-blue-500/30 transition-colors group">
                              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2 group-hover:text-blue-400">Total XP</p>
                              <p className="text-3xl font-bold text-white font-['Orbitron'] group-hover:scale-105 transition-transform">{selectedStudent.totalScore}</p>
                          </div>
                          <div className="bg-slate-950/50 p-5 rounded-2xl border border-white/5 text-center hover:border-green-500/30 transition-colors group">
                              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2 group-hover:text-green-400">Last Active</p>
                              <div className="flex flex-col items-center justify-center h-10">
                                <p className="text-xs font-bold text-white">{new Date(selectedStudent.lastPlayed).toLocaleDateString()}</p>
                                <p className="text-[10px] text-slate-400">{new Date(selectedStudent.lastPlayed).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                              </div>
                          </div>
                      </div>

                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
                          <Globe className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                          <p className="text-sm text-blue-200">
                              This profile is synced from the Cloud Database. Detailed per-game statistics and history logs are stored securely on the student's device.
                          </p>
                      </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-slate-950/80 border-t border-white/10">
                      <Button onClick={() => setSelectedStudent(null)} variant="secondary" className="w-full">
                          Close Profile
                      </Button>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="w-full max-w-7xl mx-auto h-[85vh] flex flex-col bg-[#f8fafc] rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden animate-fade-in relative">
      
      {/* HEADER */}
      <div className="bg-slate-900 p-6 flex flex-col md:flex-row justify-between items-center border-b-4 border-blue-500 relative shrink-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
        
        <div className="relative z-10 flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
             <Cloud className="w-8 h-8" />
          </div>
          <div>
             <h2 className="text-2xl md:text-3xl font-['Cinzel'] font-bold text-white tracking-wide">Cloud Command</h2>
             <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-bold uppercase tracking-wider">
                    <Wifi className="w-3 h-3" /> Notion Connected
                </span>
                <span className="text-slate-500 text-xs font-medium">| Admin Dashboard</span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10 w-full md:w-auto justify-end">
          <Button variant="secondary" onClick={onBack} className="!py-2.5 !px-5 !text-sm !bg-slate-800 !text-slate-300 !border-slate-700 hover:!text-white hover:!bg-slate-700 shadow-lg">
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Main
          </Button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white border-b border-slate-200 p-4 flex flex-col md:flex-row gap-4 justify-between items-center z-20 shrink-0 shadow-sm">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 w-full">
              <div className="relative flex-[2]">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search student database..." 
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-100 bg-slate-50 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700" 
                />
              </div>
              
              <div className="flex gap-2 flex-1">
                 <div className="relative flex-1">
                    <select 
                        value={classFilter} 
                        onChange={(e) => setClassFilter(e.target.value as any)}
                        className="w-full appearance-none bg-slate-50 border-2 border-slate-100 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer hover:bg-slate-100 transition-colors"
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
                    disabled={isLoading}
                    className="p-2.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600 rounded-xl border-2 border-slate-100 transition-all disabled:opacity-50 active:scale-95" 
                    title="Sync Data"
                >
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                 </button>
                 
                 <button 
                  onClick={handleExport}
                  className="p-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors shadow-md active:scale-95 flex items-center justify-center gap-2 px-4 whitespace-nowrap"
                >
                    <Download className="w-4 h-4" /> <span className="hidden sm:inline text-sm font-bold">CSV</span>
                </button>
              </div>
          </div>
      </div>

      {/* ERROR STATE */}
      {error && (
         <div className="m-6 p-4 bg-red-50 border-2 border-red-100 rounded-2xl flex items-start gap-4 text-red-700 animate-fade-in">
            <div className="p-2 bg-red-100 rounded-full shrink-0">
                <WifiOff className="w-5 h-5 text-red-600" />
            </div>
            <div>
                <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Connection Error</h4>
                <p className="text-sm opacity-90">{error}</p>
            </div>
         </div>
      )}

      {/* DASHBOARD CONTENT AREA */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-8 scroll-smooth">
        
        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between group hover:border-blue-500/20 transition-colors">
                <div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1 group-hover:text-blue-500 transition-colors">Total Cadets</p>
                    <p className="text-4xl font-bold text-slate-800 font-['Orbitron']">{totalStudents}</p>
                </div>
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform shadow-inner">
                    <Users className="w-7 h-7" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between group hover:border-green-500/20 transition-colors">
                <div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1 group-hover:text-green-500 transition-colors">Avg XP Level</p>
                    <p className="text-4xl font-bold text-slate-800 font-['Orbitron']">{avgXP}</p>
                </div>
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform shadow-inner">
                    <Award className="w-7 h-7" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between group hover:border-purple-500/20 transition-colors">
                 <div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1 group-hover:text-purple-500 transition-colors">Active Filter</p>
                    <p className="text-lg font-bold text-slate-800 font-['Orbitron'] truncate max-w-[120px]">
                        {classFilter === 'ALL' ? 'All Classes' : `Class ${classFilter}`}
                    </p>
                    <p className="text-xs text-slate-400 font-bold">{filteredList.length} Results</p>
                </div>
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform shadow-inner">
                    <Filter className="w-7 h-7" />
                </div>
            </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {isLoading ? (
                <div className="p-20 text-center flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold animate-pulse">Establishing Uplink to Notion...</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-5 font-bold">Cadet Identity</th>
                                <th className="px-6 py-5 font-bold">Class Unit</th>
                                <th className="px-6 py-5 font-bold">Total XP</th>
                                <th className="px-6 py-5 font-bold">Current Rank</th>
                                <th className="px-6 py-5 font-bold">Last Active</th>
                                <th className="px-6 py-5 font-bold text-right">Access</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredList.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-50">
                                            <Search className="w-12 h-12 text-slate-300 mb-4" />
                                            <p className="text-slate-900 font-bold text-lg">No Records Found</p>
                                            <p className="text-slate-500 text-sm">Try adjusting your search filters or sync again.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredList.map((student) => {
                                    const rank = getRank(student.totalScore);
                                    const avatarStyle = getAvatarColor(student.firstName + student.lastName);
                                    
                                    return (
                                        <tr key={student.id} className="hover:bg-blue-50/40 transition-colors group cursor-default">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 shadow-sm ${avatarStyle}`}>
                                                        {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-slate-700 block text-sm group-hover:text-blue-700 transition-colors">
                                                            {student.firstName} {student.lastName}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                                    student.classId === '3A' ? 'bg-red-50 text-red-600 border-red-100' :
                                                    student.classId === '3B' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    'bg-green-50 text-green-600 border-green-100'
                                                }`}>
                                                    {student.classId}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold font-['Orbitron'] text-slate-700 group-hover:text-blue-600 transition-colors">{student.totalScore}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                                    student.totalScore >= 1000 ? 'bg-purple-50 text-purple-600 border-purple-200' : 
                                                    student.totalScore >= 500 ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 
                                                    'bg-slate-50 text-slate-500 border-slate-200'
                                                }`}>
                                                    {rank}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-xs font-medium font-mono">
                                                {formatDate(student.lastPlayed)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => setSelectedStudent(student)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                                                    title="View Full Profile"
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
