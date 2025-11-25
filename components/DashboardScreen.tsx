
import React, { useEffect, useState } from 'react';
import { PlayerState, GameStats } from '../types';
import { ArrowLeft, Award, Users, Download, Search, Filter } from 'lucide-react';
import Button from './Button';
import { getAllStudents } from '../services/storage';

interface DashboardScreenProps {
  currentPlayer: PlayerState;
  onBack: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ currentPlayer, onBack }) => {
  const [students, setStudents] = useState<PlayerState[]>([]);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    // Load all students from local storage
    const allData = getAllStudents();
    setStudents(allData);
  }, []);

  const getOverallScore = (stats: Record<string, GameStats>) => {
    return Object.values(stats).reduce((acc, curr) => acc + curr.totalScore, 0);
  };

  const getRank = (totalScore: number) => {
    if (totalScore > 2000) return "Galactic Legend";
    if (totalScore > 1000) return "Mission Commander";
    if (totalScore > 500) return "Star Pilot";
    return "Space Cadet";
  };
  
  const formatDate = (isoString: string) => {
      try {
          return new Date(isoString).toLocaleDateString() + " " + new Date(isoString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      } catch (e) {
          return "Unknown";
      }
  }

  // Calculate Class Stats
  const totalScoreAll = students.reduce((acc, s) => acc + getOverallScore(s.stats), 0);
  const avgScore = students.length > 0 ? Math.round(totalScoreAll / students.length) : 0;
  const topStudent = students.length > 0 ? students.reduce((prev, current) => (getOverallScore(prev.stats) > getOverallScore(current.stats)) ? prev : current) : null;

  const handleExport = () => {
    if (students.length === 0) return;

    // Create CSV Header
    const headers = ["First Name", "Last Name", "Class", "Total XP", "Rank", "Last Played", "Space Saver XP", "Dino Discovery XP", "Crystal Cave XP", "Ocean Odyssey XP", "Sky City XP"];
    
    // Create Rows
    const rows = students.map(s => {
        const stats = s.stats;
        const total = getOverallScore(stats);
        return [
            s.firstName,
            s.lastName,
            s.classId,
            total,
            getRank(total),
            new Date(s.lastPlayed).toLocaleString(),
            stats.space.totalScore,
            stats.dino.totalScore,
            stats.cave.totalScore,
            stats.ocean.totalScore,
            stats.city.totalScore
        ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `majesty_maths_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredStudents = students.filter(s => 
    s.firstName.toLowerCase().includes(filterText.toLowerCase()) || 
    s.lastName.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl bg-[#f8fafc] text-slate-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in flex flex-col h-[85vh] border border-white/10">
      {/* Dashboard Header */}
      <div className="bg-slate-900 p-8 flex justify-between items-center border-b-4 border-yellow-500 relative overflow-hidden">
        {/* Bg pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-['Cinzel'] font-bold text-white flex items-center gap-4">
            <div className="p-2 bg-yellow-500 rounded-lg text-slate-900">
                <Award className="w-6 h-6" />
            </div>
            Teacher Dashboard
          </h2>
          <p className="text-slate-400 text-sm ml-[3.5rem] mt-1 font-medium">Local Device Data • Year 3</p>
        </div>
        <div className="flex gap-3 relative z-10">
          <Button variant="secondary" onClick={onBack} className="!py-2 !px-4 !text-sm !bg-slate-800 !text-slate-300 !border-slate-700">
            <ArrowLeft className="w-4 h-4 mr-2" /> Exit System
          </Button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 overflow-auto p-8 bg-slate-50">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
             <div>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Total Profiles</p>
                <p className="text-4xl font-bold text-slate-800 font-['Orbitron']">{students.length}</p>
             </div>
             <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                <Users className="w-6 h-6" />
             </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
             <div>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Class Avg XP</p>
                <p className="text-4xl font-bold text-slate-800 font-['Orbitron']">
                  {avgScore}
                </p>
             </div>
             <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                <Award className="w-6 h-6" />
             </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
             <div>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Top Performer</p>
                <p className="text-lg font-bold text-slate-800 truncate max-w-[150px]">
                    {topStudent ? `${topStudent.firstName} ${topStudent.lastName.charAt(0)}.` : '-'}
                </p>
             </div>
             <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-500">
                <Award className="w-6 h-6" />
             </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
            <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search student..." 
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 w-64" 
                />
            </div>
            <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors text-sm font-bold">
                    <Filter className="w-4 h-4" /> Filter
                </button>
                <button 
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors text-sm font-bold shadow-lg shadow-blue-200 active:scale-95"
                >
                    <Download className="w-4 h-4" /> Export Report
                </button>
            </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-5 font-bold">Student Name</th>
                <th className="px-6 py-5 font-bold">Class</th>
                <th className="px-6 py-5 font-bold">Total XP</th>
                <th className="px-6 py-5 font-bold">Rank</th>
                <th className="px-6 py-5 font-bold">Last Played</th>
                <th className="px-6 py-5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                  <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-400">No student profiles found matching criteria.</td>
                  </tr>
              ) : (
                filteredStudents.map((student, index) => {
                    const totalXP = getOverallScore(student.stats);
                    return (
                        <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4 font-bold text-slate-700 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-xs font-bold text-slate-600">
                                {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                            </div>
                            {student.firstName} {student.lastName}
                        </td>
                        <td className="px-6 py-4">
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{student.classId}</span>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold font-['Orbitron'] text-slate-600">{totalXP}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                            totalXP >= 1000 ? 'bg-purple-50 text-purple-600 border-purple-200' : 
                            totalXP >= 500 ? 'bg-green-50 text-green-600 border-green-200' : 
                            'bg-slate-50 text-slate-500 border-slate-200'
                            }`}>
                            {getRank(totalXP)}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-xs font-medium">{formatDate(student.lastPlayed)}</td>
                        <td className="px-6 py-4 text-right">
                            <button className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg">
                                <Search className="w-4 h-4" />
                            </button>
                        </td>
                        </tr>
                    );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
