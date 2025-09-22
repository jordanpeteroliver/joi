
import React from 'react';
import type { Fantasy } from '../types';
import { Difficulty } from '../types';

interface FantasyCardProps {
    fantasy: Fantasy;
    onSelect: (fantasy: Fantasy) => void;
    imageUrl: string | null;
    isLoading: boolean;
    playUISFX: (key: 'click' | 'hover') => void;
}

const DifficultyBadge: React.FC<{ difficulty: Difficulty }> = ({ difficulty }) => {
    const styles = {
        [Difficulty.Easy]: 'bg-green-600/80 border-green-400/50 text-white',
        [Difficulty.Normal]: 'bg-pink-600/80 border-pink-400/50 text-white',
        [Difficulty.Hard]: 'bg-red-700/80 border-red-500/50 text-white',
    };
    const text = {
        [Difficulty.Easy]: 'Fácil 😈',
        [Difficulty.Normal]: 'Normal 🔥',
        [Difficulty.Hard]: 'Difícil 💀',
    }
    return (
        <span className={`absolute top-3 right-3 px-3 py-1 text-sm font-bold rounded-full border-2 backdrop-blur-sm ${styles[difficulty]}`}>
            {text[difficulty]}
        </span>
    )
}

const ImageLoader: React.FC = () => (
    <div className="absolute inset-0 bg-black/50 animate-pulse flex items-center justify-center">
        <svg className="w-10 h-10 text-white/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
    </div>
);

const FantasyCard: React.FC<FantasyCardProps> = ({ fantasy, onSelect, imageUrl, isLoading, playUISFX }) => {
    return (
        <div 
            className="bg-black/40 border border-white/10 rounded-xl overflow-hidden shadow-lg shadow-black/40
                       flex flex-col transition-all duration-300 hover:border-white/30 hover:shadow-pink-500/30 hover:scale-[1.03]"
            onMouseEnter={() => playUISFX('hover')}
        >
            <div className="relative w-full aspect-[3/4]">
                {isLoading || !imageUrl ? <ImageLoader /> : <img src={imageUrl} alt={fantasy.title} className="w-full h-full object-cover" />}
                <DifficultyBadge difficulty={fantasy.difficulty} />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-white mb-2">{fantasy.title}</h3>
                <p className="text-white/80 text-sm flex-grow mb-4">{fantasy.description}</p>
                <button
                    onClick={() => {
                        playUISFX('click');
                        onSelect(fantasy);
                    }}
                    disabled={isLoading}
                    className="w-full mt-auto px-6 py-3 text-lg font-bold text-white bg-pink-600 rounded-lg shadow-lg 
                               hover:bg-pink-700 transition-transform transform hover:scale-105 
                               border-2 border-pink-400/50
                               disabled:bg-gray-600 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {isLoading ? 'Carregando...' : 'Escolher Fantasia'}
                </button>
            </div>
        </div>
    );
};

export default FantasyCard;
