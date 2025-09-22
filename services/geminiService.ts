
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
    - Objetivo: Aumentar o Tesão (excitement) de Joyce para 85+ para vencer. Risco de falha existe.

    **ESTADO ATUAL:**
    - Nível de Tesão: ${currentExcitement}/100
    - Tempo Restante: ${remainingTime} segundos.
    - Dificuldade: ${difficulty}. ${difficultyModifier}

    **HISTÓRICO DA CENA:**
    - Narrativa Anterior: "${currentNarrative}"
    - Ação do Jogador: "${playerChoice}"

    **SUA TAREFA (PROCESSO DE PENSAMENTO EM CADEIA):**
    1.  **Análise do Estado:** Primeiro, analise o estado atual. O tesão de Joyce (${currentExcitement}) está baixo, médio ou alto? O tempo restante (${remainingTime}) é muito ou pouco? Como a dificuldade (${difficulty}) afeta a reação dela? A ação do jogador ("${playerChoice}") se alinha com o tom da narrativa anterior?
    2.  **Desenvolvimento da Reação de Joyce:** Com base na sua análise, descreva a reação dela. Se o tesão dela já está alto, ela deve ser mais ousada e receptiva. Se o tempo está acabando, a tensão deve aumentar. A ação do jogador foi eficaz? Se sim, a reação dela deve ser intensamente positiva e visceral. Se foi fraca, ela pode ficar frustrada.
    3.  **Escalada da Narrativa:** Construa sobre a reação dela. Aumente a intensidade e o nível de detalhe explícito. A narrativa deve progredir logicamente. Não se repita. Se o jogador a está dominando, mostre a submissão dela crescendo. Se ele está a provocando, mostre a frustração sexual dela aumentando. Use linguagem sexual forte e criativa (pau, buceta, porra, etc.).
    4.  **Cálculo das Consequências Lógicas:** Com base na nova narrativa, determine as mudanças de estado:
        - **Tesão (excitementChange):** A ação foi um grande passo na dominação? (+15-20). Foi uma boa provocação? (+5-10). Foi um erro? (-5). A mudança deve refletir o sucesso da ação do jogador.
        - **Tempo (timerChange):** A ação foi barulhenta ou descuidada, aumentando o risco? Subtraia tempo (-10s). Foi tão cativante que o tempo pareceu parar? Adicione tempo (+5s). Se não houver impacto claro, omita a propriedade.
        - **Feedback Tátil (hapticFeedback):** A narrativa descreve um impacto físico claro (tapa, estocada)? Use "strong". Descreve um toque leve ou sussurro? Use "light". Se não, omita.
        - **Efeitos Sonoros (sfx):** A cena contém um som icônico? Um tapa ('slap'), um gemido ('moan'), o som de fluidos ('wet')? Escolha o mais apropriado. Se não, omita.
    5.  **Verificação de Fim de Jogo:** O novo nível de tesão é >= 85? Defina \`gameState: "win"\` e escreva uma cena de clímax explícita. A ação levou a uma falha catastrófica? Defina \`gameState: "lose"\`. Caso contrário, \`gameState: "continue"\`.
    6.  **Criação de Novas Opções:** Crie 3 novas opções que sejam uma continuação direta e lógica da nova narrativa, oferecendo diferentes caminhos (mais dominação, mais provocação, mais risco). Mantenha o formato com emoji (✋, 👅, 🍆, ⛓️).
    7.  **Geração de Emoção para Imagem:** Resuma a expressão facial de Joyce no final da cena em uma frase curta e SFW (ex: 'mordendo o lábio em antecipação').

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
