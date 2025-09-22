
import React from 'react';
import SpeakerOnIcon from './icons/SpeakerOnIcon';
import SpeakerOffIcon from './icons/SpeakerOffIcon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ambientVolume: number;
  setAmbientVolume: (volume: number) => void;
  toggleAmbientMute: () => void;
  sfxVolume: number;
  setSfxVolume: (volume: number) => void;
  toggleSfxMute: () => void;
  playUISFX: (key: 'click' | 'hover' | 'open' | 'close') => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  ambientVolume,
  setAmbientVolume,
  toggleAmbientMute,
  sfxVolume,
  setSfxVolume,
  toggleSfxMute,
  playUISFX,
}) => {
  if (!isOpen) return null;

  const isAmbientMuted = ambientVolume === 0;
  const isSfxMuted = sfxVolume === 0;

  const handleToggleAmbient = () => {
    playUISFX('click');
    toggleAmbientMute();
  }

  const handleToggleSfx = () => {
    playUISFX('click');
    toggleSfxMute();
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-slate-900/80 border border-pink-500/30 rounded-2xl shadow-2xl shadow-pink-500/10 p-6 md:p-8 w-11/12 max-w-md flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white">Configurações de Áudio</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Fechar configurações"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Ambient Volume */}
        <div className="flex flex-col gap-3">
          <label htmlFor="ambient-volume" className="text-xl text-white/90">Som Ambiente</label>
          <div className="flex items-center gap-4">
            <button onClick={handleToggleAmbient} aria-label={isAmbientMuted ? "Ativar som ambiente" : "Desativar som ambiente"}>
              {isAmbientMuted ? <SpeakerOffIcon className="w-6 h-6 text-white/70 hover:text-white" /> : <SpeakerOnIcon className="w-6 h-6 text-white/70 hover:text-white" />}
            </button>
            <input
              id="ambient-volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={ambientVolume}
              onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-black/30 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>
        </div>

        {/* SFX Volume */}
        <div className="flex flex-col gap-3">
          <label htmlFor="sfx-volume" className="text-xl text-white/90">Efeitos Sonoros (SFX)</label>
          <div className="flex items-center gap-4">
            <button onClick={handleToggleSfx} aria-label={isSfxMuted ? "Ativar efeitos sonoros" : "Desativar efeitos sonoros"}>
              {isSfxMuted ? <SpeakerOffIcon className="w-6 h-6 text-white/70 hover:text-white" /> : <SpeakerOnIcon className="w-6 h-6 text-white/70 hover:text-white" />}
            </button>
            <input
              id="sfx-volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={sfxVolume}
              onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-black/30 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-4 px-8 py-3 text-lg font-bold text-white bg-pink-600 rounded-lg shadow-lg hover:bg-pink-700 transition-transform transform hover:scale-105"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
