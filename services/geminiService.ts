import { GoogleGenAI } from "@google/genai";

// A inicialização do cliente foi movida para uma função "getter" para ser preguiçosa (lazy).
// Isso evita que o aplicativo falhe na inicialização se a API_KEY não estiver definida.
let ai: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!process.env.API_KEY) {
    // A verificação em App.tsx deve impedir que este código seja alcançado,
    // mas lançamos um erro claro por segurança.
    throw new Error("A chave de API do Google não está configurada no ambiente.");
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
}

const model = 'gemini-2.5-flash';

function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string; } }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error("O FileReader não retornou uma string."));
      }
      const base64Data = reader.result.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export async function identifyToolFromImage(imageFile: File, toolList: string[]): Promise<string> {
  try {
    const localAi = getAiClient(); // O cliente é obtido e, se necessário, inicializado aqui.
    const imagePart = await fileToGenerativePart(imageFile);
    
    const prompt = `
      Identifique a ferramenta principal na imagem.
      Responda APENAS com o nome da ferramenta.
      Se a ferramenta for uma das seguintes, use o nome exato da lista: ${toolList.join(', ')}.
      Caso contrário, forneça o nome mais comum para a ferramenta.
      Se não for uma ferramenta, responda com "Não é uma ferramenta".
    `;

    const response = await localAi.models.generateContent({
      model: model,
      contents: { parts: [imagePart, { text: prompt }] },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Erro ao identificar a ferramenta:", error);
    if (error instanceof Error && error.message.includes("API_KEY")) {
        throw new Error("A chave de API do Google não está configurada corretamente.");
    }
    throw new Error("Não foi possível identificar a ferramenta. Tente novamente.");
  }
}
