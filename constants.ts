import type { Scene } from './types';

export const INITIAL_EXCITEMENT = 10;
export const WIN_THRESHOLD = 85;
export const INITIAL_TIMER = 200; // 3 minutes and 20 seconds

export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash';
export const GEMINI_IMAGE_MODEL = 'imagen-4.0-generate-001';

export const INITIAL_SCENE: Scene = {
  narrative: "Você encurrala sua vizinha, Joyce, na varanda. O nome dela, um sussurro devoto. Ela está presa entre seu corpo e a noite, vestindo um espartilho vermelho que mal contém sua submissão. 'Pedro...', ela geme, 'Eu sabia que você viria. Me use.' Seu pau já está duro, pulsando com a promessa do que está por vir.",
  options: [
    { text: "✋ Tocar o rosto dela, forçando-a a olhar para você. 'Você é minha esta noite.'" },
    { text: "👅 Passar a língua nos lábios dela. 'Vamos ver o quão molhadinha você pode ficar.'" },
    { text: "🍆 Pressionar seu volume contra ela. 'Sente isso? É tudo para você.'" },
    { text: "⛓️ Sussurrar no ouvido dela. 'Você não tem ideia do que eu vou fazer com você.'" },
  ],
};

export const JOYCE_IMAGE_BASE_PROMPT = "A beautiful Brazilian woman named Joyce, with a devoted and intense expression, wearing a striking red corset on a high-rise city balcony at night. She's looking up towards the viewer with a captivating gaze. Style is hyper-realistic digital art, cinematic lighting, focusing on her emotional expression and the intimate atmosphere.";