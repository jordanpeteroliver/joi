
import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { Scene, Option } from './types';
import { GameStatus } from './types';
import { INITIAL_SCENE, INITIAL_EXCITEMENT, WIN_THRESHOLD, INITIAL_TIMER } from './constants';
import { generateNarrative, generateImage } from './services/geminiService';
import SceneComponent from './components/Scene';
import OptionsComponent from './components/Options';
import ExcitementBar from './components/ExcitementBar';
import SparkleIcon from './components/icons/SparkleIcon';
import TimerDisplay from './components/TimerDisplay';
import SettingsIcon from './components/icons/SettingsIcon';
import SettingsModal from './components/SettingsModal';


declare global {
  interface Window {
    particlesJS: any;
  }
}

const App: React.FC = () => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Menu);
  const [excitement, setExcitement] = useState<number>(INITIAL_EXCITEMENT);
  const [scene, setScene] = useState<Scene>(INITIAL_SCENE);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [endMessage, setEndMessage] = useState<string>('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [timer, setTimer] = useState<number>(INITIAL_TIMER);
  const [showEcstasyPulse, setShowEcstasyPulse] = useState<boolean>(false);
  const [lastTimerChange, setLastTimerChange] = useState<number | null>(null);
  const [excitementFeedback, setExcitementFeedback] = useState<string | null>(null);
  
  // Audio State
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [ambientVolume, setAmbientVolume] = useState<number>(0.1);
  const [sfxVolume, setSfxVolume] = useState<number>(0.5);
  const [lastAmbientVolume, setLastAmbientVolume] = useState<number>(0.1);
  const [lastSfxVolume, setLastSfxVolume] = useState<number>(0.5);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const cityLightsRef = useRef<HTMLDivElement>(null);
  const ambientAudioRefs = useRef<HTMLAudioElement[]>([]);
  const sfxAudioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  
  // Audio Control Handlers
  const handleAmbientVolumeChange = (volume: number) => {
    setAmbientVolume(volume);
    if (volume > 0) {
      setLastAmbientVolume(volume);
    }
  };

  const toggleAmbientMute = () => {
    if (ambientVolume > 0) {
      setAmbientVolume(0);
    } else {
      setAmbientVolume(lastAmbientVolume > 0 ? lastAmbientVolume : 0.1);
    }
  };

  const handleSfxVolumeChange = (volume: number) => {
    setSfxVolume(volume);
    if (volume > 0) {
      setLastSfxVolume(volume);
    }
  };

  const toggleSfxMute = () => {
    if (sfxVolume > 0) {
      setSfxVolume(0);
    } else {
      setSfxVolume(lastSfxVolume > 0 ? lastSfxVolume : 0.5);
    }
  };

  // Audio Initialization
  useEffect(() => {
    // Ambient Sounds
    const audioSources = [
      { src: 'https://soundimage.org/wp-content/uploads/2016/03/Future-City-Ambience-1.mp3' }, // Cyberpunk City Ambience
      { src: 'https://soundimage.org/wp-content/uploads/2020/01/Dark-Ambience.mp3' }, // Dark Ambient
      { src: 'https://soundimage.org/wp-content/uploads/2017/04/Wind-Sound-Effect.mp3' }  // Wind Sound Effect
    ];
    
    ambientAudioRefs.current = audioSources.map(source => {
      const audio = new Audio(source.src);
      audio.loop = true;
      audio.onerror = () => console.error(`Error loading ambient audio: ${source.src}`);
      return audio;
    });

    // Sound Effects
    const sfxSources: { [key: string]: string } = {
      slap: 'https://cdn.pixabay.com/audio/2022/03/15/audio_22533230c1.mp3', // Body Slap
      moan: 'https://cdn.pixabay.com/audio/2023/11/26/audio_9592f654b9.mp3', // Female Moan
      wet: 'https://cdn.pixabay.com/audio/2022/11/19/audio_24483161ce.mp3'  // Slime Squish
    };

    Object.keys(sfxSources).forEach(key => {
      const audio = new Audio(sfxSources[key]);
      audio.onerror = () => console.error(`Error loading SFX: ${key} from ${sfxSources[key]}`);
      sfxAudioRefs.current[key] = audio;
    });

    return () => {
      ambientAudioRefs.current.forEach(audio => audio.pause());
    };
  }, []);

  // Volume control effects
  useEffect(() => {
    ambientAudioRefs.current.forEach(audio => {
      audio.volume = ambientVolume;
    });
  }, [ambientVolume]);

  useEffect(() => {
    Object.values(sfxAudioRefs.current).forEach(audio => {
      audio.volume = sfxVolume;
    });
  }, [sfxVolume]);

  // Game state audio effects
  useEffect(() => {
    const audios = ambientAudioRefs.current;
    if (gameStatus === GameStatus.Playing) {
      audios.forEach(audio => {
        audio.play().catch(e => console.error("Ambient audio failed to play:", e));
      });
    } else {
      audios.forEach(audio => {
        audio.pause();
      });
    }
  }, [gameStatus]);

  useEffect(() => {
    if (!window.speechSynthesis) return;
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!starsRef.current || !cityLightsRef.current) return;
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;
      const moveX = (clientX / innerWidth - 0.5);
      const moveY = (clientY / innerHeight - 0.5);
      const starsIntensity = 20;
      const cityLightsIntensity = 40;
      starsRef.current.style.transform = `translate(${moveX * starsIntensity}px, ${moveY * starsIntensity}px)`;
      cityLightsRef.current.style.transform = `translate(${moveX * cityLightsIntensity}px, ${moveY * cityLightsIntensity}px)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const speak = useCallback((text: string) => {
    if (sfxVolume === 0 || !window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const ptBRVoice = voices.find(voice => voice.lang === 'pt-BR' && voice.name.includes('Google')) || voices.find(voice => voice.lang === 'pt-BR');
    if (ptBRVoice) utterance.voice = ptBRVoice;
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  }, [sfxVolume, voices]);

  const startTimer = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          const endMsg = "O tempo acabou! Você ouve o namorado dela se mexendo. Joyce te empurra, com os olhos cheios de pânico e desejo frustrado. 'Você precisa ir. Agora!'";
          setEndMessage(endMsg);
          setGameStatus(GameStatus.Lost);
          speak(endMsg);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [speak]);

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  const startGame = useCallback(async () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setGameStatus(GameStatus.Loading);
    setTimer(INITIAL_TIMER);
    setImageLoading(true);
    setShowEcstasyPulse(false);
    setExcitement(INITIAL_EXCITEMENT);
    setScene(INITIAL_SCENE);
    setLastTimerChange(null);
    const initialImage = await generateImage(`with an inviting, devoted smile`);
    setImageUrl(initialImage);
    setImageLoading(false);
    setGameStatus(GameStatus.Playing);
    speak(INITIAL_SCENE.narrative);
    startTimer();
  }, [speak, startTimer]);

  const handleOptionSelect = useCallback(async (option: Option) => {
    setGameStatus(GameStatus.Loading);
    stopTimer();
    setLastTimerChange(null);
    
    const response = await generateNarrative(scene.narrative, option.text, excitement, timer);
    
    if ('vibrate' in navigator) {
      if (response.hapticFeedback === 'strong') navigator.vibrate(200);
      else if (response.hapticFeedback === 'light') navigator.vibrate(50);
    }

    // Enhanced SFX logic: Play based on AI hint or keyword detection in narrative
    let sfxToPlay: string | undefined = response.sfx;

    if (!sfxToPlay) {
      const combinedText = (response.narrative + ' ' + option.text).toLowerCase();
      if (/\b(tapa|bateu|estalo|esbofeteou|slap)\b/.test(combinedText)) {
        sfxToPlay = 'slap';
      } else if (/\b(gemeu|gemido|arfa|arfar|suspira|suspirou|moan)\b/.test(combinedText)) {
        sfxToPlay = 'moan';
      } else if (/\b(molhada|úmida|escorrendo|encharcada|squish|wet)\b/.test(combinedText)) {
        sfxToPlay = 'wet';
      }
    }

    if (sfxToPlay && sfxAudioRefs.current[sfxToPlay]) {
      const audio = sfxAudioRefs.current[sfxToPlay];
      audio.currentTime = 0;
      audio.play().catch(e => console.error(`SFX '${sfxToPlay}' failed to play:`, e));
    }

    const oldExcitement = excitement;
    const newExcitement = Math.max(0, Math.min(100, excitement + response.excitementChange));
    
    if (oldExcitement < 75 && newExcitement >= 75) {
        setExcitementFeedback('high');
    } else if (oldExcitement < 50 && newExcitement >= 50) {
        setExcitementFeedback('medium');
    }
    
    setExcitement(newExcitement);
    setShowEcstasyPulse(newExcitement > 75);

    if (response.timerChange) {
      setTimer(prev => Math.max(0, prev + response.timerChange!));
      setLastTimerChange(response.timerChange);
    }

    if (response.gameState === 'win' || newExcitement >= WIN_THRESHOLD) {
      const winMessage = response.winMessage || 'Você a dominou completamente!';
      setEndMessage(winMessage);
      speak(winMessage);
      const winImage = await generateImage(`an expression of pure ecstasy, utterly captivated`);
      setImageUrl(winImage);
      setGameStatus(GameStatus.Won);
      return;
    }

    if (response.gameState === 'lose') {
      const loseMessage = response.loseMessage || 'Fim de Jogo!';
      setEndMessage(loseMessage);
      speak(loseMessage);
      const loseImage = await generateImage(`looking terrified as a large angry man appears behind her`);
      setImageUrl(loseImage);
      setGameStatus(GameStatus.Lost);
      return;
    }

    setScene({ narrative: response.narrative, options: response.options });
    speak(response.narrative);

    setImageLoading(true);
    const newImage = await generateImage(`${response.emotionForImage}`);
    setImageUrl(newImage);
    setImageLoading(false);

    setGameStatus(GameStatus.Playing);
    startTimer();
  }, [scene.narrative, excitement, speak, timer, startTimer]);
  
  useEffect(() => {
    if (excitementFeedback) {
      const timer = setTimeout(() => setExcitementFeedback(null), 1500); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [excitementFeedback]);

  useEffect(() => {
    if (gameStatus === GameStatus.Won) {
       if (window.particlesJS) {
        window.particlesJS('particles-js', { particles: { number: { value: 200, density: { enable: true, value_area: 800 } }, color: { value: "#ffffff" }, shape: { type: "circle" }, opacity: { value: 0.8, random: true }, size: { value: 2, random: true }, line_linked: { enable: false }, move: { enable: true, speed: 3, direction: "bottom", random: false, straight: false, out_mode: "out", bounce: false } }, interactivity: { detect_on: "canvas", events: { onhover: { enable: false }, onclick: { enable: false } } });
      }
    } else {
      const particlesContainer = document.getElementById('particles-js');
      if (particlesContainer) {
        particlesContainer.innerHTML = '';
      }
    }
  }, [gameStatus]);

  const renderContent = () => {
    switch (gameStatus) {
      case GameStatus.Menu:
        return (
          <div className="text-center text-white flex flex-col items-center gap-6 p-4">
            <h1 className="text-6xl font-bold">RPG Flirty Anatômico</h1>
            <h2 className="text-3xl text-pink-300">Versão Selvagem e Overclockada</h2>
            <p className="text-xl max-w-2xl text-white/80">
              Assuma o controle na varanda com sua vizinha devota, Joyce. O namorado dela dorme lá dentro. Suas escolhas dominantes determinarão se a noite termina em êxtase... ou em desastre.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={startGame}
                className="mt-4 px-12 py-4 text-xl font-bold text-white bg-pink-600 rounded-lg shadow-lg hover:bg-pink-700 transition-transform transform hover:scale-105"
              >
                Começar Jogo
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="mt-4 px-4 py-4 text-xl font-bold text-white bg-gray-700/50 rounded-lg shadow-lg hover:bg-gray-600/70 transition-transform transform hover:scale-105"
                aria-label="Configurações de Áudio"
              >
                <SettingsIcon className="w-8 h-8"/>
              </button>
            </div>
          </div>
        );
      case GameStatus.Won:
      case GameStatus.Lost:
        stopTimer();
        return (
            <div className="text-center text-white flex flex-col items-center gap-6 p-4">
                <div className="w-full max-w-sm aspect-[3/4] rounded-lg shadow-2xl shadow-black/50 overflow-hidden border-2 border-white/10 mb-4">
                    {imageUrl && <img src={imageUrl} alt="End game scene" className="w-full h-full object-cover" />}
                </div>
                <h1 className="text-5xl font-bold">{gameStatus === GameStatus.Won ? 'Vitória!' : 'Fim de Jogo!'}</h1>
                <p className="text-xl max-w-2xl text-white/80 bg-black/40 p-4 rounded-lg">{endMessage}</p>
                <button
                    onClick={startGame}
                    className="mt-4 px-12 py-4 text-xl font-bold text-white bg-gray-600 rounded-lg shadow-lg hover:bg-gray-700 transition-transform transform hover:scale-105"
                >
                    Jogar Novamente
                </button>
            </div>
        );
      case GameStatus.Playing:
      case GameStatus.Loading:
        return (
          <div className="w-full h-full flex flex-col md:flex-row gap-4 p-4 items-start">
            <aside className="w-full md:w-1/3 lg:w-1/4 bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-pink-400">
                  <SparkleIcon className="w-6 h-6"/>
                  <h2 className="text-2xl font-bold text-white">Status</h2>
                </div>
                <button 
                  onClick={() => setIsSettingsOpen(true)} 
                  className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                  aria-label="Abrir configurações de áudio"
                >
                  <SettingsIcon className="w-6 h-6" />
                </button>
              </div>
              <ExcitementBar level={excitement} />
              <TimerDisplay seconds={timer} lastChange={lastTimerChange} />
              {gameStatus === GameStatus.Loading && (
                 <div className="flex items-center justify-center gap-2 text-white/70 mt-4">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Joyce está cedendo...</span>
                 </div>
              )}
            </aside>
            <main className="w-full md:w-2/3 lg:w-3/4 flex-grow flex flex-col items-center relative">
              {excitement > 70 && (
                <div className="neon-overlay" aria-hidden="true">
                  <div className="heart"></div>
                  <div className="heart"></div>
                  <div className="heart"></div>
                  <div className="heart"></div>
                  <div className="heart"></div>
                </div>
              )}
              <SceneComponent 
                imageUrl={imageUrl} 
                narrative={scene.narrative} 
                imageLoading={imageLoading && gameStatus === GameStatus.Loading} 
                excitementLevel={excitement}
                excitementFeedback={excitementFeedback} 
              />
              <OptionsComponent options={scene.options} onOptionSelect={handleOptionSelect} disabled={gameStatus === GameStatus.Loading} onOptionHover={speak} />
            </main>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen w-full animated-background text-white">
      <div id="stars" ref={starsRef}></div>
      <div id="city-lights" aria-hidden="true" ref={cityLightsRef}></div>
      <div id="particles-js"></div>
      {showEcstasyPulse && <div className="ecstasy-pulse" aria-hidden="true"></div>}
      
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        ambientVolume={ambientVolume}
        setAmbientVolume={handleAmbientVolumeChange}
        toggleAmbientMute={toggleAmbientMute}
        sfxVolume={sfxVolume}
        setSfxVolume={handleSfxVolumeChange}
        toggleSfxMute={toggleSfxMute}
      />

      <div className="content-wrapper min-h-screen w-full bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
