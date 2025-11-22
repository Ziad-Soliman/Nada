import React from 'react';
import { PlayerState } from '../types';
import { ArrowLeft, Award, Users, Download, Search, Filter } from 'lucide-react';
import Button from './Button';

interface DashboardScreenProps {
  currentPlayer: PlayerState;
  onBack: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ currentPlayer, onBack }) => {
  // Mock data to simulate other students
  const mockStudents = [
    { name: "Ahmed S.", score: 100, rank: "Galactic Legend", date: "Today, 09:00 AM", hints: 0 },
    { name: "Layla M.", score: 90, rank: "Math Astronaut", date: "Today, 09:15 AM", hints: 1 },
    { name: "Youssef K.", score: 85, rank: "Math Astronaut", date: "Yesterday", hints: 2 },
    { name: "Hana R.", score: 60, rank: "Star Pilot", date: "Yesterday", hints: 4 },
    { name: "Omar F.", score: 45, rank: "Space Cadet", date: "2 days ago", hints: 3 },
  ];

  // Combine current player if they have a name, otherwise just show mock
  const displayData = currentPlayer.name 
    ? [{ 
        name: currentPlayer.name + " (Current)", 
        score: currentPlayer.score, 
        rank: currentPlayer.score === 100 ? "Galactic Legend" : currentPlayer.score >= 80 ? "Math Astronaut" : "Space Cadet",
        date: "Just Now",
        hints: currentPlayer.hintsUsed
      }, ...mockStudents]
    : mockStudents;

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
          <p className="text-slate-400 text-sm ml-[3.5rem] mt-1 font-medium">Year 3B • Mathematics • Term 2</p>
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
                <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Total Students</p>
                <p className="text-4xl font-bold text-slate-800 font-['Orbitron']">{displayData.length}</p>
             </div>
             <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                <Users className="w-6 h-6" />
             </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
             <div>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Class Average</p>
                <p className="text-4xl font-bold text-slate-800 font-['Orbitron']">
                  {Math.round(displayData.reduce((acc, curr) => acc + curr.score, 0) / displayData.length)}%
                </p>
             </div>
             <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                <Award className="w-6 h-6" />
             </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
             <div>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Top Performer</p>
                <p className="text-lg font-bold text-slate-800 truncate max-w-[150px]">{displayData[0].name}</p>
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
                <input type="text" placeholder="Search student..." className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 w-64" />
            </div>
            <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors text-sm font-bold">
                    <Filter className="w-4 h-4" /> Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors text-sm font-bold shadow-lg shadow-blue-200">
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
                <th className="px-6 py-5 font-bold">Score</th>
                <th className="px-6 py-5 font-bold">Rank</th>
                <th className="px-6 py-5 font-bold">Hints Used</th>
                <th className="px-6 py-5 font-bold">Submitted</th>
                <th className="px-6 py-5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayData.map((student, index) => (
                <tr key={index} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-700 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-xs font-bold text-slate-600">
                        {student.name.charAt(0)}
                    </div>
                    {student.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div 
                                className={`h-full rounded-full ${student.score >= 80 ? 'bg-green-500' : student.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${student.score}%` }}
                            ></div>
                        </div>
                        <span className="text-sm font-bold font-['Orbitron'] text-slate-600">{student.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                      student.score >= 80 ? 'bg-green-50 text-green-600 border-green-200' : 
                      student.score >= 50 ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 
                      'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      {student.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm font-medium">
                    {student.hints > 0 ? <span className="text-amber-500 font-bold">{student.hints}</span> : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs font-medium">{student.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg">
                        <Search className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;