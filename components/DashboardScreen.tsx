
import React, { useEffect, useState } from 'react';
import { PlayerState, NotionStudent, ClassId, NotionLog } from '../types';
import { ArrowLeft, Award, Users, Download, Search, Filter, Cloud, RefreshCw, Eye, X, Wifi, WifiOff, Globe, Trophy, Rocket, Trees, Gem, Anchor, Building2, Clock, Calendar } from 'lucide-react';
import Button from './Button';
import Avatar from './Avatar';
import { fetchNotionStudents, fetchStudentLogs } from '../services/notion';

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
  const [studentLogs, setStudentLogs] = useState<NotionLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Initial Load - Force Cloud Fetch
  useEffect(() => {
    refreshData();
  }, []);

  // Fetch Logs when a student is selected
  useEffect(() => {
    if (selectedStudent) {
        setStudentLogs([]);
        setLoadingLogs(true);
        fetchStudentLogs(selectedStudent.id).then(result => {
            if (result.success && result.logs) {
                setStudentLogs(result.logs);
            }
            setLoadingLogs(false);
        });
    }
  }, [selectedStudent]);

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
  // MUST MATCH API LOGIC in api/sync-notion.js
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

  const getGameIcon = (gameTitle: string) => {
      const lower = gameTitle.toLowerCase();
      if (lower.includes('space')) return Rocket;
      if (lower.includes('dino')) return Trees;
      if (lower.includes('cave') || lower.includes('crystal')) return Gem;
      if (lower.includes('ocean')) return Anchor;
      if (lower.includes('city') || lower.includes('sky')) return Building2;
      if (lower.includes('time')) return Clock;
      return Award;
  };

  // --- FILTERING LOGIC ---
  const filteredList = students.filter(s => {
    const fullName = (s.firstName + ' ' + s.lastName).toLowerCase();
    const matchesName = fullName.includes(filterText.toLowerCase());
    const matchesClass = classFilter === 'ALL' || s.classId === classFilter;
    return matchesName && matchesClass;
  });

  // Sort by Score Descending
  const sortedList = [...filteredList].sort((a, b) => b.totalScore - a.totalScore);
  
  // Top 3 Students
  const topStudents = sortedList.slice(0, 3);

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
      
      // Default fallback if character config is missing (though sync should provide it)
      const character = selectedStudent.character || { suitColor: 'blue', helmetStyle: 'classic', badge: 'star' };

      return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-4">
              <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col relative animate-scale-in max-h-[90vh]">
                  
                  {/* Close Button */}
                  <button 
                      onClick={() => setSelectedStudent(null)} 
                      className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full transition-colors z-20"
                  >
                      <X className="w-5 h-5 text-slate-300" />
                  </button>

                  {/* Header */}
                  <div className="p-8 pb-4 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden bg-slate-950">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent pointer-events-none"></div>
                      
                      <div className="w-24 h-24 rounded-full border-4 border-slate-700 bg-slate-800 shadow-xl flex items-center justify-center overflow-hidden relative group shrink-0">
                          <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors"></div>
                          <Avatar config={character} size="lg" className="transform translate-y-2 scale-110" />
                      </div>
                      
                      <div className="text-center md:text-left z-10">
                        <h3 className="text-2xl font-['Orbitron'] font-bold text-white tracking-wide">
                            {selectedStudent.firstName} {selectedStudent.lastName}
                        </h3>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 border border-slate-600 text-slate-300">
                                Class {selectedStudent.classId}
                            </span>
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 uppercase tracking-wide">
                                {rank}
                            </span>
                        </div>
                      </div>

                       <div className="ml-auto flex gap-4 text-center">
                          <div>
                              <p className="text-[10px] text-slate-500 font-bold uppercase">Total XP</p>
                              <p className="text-2xl font-['Orbitron'] font-bold text-white">{selectedStudent.totalScore}</p>
                          </div>
                      </div>
                  </div>

                  {/* LOGS SECTION */}
                  <div className="flex-1 overflow-y-auto bg-slate-50/5 p-6">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Globe className="w-4 h-4" /> Cloud Mission Logs
                      </h4>
                      
                      {loadingLogs ? (
                          <div className="flex flex-col items-center justify-center py-10 space-y-3 opacity-70">
                              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
                              <p className="text-sm text-slate-300">Retrieving secure logs...</p>
                          </div>
                      ) : studentLogs.length === 0 ? (
                          <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-2xl">
                              <p className="text-slate-500 text-sm">No mission history found for this cadet.</p>
                          </div>
                      ) : (
                          <div className="space-y-3">
                              {studentLogs.map((log) => {
                                  const Icon = getGameIcon(log.game);
                                  return (
                                    <div key={log.id} className="bg-slate-800/50 p-4 rounded-xl border border-white/5 flex items-center justify-between group hover:bg-slate-800 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{log.game}</p>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(log.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="text-right">
                                            <p className="text-sm font-bold font-['Orbitron'] text-white">
                                                {log.score} <span className="text-slate-500 text-[10px]">/ {log.maxScore}</span>
                                            </p>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                                                log.rank === 'Galactic Legend' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                                log.rank === 'Mission Commander' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                                                log.rank === 'Star Pilot' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                                'bg-slate-700 text-slate-400 border-slate-600'
                                            }`}>
                                                {log.rank}
                                            </span>
                                        </div>
                                    </div>
                                  );
                              })}
                          </div>
                      )}
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-slate-950/80 border-t border-white/10 shrink-0">
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
        
        {/* LEADERBOARD PODIUM - Shows only if we have students and no specific search filtering active (class filter ok) */}
        {!isLoading && !error && filteredList.length > 0 && !filterText && (
             <div className="mb-10 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-6">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-xl font-bold text-slate-700 font-['Cinzel'] tracking-wide">Academy Leaders</h3>
                </div>
                
                <div className="flex items-end justify-center gap-4 md:gap-8">
                    {/* 2nd Place */}
                    {topStudents[1] && (
                        <div className="flex flex-col items-center animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-slate-300 bg-white shadow-lg flex items-center justify-center relative mb-3 group">
                                <Avatar config={topStudents[1].character} size="md" className="transform scale-90 translate-y-1" />
                                <div className="absolute -bottom-3 w-6 h-6 bg-slate-300 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm">2</div>
                            </div>
                            <p className="font-bold text-slate-700 text-sm">{topStudents[1].firstName}</p>
                            <p className="text-xs text-slate-500 font-bold">{topStudents[1].totalScore} XP</p>
                        </div>
                    )}
                    
                    {/* 1st Place */}
                    {topStudents[0] && (
                        <div className="flex flex-col items-center -mt-6 animate-fade-in-up">
                            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-yellow-400 bg-white shadow-xl flex items-center justify-center relative mb-3 group">
                                <div className="absolute -top-6 text-2xl animate-bounce">👑</div>
                                <Avatar config={topStudents[0].character} size="lg" className="transform scale-100 translate-y-1" />
                                <div className="absolute -bottom-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm">1</div>
                            </div>
                            <p className="font-bold text-slate-800 text-base">{topStudents[0].firstName}</p>
                            <p className="text-xs text-yellow-600 font-bold bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200 mt-1">{topStudents[0].totalScore} XP</p>
                        </div>
                    )}
                    
                    {/* 3rd Place */}
                    {topStudents[2] && (
                        <div className="flex flex-col items-center animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-orange-300 bg-white shadow-lg flex items-center justify-center relative mb-3 group">
                                <Avatar config={topStudents[2].character} size="md" className="transform scale-90 translate-y-1" />
                                <div className="absolute -bottom-3 w-6 h-6 bg-orange-300 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm">3</div>
                            </div>
                            <p className="font-bold text-slate-700 text-sm">{topStudents[2].firstName}</p>
                            <p className="text-xs text-slate-500 font-bold">{topStudents[2].totalScore} XP</p>
                        </div>
                    )}
                </div>
             </div>
        )}

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
                                sortedList.map((student) => {
                                    const rank = getRank(student.totalScore);
                                    
                                    return (
                                        <tr key={student.id} className="hover:bg-blue-50/40 transition-colors group cursor-default">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                                                        <Avatar config={student.character || {suitColor: 'blue', helmetStyle: 'classic', badge: 'star'}} size="sm" className="w-full h-full transform scale-125 translate-y-1" />
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
