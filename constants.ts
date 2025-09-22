
import type { Scene, Fantasy } from './types';
import { Difficulty } from './types';

export const INITIAL_EXCITEMENT = 10;
export const WIN_THRESHOLD = 85;
export const INITIAL_TIMER = 200; // 3 minutes and 20 seconds

export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash';
export const GEMINI_IMAGE_MODEL = 'imagen-4.0-generate-001';

export const getInitialScene = (playerName: string): Scene => ({
  narrative: `Você encurrala sua vizinha, Joyce, na varanda. O nome dela, um sussurro devoto. Ela está presa entre seu corpo e a noite, vestindo um espartilho vermelho que mal contém sua submissão. '${playerName}...', ela geme, 'Eu sabia que você viria. Me use.' Seu pau já está duro, pulsando com a promessa do que está por vir.`,
  options: [
    { text: "✋ Tocar o rosto dela, forçando-a a olhar para você. 'Você é minha esta noite.'" },
    { text: "👅 Passar a língua nos lábios dela. 'Vamos ver o quão molhadinha você pode ficar.'" },
    { text: "🍆 Pressionar seu volume contra ela. 'Sente isso? É tudo para você.'" },
    { text: "⛓️ Sussurrar no ouvido dela. 'Você não tem ideia do que eu vou fazer com você.'" },
  ],
});

export const JOYCE_IMAGE_BASE_PROMPT = "A beautiful Brazilian woman named Joyce, with a devoted and intense expression. She's looking up towards the viewer with a captivating gaze. Style is hyper-realistic digital art, cinematic lighting, focusing on her emotional expression and the intimate atmosphere.";

export const DIFFICULTY_SETTINGS = {
  [Difficulty.Easy]: {
    initialExcitement: 20,
    initialTimer: 240, // 4 minutes
    promptModifier: "Sua Tarefa (Modo Fácil): Seja generoso. Impressione-se mais facilmente e forneça mudanças de excitação mais altas. Faça Joyce ser muito submissa desde o início."
  },
  [Difficulty.Normal]: {
    initialExcitement: 10,
    initialTimer: 200, // 3 min 20 sec
    promptModifier: "Sua Tarefa:"
  },
  [Difficulty.Hard]: {
    initialExcitement: 5,
    initialTimer: 150, // 2 min 30 sec
    promptModifier: "Sua Tarefa (Modo Difícil): Seja exigente. Forneça mudanças de excitação menores para as ações do jogador. Joyce está mais hesitante, e o jogador precisa ser extremamente dominante para excitá-la. Introduza mais riscos de acordar o namorado."
  }
};

export const FANTASY_CHOICES: Fantasy[] = [
    {
        title: 'Encontro na Varanda',
        description: 'A clássica fantasia de seduzir sua vizinha devota, Joyce, na varanda dela, com o namorado dormindo a poucos metros de distância. Intenso, arriscado e íntimo.',
        imagePrompt: 'A beautiful brazilian woman in a red corset on a high-rise city balcony at night, looking up with a mix of fear and desire.',
        initialScene: getInitialScene('PLAYER_NAME'),
        difficulty: Difficulty.Normal,
    },
    {
        title: 'Confessionário Proibido',
        description: 'Joyce, vestida como uma freira, espera por você no confessionário escuro de uma catedral gótica. Ela está pronta para confessar seus pecados... e cometer alguns novos.',
        imagePrompt: 'A beautiful brazilian woman dressed as a nun, kneeling in a dark, ornate confessional booth, bathed in dramatic light filtering through a stained glass window.',
        initialScene: {
            narrative: `A grade do confessionário separa vocês. Do outro lado, Joyce, vestida num hábito de freira que não esconde suas curvas, sussurra. 'Perdoe-me, padre, pois pequei. Tive pensamentos impuros... sobre você.' A voz dela é um veneno doce no silêncio da catedral.`,
            options: [
                { text: " sussurrar de volta, 'Descreva esses pensamentos para mim, minha filha.'" },
                { text: " Bater na grade. 'Ajoelhe-se e peça perdão adequadamente.'" },
                { text: " Abrir a porta do confessionário. 'A confissão será cara a cara.'" },
                { text: " Dizer 'Seus pecados só podem ser limpos pela penitência carnal.'" },
            ],
        },
        difficulty: Difficulty.Hard,
    },
    {
        title: 'Lição Particular',
        description: 'Como seu tutor particular, você tem controle total sobre a jovem e ansiosa Joyce. A lição de hoje não é sobre livros, mas sobre disciplina, poder e prazer.',
        imagePrompt: 'In a dimly lit, book-lined study, a beautiful young brazilian student looks up at her tutor with an adoring, submissive gaze, a ruler resting on the desk.',
        initialScene: {
            narrative: `Joyce se senta à sua frente na biblioteca, a saia do uniforme perigosamente curta. 'Eu não entendo a matéria, professor', ela diz, a voz um convite. 'Acho que preciso de uma... punição... para me ajudar a aprender.' Ela morde o lábio, os olhos fixos em você.`,
            options: [
                { text: " Pegar uma régua. 'Você foi uma menina má. Vire-se sobre a minha mesa.'" },
                { text: " 'A única lição que você precisa aprender é a de obediência. Tire a roupa.'" },
                { text: " Puxar o cabelo dela. 'Sua mente está distraída. Vamos focar em seu corpo.'" },
                { text: " Trancar a porta da biblioteca. 'A aula vai durar a noite toda.'" },
            ],
        },
        difficulty: Difficulty.Easy,
    },
    {
        title: 'Entrevista com a CEO',
        description: 'Você está no escritório luxuoso da poderosa CEO Joyce. Ela está acostumada a estar no comando, mas hoje, você vai virar o jogo e mostrar a ela quem realmente manda.',
        imagePrompt: 'A powerful, beautiful brazilian CEO in a sharp business suit sits behind a large desk in a modern skyscraper office at night, looking up with a challenging, intrigued expression.',
        initialScene: {
            narrative: `Joyce te encara do outro lado de sua mesa de mogno, um sorriso presunçoso nos lábios. 'Então, você acha que tem o que é preciso para esta posição?', ela pergunta, exalando poder. A cidade brilha atrás dela, mas a única coisa que você quer conquistar está na sua frente.`,
            options: [
                { text: " Trancar a porta do escritório. 'A entrevista acabou. Agora começa a sua avaliação.'" },
                { text: " Andar ao redor da mesa dela. 'Eu não quero a posição. Eu quero a CEO.'" },
                { text: " Jogar o currículo dela no chão. 'Vamos falar sobre seus verdadeiros... ativos.'" },
                { text: " Sentar na mesa dela, dominando-a. 'Você está demitida do controle.'" },
            ],
        },
        difficulty: Difficulty.Normal,
    },
];
