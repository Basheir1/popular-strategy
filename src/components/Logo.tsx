import React from 'react';
import { TrendingUp } from 'lucide-react';

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ className = '', onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2.5 ${className} ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
    >
      <div className="relative">
        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
        </div>
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-white"></div>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold text-[#111827] tracking-tight">Popular Strategy</span>
      </div>
    </button>
  );
};