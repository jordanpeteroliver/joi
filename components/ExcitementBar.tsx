import React from 'react';

interface ExcitementBarProps {
  level: number;
}

const ExcitementBar: React.FC<ExcitementBarProps> = ({ level }) => {
  const normalizedLevel = Math.max(0, Math.min(100, level));
  
  const getBarColor = (value: number) => {
    if (value < 40) return 'bg-pink-400';
    if (value < 70) return 'bg-pink-600';
    return 'bg-red-600';
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-white/90 mb-2">Tesão de Joyce 💦</h3>
      <div className={`w-full bg-black/30 rounded-full h-6 border-2 border-white/20 overflow-hidden ${normalizedLevel > 50 ? 'pulse' : ''}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(normalizedLevel)}`}
          style={{ width: `${normalizedLevel}%` }}
        ></div>
      </div>
      <p className="text-right text-white/80 font-bold text-lg mt-1">{normalizedLevel}%</p>
    </div>
  );
};

export default ExcitementBar;