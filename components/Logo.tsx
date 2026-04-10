import React, { useState } from 'react';

export const LogoPlaceholder = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Fond Soleil Levant */}
    <circle cx="50" cy="50" r="35" fill="#fbbf24" />
    
    {/* Silhouette Mosquée (Noir/Sombre comme sur le logo) */}
    {/* Minaret Central */}
    <path d="M45 20 L55 20 L58 80 H42 L45 20 Z" fill="#022c22" />
    <circle cx="50" cy="18" r="2" fill="#022c22" /> {/* Pointe */}
    
    {/* Dômes / Minarets latéraux */}
    <path d="M30 50 L35 45 L40 50 V80 H30 V50 Z" fill="#022c22" />
    <path d="M60 50 L65 45 L70 50 V80 H60 V50 Z" fill="#022c22" />
    
    {/* Base Verte / Livre ouvert */}
    <path d="M20 75 Q50 90 80 75 V85 Q50 100 20 85 Z" fill="#10b981" />
    
    {/* Croissant / Symbole haut vert */}
    <path d="M50 5 Q60 15 50 25 Q40 15 50 5" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-16 h-16", showText = false }) => {
  const [error, setError] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <div className={`${className} bg-white rounded-full flex items-center justify-center border-2 border-amber-400 overflow-hidden p-0.5 shadow-md`}>
        {!error ? (
          <img 
            src="/logo.png" 
            alt="Logo Munawwirus-Suduur" 
            className="w-full h-full object-contain"
            onError={() => setError(true)}
          />
        ) : (
          <LogoPlaceholder />
        )}
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className="text-white font-serif font-bold text-lg md:text-xl leading-none tracking-wide">Munawwirus-Suduur</span>
          <span className="text-amber-400 text-xs md:text-sm font-serif font-bold tracking-wider uppercase mt-1">Kër Serigne Touba</span>
          <span className="text-emerald-300 text-[10px] uppercase tracking-widest opacity-90">Thiaroye Azur</span>
        </div>
      )}
    </div>
  );
};