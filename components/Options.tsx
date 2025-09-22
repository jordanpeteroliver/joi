
import React from 'react';
import type { Option } from '../types';

interface OptionsProps {
  options: Option[];
  onOptionSelect: (option: Option) => void;
  disabled: boolean;
  onOptionHover: (text: string) => void;
}

const Options: React.FC<OptionsProps> = ({ options, onOptionSelect, disabled, onOptionHover }) => {
  return (
    <div className="w-full max-w-xl flex flex-col items-center gap-3 p-4">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onOptionSelect(option)}
          onMouseEnter={() => onOptionHover(option.text)}
          onTouchStart={() => onOptionHover(option.text)}
          disabled={disabled}
          className="w-full text-white text-md font-medium px-6 py-3 rounded-lg border border-white/20 bg-black/30 backdrop-blur-sm
                     transition-all duration-200
                     hover:bg-white/10 hover:border-white/40 hover:scale-[1.02] hover:shadow-lg hover:shadow-pink-500/40
                     active:scale-[0.98] active:bg-black/50 active:shadow-inner
                     focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black/30 disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          {option.text}
        </button>
      ))}
    </div>
  );
};

export default Options;
