import type { Fantasy } from './types';
import { Difficulty } from './types';

export const INITIAL_EXCITEMENT = 10;
export const WIN_THRESHOLD = 100; // Increased to match 12-level progression
export const INITIAL_TIMER = 200; // 3 minutes and 20 seconds

export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash';
export const GEMINI_IMAGE_MODEL = 'imagen-4.0-generate-001';

// FIX: Renamed KEEVARA_IMAGE_BASE_PROMPT to JOYCE_IMAGE_BASE_PROMPT and updated the character name for consistency.
export const JOYCE_IMAGE_BASE_PROMPT = "Joyce, a cyberpunk succubus hacker with glowing data tattoos, her expression a mix of submissive adoration and digital lust. Hyper-realistic digital art, neon-drenched cyberpunk aesthetic, intimate and intense atmosphere, safe-for-work.";

export const DIFFICULTY_SETTINGS = {
  [Difficulty.Easy]: {
    initialExcitement: 20,
    initialTimer: 240, // 4 minutes
    // FIX: Replaced 'Keevara' with 'Joyce' for character consistency.
    promptModifier: "Sua Tarefa (Modo Fácil): Seja generoso. Joyce se excita muito facilmente. Forneça altas recompensas de Tesão para ações dominantes."
  },
  [Difficulty.Normal]: {
    initialExcitement: 10,
    initialTimer: 200, // 3 min 20 sec
    promptModifier: "Sua Tarefa:"
  },
  [Difficulty.Hard]: {
    initialExcitement: 5,
    initialTimer: 150, // 2 min 30 sec
    // FIX: Replaced 'Keevara' with 'Joyce' for character consistency.
    promptModifier: "Sua Tarefa (Modo Difícil): Seja exigente. Joyce é resistente. O jogador precisa ser extremamente dominante e criativo para excitá-la. As recompensas de Tesão são menores."
  }
};

// FIX: Replaced all instances of 'Keevara' with 'Joyce' for character consistency.
export const FANTASY_CHOICES: Fantasy[] = [
    {
        title: 'Confissão Proibida',
        description: 'No confessionário neon de uma catedral cyberpunk, a noviça Joyce aguarda. Ela precisa confessar seus pecados de luxúria... e você é o padre que a fará cometê-los.',
        imagePrompt: 'A beautiful cyberpunk succubus dressed as a nun, kneeling in a dark, neon-lit confessional booth, bathed in dramatic light filtering through a holographic stained glass window.',
        initialScene: {
            narrative: `A grade do confessionário digital projeta um brilho neon fraco no rosto de Joyce. Vestida como uma freira, o hábito não consegue esconder os contornos de seu corpo cibernético. 'Perdoe-me, padre, pois eu pequei,' ela sussurra, a voz processada com um eco de luxúria. 'Tive pensamentos impuros, sobre o seu pau de titânio me rasgando em duas.'`,
            options: [
                { text: "🙏 Sussurrar, 'Descreva cada detalhe desses pensamentos, minha filha.'" },
                { text: "⛓️ Bater na grade. 'Ajoelhe-se. A penitência será seu rabo implorando.'" },
                { text: "👅 'Sua boca será o altar onde seus pecados serão limpos. Abra-a.'" },
                { text: "🍆 Pressionar seu volume contra a grade. 'Sinta a resposta às suas preces.'" },
            ],
        },
        difficulty: Difficulty.Hard,
    },
    {
        title: 'Cozinha Familiar',
        description: 'Sua enteada Joyce está na cozinha, vestindo apenas um avental. A mamãe dorme no andar de cima. Uma fantasia incestuosa perigosa e excitante está prestes a começar.',
        imagePrompt: 'In a hyper-modern kitchen, a young cyberpunk succubus wearing only an apron looks over her shoulder with a seductive, inviting gaze, her body illuminated by the light of the fridge.',
        initialScene: {
            narrative: `Você encontra Joyce na cozinha. Ela está de costas, vestindo apenas um avental que mal cobre a bunda redonda e empinada. 'Papai...' ela diz, sem se virar. 'Preparei uma sobremesa especial pra você. Mas você tem que comer aqui. Quietinho. A mamãe não pode acordar.'`,
            options: [
                { text: "✋ Puxar o cabelo dela. 'Vire-se. Quero ver seu rosto enquanto te como.'" },
                { text: "👅 Lamber o pescoço dela por trás. 'A sobremesa é você, vadiazinha.'" },
                { text: "🍆 Esfregar seu pau duro na bunda dela. 'Acho que já sei o que é.'" },
                { text: "⛓️ Amarrar as mãos dela com o cinto. 'Você vai ficar assim. De quatro.'" },
            ],
        },
        difficulty: Difficulty.Easy,
    },
    // FIX: Completed the 'Entrevista com a CEO' fantasy object, adding options, difficulty and correcting the narrative which was previously malformed and incomplete.
    {
        title: 'Entrevista com a CEO',
        description: 'No topo de um arranha-céu, a CEO Joyce domina seu império. Hoje, você, um estagiário, vai virar o jogo e mostrar quem tem o verdadeiro poder.',
        imagePrompt: 'A powerful, beautiful cyberpunk CEO in a sharp business suit sits behind a large holographic desk in a futuristic skyscraper office at night, looking up with a challenging, intrigued expression.',
        initialScene: {
            narrative: `Joyce te encara de sua cadeira de CEO, um sorriso sádico no rosto. 'Então, o estagiário acha que merece uma promoção?', ela zomba. 'Mostre-me por que eu não deveria te demitir e te foder aqui mesmo, na minha mesa.'`,
            options: [
                { text: "✋ Bater na mesa. 'A promoção é você, de quatro, implorando.'" },
                { text: "👅 Andar até ela. 'Vou te mostrar com a minha língua o que eu mereço.'" },
                { text: "🍆 Abrir o zíper. 'Porque eu sou o único que pode te dar o que você quer.'" },
                { text: "⛓️ Tirar o cinto. 'A única demissão aqui será a da sua compostura.'" },
            ],
        },
        difficulty: Difficulty.Normal,
    },
];
