
import React, { useState, useEffect } from 'react';
import { FANTASY_CHOICES } from '../constants';
import type { Fantasy } from '../types';
import FantasyCard from './FantasyCard';
import { generateImage } from '../services/geminiService';
import SettingsIcon from './icons/SettingsIcon';

interface FantasyMenuProps {
  onFantasySelect: (fantasy: Fantasy) => void;
  playUISFX: (key: 'click' | 'hover') => void;
  onOpenSettings: () => void;
}

const FantasyMenu: React.FC<FantasyMenuProps> = ({ onFantasySelect, playUISFX, onOpenSettings }) => {
  const [imageUrls, setImageUrls] = useState<(string | null)[]>(Array(FANTASY_CHOICES.length).fill(null));
  const [loadingStates, setLoadingStates] = useState<boolean[]>(Array(FANTASY_CHOICES.length).fill(true));

  useEffect(() => {
    const fetchImages = async () => {
      const newImageUrls = [...imageUrls];
      const newLoadingStates = [...loadingStates];
      
      for (let i = 0; i < FANTASY_CHOICES.length; i++) {
        if (!newImageUrls[i]) {
          try {
            const url = await generateImage(FANTASY_CHOICES[i].imagePrompt);
            newImageUrls[i] = url;
          } catch (error) {
            console.error(`Failed to generate image for fantasy ${i}:`, error);
            newImageUrls[i] = "https://picsum.photos/600/800"; // Fallback
          } finally {
            newLoadingStates[i] = false;
            setImageUrls([...newImageUrls]);
            setLoadingStates([...newLoadingStates]);
          }
        }
      }
    };

    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto text-center text-white flex flex-col items-center gap-6 p-4">
      <h1 className="text-6xl font-bold">RPG Flirty Anatômico</h1>
      <h2 className="text-3xl text-pink-300">Escolha Sua Fantasia</h2>
      <p className="text-xl max-w-3xl text-white/80">
        Cada escolha inicia uma história diferente. Domine Joyce em cenários proibidos onde suas decisões moldam o êxtase... ou o desastre.
      </p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {FANTASY_CHOICES.map((fantasy, index) => (
          <FantasyCard
            key={fantasy.title}
            fantasy={fantasy}
            onSelect={onFantasySelect}
            imageUrl={imageUrls[index]}
            isLoading={loadingStates[index]}
            playUISFX={playUISFX}
          />
        ))}
      </div>
       <button
            onClick={onOpenSettings}
            className="mt-8 p-3 text-white bg-gray-700/50 rounded-full shadow-lg hover:bg-gray-600/70 transition-transform transform hover:scale-105"
            aria-label="Configurações de Áudio"
          >
          <SettingsIcon className="w-8 h-8"/>
        </button>
    </div>
  );
};

export default FantasyMenu;
