import React from 'react';

interface LogoProps {
  logoUrl?: string;
  subtext?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ logoUrl, subtext = "Soluciones Integrales de Logística", className = "" }) => {
  if (logoUrl) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img 
          src={logoUrl} 
          alt="Vazquez Multitransport Logo" 
          className="h-12 w-auto max-w-[220px] object-contain rounded"
        />
        {subtext && (
          <div className="hidden sm:block border-l border-gray-300 pl-3 py-0.5">
            <span className="text-xs font-semibold tracking-wide text-gray-600 uppercase block">
              {subtext}
            </span>
          </div>
        )}
      </div>
    );
  }

  // High-fidelity custom SVG Vector Logo matching the user image
  return (
    <div className={`flex items-center gap-3 group cursor-pointer ${className}`}>
      <div className="relative flex items-center justify-center">
        <svg viewBox="0 0 400 240" className="w-12 h-10 sm:w-14 sm:h-12 overflow-visible">
          {/* Outer Wings - Primary Color #0E5197 */}
          <path 
            d="M 200 120 C 120 40 40 10 10 0 C 40 50 80 110 120 150 C 150 170 170 180 200 180 C 230 180 250 170 280 150 C 320 110 360 50 390 0 C 360 10 280 40 200 120 Z" 
            fill="var(--primary-color, #0E5197)" 
          />
          <path 
            d="M 200 110 C 130 30 60 5 30 0 C 60 40 100 90 140 130 C 170 150 185 160 200 160 C 215 160 230 150 260 130 C 300 90 340 40 370 0 C 340 5 270 30 200 110 Z" 
            fill="#FFFFFF" 
            opacity="0.25" 
          />
          
          {/* Inner Oval Badge */}
          <ellipse cx="200" cy="120" rx="90" ry="75" fill="#FFFFFF" stroke="var(--primary-color, #0E5197)" strokeWidth="6" />
          
          {/* Mexico Map Silhouette - Secondary Color #1D7946 */}
          <path 
            d="M 160 110 C 165 105 175 102 185 108 C 195 114 205 110 215 115 C 225 120 235 125 240 135 C 235 142 225 145 215 142 C 205 140 195 145 185 140 C 175 135 165 130 160 120 Z" 
            fill="var(--secondary-color, #1D7946)" 
            opacity="0.95"
          />

          {/* VAZQUEZ Text */}
          <text x="200" y="112" textAnchor="middle" fill="var(--primary-color, #0E5197)" fontSize="24" fontWeight="800" fontFamily="sans-serif">
            VAZQUEZ
          </text>
          
          {/* MULTITRANSPORT Text */}
          <text x="200" y="130" textAnchor="middle" fill="var(--primary-color, #0E5197)" fontSize="13" fontWeight="700" letterSpacing="0.5" fontFamily="sans-serif">
            MULTITRANSPORT
          </text>
        </svg>
      </div>

      <div className="flex flex-col leading-tight">
        <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#0E5197] group-hover:opacity-90 transition-opacity">
          VAZQUEZ <span className="text-custom-secondary font-black">MULTITRANSPORT</span>
        </span>
        {subtext && (
          <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};
