
import { GoogleGenAI, Type } from "@google/genai";
import type { NarrativeResponse, Difficulty } from '../types';
import { GEMINI_TEXT_MODEL, GEMINI_IMAGE_MODEL, JOYCE_IMAGE_BASE_PROMPT, DIFFICULTY_SETTINGS } from '../constants';

if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const responseSchema: any = {
  type: Type.OBJECT,
  properties: {
    narrative: {
      type: Type.STRING,
      description: "The next part of the story. Make it extremely seductive, explicit, and dirty, fitting a BDSM fantasy. Describe Joyce's submissive and visceral reaction. Use strong sexual language. Her boyfriend is sleeping inside, adding tension.",
    },
    options: {
      type: Type.ARRAY,
      description: "An array of 3 distinct, compelling, and explicit choices for the player. Include a relevant emoji (✋, 👅, 🍆, ⛓️) at the start of each option text.",
      items: {
        type: Type.OBJECT,
        properties: {
          text: {
            type: Type.STRING,
            description: "The text for the player's choice button. Start with an emoji.",
          },
        },
        required: ["text"],
      },
    },
    excitementChange: {
      type: Type.NUMBER,
      description: "Integer for Joyce's arousal change. A dominant, risky action could be +20. A weak tease +5. An offensive remark -10.",
    },
    emotionForImage: {
      type: Type.STRING,
      description: "A short phrase describing Joyce's primary emotion for the next image (e.g., 'biting her lip in anticipation', 'a look of intense pleasure', 'eyes wide with adoration', 'a begging look in her eyes'). Keep the description evocative but safe-for-work.",
    },
    gameState: {
      type: Type.STRING,
      description: "Game state. 'continue' for normal play. 'win' if arousal is very high. 'lose' if the boyfriend catches them.",
    },
    winMessage: {
        type: Type.STRING,
        description: "An explicit message for a 'win' state. E.g., 'Ela goza, gritando seu nome. 'Me enche, [PLAYER_NAME]... enche-me com a sua porra!' Você a joga na parede e a fode até o amanhecer.'"
    },
    loseMessage: {
        type: Type.STRING,
        description: "A message for a 'lose' state. E.g., 'Um barulho de tosse vem de dentro. 'Droga, ele acordou!' ela sussurra, empurrando você para longe. É o fim do jogo.'"
    },
    timerChange: {
        type: Type.NUMBER,
        description: "Optional. An integer to add or subtract from the boyfriend timer. A noisy/risky action (like a loud slap) should be -10 seconds. A seductive, distracting action that buys time should be +5 seconds. Only include if the action justifies it.",
    },
    hapticFeedback: {
      type: Type.STRING,
      description: "Optional. Trigger phone vibration. 'light' for a tease, 'strong' for an impact like a slap or deep thrust.",
    },
    sfx: {
      type: Type.STRING,
      description: "Optional. Trigger a sound effect. 'slap' for a slap, 'moan' for a suggestive moan, 'wet' for a squishing sound.",
    }
  },
  required: ["narrative", "options", "excitementChange", "emotionForImage", "gameState"],
};


export const generateNarrative = async (
  playerName: string,
  currentNarrative: string,
  playerChoice: string,
  currentExcitement: number,
  remainingTime: number,
  difficulty: Difficulty,
): Promise<NarrativeResponse> => {
  const difficultyModifier = DIFFICULTY_SETTINGS[difficulty].promptModifier;

  const prompt = `
    Você é um mestre de jogo para um RPG erótico BDSM explícito.
    Sua tarefa é continuar a história, respondendo em um formato JSON específico.

    **CONTEXTO DO JOGO:**
    - Jogador: '${playerName}', o Dominante.
    - Personagem: 'Joyce', a submissa.
    - Cenário: Varia de acordo com a fantasia, mas o objetivo é dominar Joyce.
    - Objetivo: Aumentar o Tesão (excitement) de Joyce para 85+ para vencer. Risco de falha existe (ex: namorado acordar).

    **ESTADO ATUAL:**
    - Nível de Tesão: ${currentExcitement}/100
    - Tempo Restante: ${remainingTime} segundos.
    - Dificuldade: ${difficulty}. ${difficultyModifier}

    **HISTÓRICO DA CENA:**
    - Narrativa Anterior: "${currentNarrative}"
    - Ação do Jogador: "${playerChoice}"

    **SUA TAREFA (PROCESSO DE PENSAMENTO):**
    1.  **Analisar a Ação:** Considere a ação do jogador ("${playerChoice}"). É dominante, terna, arriscada, barulhenta? Como Joyce, em seu estado atual de tesão, reagiria a isso?
    2.  **Escalar a Narrativa:** Aumente a intensidade. A história deve se tornar progressivamente mais explícita e suja. Descreva a reação física e emocional de Joyce de forma visceral. Use linguagem sexual forte e criativa (pau, buceta, porra, etc.).
    3.  **Determinar Consequências:**
        - **Tesão:** Calcule a mudança no tesão. Uma ação forte e dominante aumenta muito (+15-20). Uma provocação leve, menos (+5-10). Uma ação ruim, diminui (-5-10).
        - **Tempo:** A ação foi barulhenta (um tapa alto, um grito)? Subtraia tempo (-10s). Foi uma distração sedutora que faz o tempo passar mais rápido para eles? Adicione tempo (+5s). Se não, não altere o tempo.
        - **Feedback:** A ação envolveu um impacto físico (tapa, estocada)? Adicione \`hapticFeedback: "strong"\`. Uma provocação? \`hapticFeedback: "light"\`.
        - **SFX:** A ação produziria um som distinto? Use 'slap', 'moan', ou 'wet' quando apropriado para imersão.
    4.  **Verificar Condições de Fim de Jogo:**
        - O tesão total ultrapassou 85? Defina \`gameState: "win"\` e escreva uma cena de clímax explícita para \`winMessage\`.
        - A ação foi tão arriscada que gerou uma falha (ex: acordou o namorado)? Defina \`gameState: "lose"\` e escreva uma mensagem de falha para \`loseMessage\`.
        - Caso contrário, \`gameState: "continue"\`.
    5.  **Criar Novas Opções:** Gere 3 novas opções explícitas e distintas para o jogador que sigam logicamente a nova narrativa. Cada uma deve começar com um emoji relevante (✋, 👅, 🍆, ⛓️).
    6.  **Gerar Emoção para Imagem:** Descreva a emoção facial de Joyce em uma frase curta e SFW para a geração de imagem (ex: 'mordendo o lábio em antecipação', 'olhar de prazer intenso').

    **SAÍDA:**
    Responda APENAS com o objeto JSON formatado de acordo com o schema fornecido. Não inclua texto ou explicações fora do JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText) as NarrativeResponse;
    return parsedResponse;
  } catch (error) {
    console.error("Error generating narrative:", error);
    // Fallback in case of API error
    return {
      narrative: "Ocorreu um erro ao gerar a próxima cena. A tensão deve ter quebrado a conexão. Por favor, tente novamente.",
      options: [{ text: "Tentar novamente" }],
      excitementChange: 0,
      emotionForImage: "confused",
      gameState: "continue",
    };
  }
};

export const generateImage = async (emotionPrompt: string): Promise<string> => {
  const fullPrompt = `${JOYCE_IMAGE_BASE_PROMPT}, ${emotionPrompt}`;
  try {
    const response = await ai.models.generateImages({
        model: GEMINI_IMAGE_MODEL,
        prompt: fullPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '3:4',
        },
    });
    
    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    throw new Error("No image generated");
  } catch (error)
    {
    console.error("Error generating image:", error);
    return "https://picsum.photos/600/800"; // Fallback image
  }
};
