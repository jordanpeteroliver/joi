import React, { useState, useEffect } from 'react';

interface TimerDisplayProps {
  seconds: number;
  lastChange?: number | null;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ seconds, lastChange }) => {
  const [changeIndicator, setChangeIndicator] = useState<{ value: number; key: number } | null>(null);

  useEffect(() => {
    if (lastChange !== null && lastChange !== undefined) {
      // Use a key to force re-render/re-animation even if the value is the same
      setChangeIndicator({ value: lastChange, key: Date.now() }); 
    }
  }, [lastChange]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const secondsLeft = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
  };

  const isLowTime = seconds <= 30;

  return (
    <div className="w-full p-3 bg-black/30 rounded-lg border border-white/20">
      <h3 className="text-lg font-semibold text-white/90 mb-2 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Tempo Restante</span>
      </h3>
      <div className="relative flex items-center justify-center h-10">
        <p className={`text-center text-4xl font-bold font-mono transition-colors duration-300 ${isLowTime ? 'text-red-500 animate-pulse' : 'text-white/80'}`}>
          {formatTime(seconds)}
        </p>
        {changeIndicator && (
          <span
            key={changeIndicator.key}
            className={`absolute right-0 text-2xl font-bold animate-swoosh-out ${changeIndicator.value > 0 ? 'text-green-400' : 'text-red-500'}`}
          >
            {changeIndicator.value > 0 ? `+${changeIndicator.value}` : changeIndicator.value}s
          </span>
        )}
      </div>
    </div>
  );
};

export default TimerDisplay;