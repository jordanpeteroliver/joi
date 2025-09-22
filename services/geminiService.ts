import { GoogleGenAI, Type } from "@google/genai";
import type { NarrativeResponse } from '../types';
import { GEMINI_TEXT_MODEL, GEMINI_IMAGE_MODEL, JOYCE_IMAGE_BASE_PROMPT } from '../constants';

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
        description: "An explicit message for a 'win' state. E.g., 'Ela goza, gritando seu nome. 'Me enche, Pedro... enche-me com a sua porra!' Você a joga na parede e a fode até o amanhecer.'"
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
  currentNarrative: string,
  playerChoice: string,
  currentExcitement: number,
  remainingTime: number
): Promise<NarrativeResponse> => {
  const prompt = `
    Contexto do Jogo BDSM Picante:
    - O jogador é 'Pedro', um dominante. Ele está encurralando sua vizinha submissa, 'Joyce'.
    - O objetivo é aumentar o "tesão" dela acima de 85 para um clímax ("win").
    - O namorado dela está dormindo lá dentro. Barulho pode acordá-lo ('lose').
    - Nível de Tesão atual: ${currentExcitement}.
    - Tempo restante: ${remainingTime} segundos.

    Cena Anterior:
    "${currentNarrative}"

    Escolha do Jogador (Pedro):
    "${playerChoice}"

    Sua Tarefa:
    Continue a história de forma extremamente explícita e erótica, dentro de uma fantasia BDSM. Descreva a reação de Joyce de forma visceral e submissa.
    - A narrativa deve ser suja, com linguagem forte e conotação sexual intensa (pau, buceta, porra, etc.), mas de forma criativa.
    - Joyce deve gemer, implorar e reagir fisicamente às ações de Pedro.
    - Crie eventos que aumentem a tensão, como ela quase gritando de prazer, ou barulhos de dentro.
    - Se a ação for um impacto (tapa, estocada), adicione 'hapticFeedback: "strong"'. Para provocações, use 'light'.
    - Use SFX para aumentar a imersão: 'slap' para tapas, 'moan' para gemidos, 'wet' para sons de sexo molhado.
    - Altere o tempo: Se a ação do jogador for barulhenta ou arriscada (ex: um tapa alto), subtraia 10 segundos ('timerChange: -10'). Se for uma ação sedutora que a distrai e ganha tempo, adicione 5 segundos ('timerChange: 5'). Caso contrário, omita 'timerChange'.
    - Se o Tesão for > 85, crie um 'win' state onde Pedro a enche de porra.
    - Forneça 3 novas opções explícitas para o jogador, cada uma começando com um emoji (✋, 👅, 🍆, ⛓️).
    - Responda APENAS com o objeto JSON formatado.
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
  } catch (error) {
    console.error("Error generating image:", error);
    return "https://picsum.photos/600/800"; // Fallback image
  }
};