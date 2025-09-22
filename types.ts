export enum GameStatus {
  Menu = 'menu',
  Playing = 'playing',
  Loading = 'loading',
  Won = 'won',
  Lost = 'lost',
}

export interface Option {
  text: string;
}

export interface Scene {
  narrative: string;
  options: Option[];
}

export interface NarrativeResponse {
  narrative: string;
  options: Option[];
  excitementChange: number;
  emotionForImage: string;
  gameState: 'continue' | 'win' | 'lose';
  winMessage?: string;
  loseMessage?: string;
  timerChange?: number;
  hapticFeedback?: 'light' | 'strong';
  sfx?: 'slap' | 'moan' | 'wet';
}