
import type { Scene as VercelScene } from '@vercel/ai-react';

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
  // FIX: Corrected the type definition and added a semicolon.
  hapticFeedback?: 'light' | 'strong';
  // FIX: Added the missing 'sfx' property to match its usage.
  sfx?: string;
}
