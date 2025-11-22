import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "relative px-6 py-3 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg overflow-hidden group";
  
  const variants = {
    primary: "bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-300/30",
    secondary: "bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-slate-200 shadow-[0_0_15px_rgba(15,23,42,0.4)] border border-slate-500/30",
    danger: "bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] border border-red-300/30",
    success: "bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-green-300/30",
    warning: "bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)] border border-amber-300/30",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      {...props}
    >
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      <div className="relative flex items-center justify-center gap-2">
        {children}
      </div>
    </button>
  );
};

export default Button;