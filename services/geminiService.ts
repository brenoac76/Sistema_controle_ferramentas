import { GoogleGenAI } from "@google/genai";

// FIX: Refactored API key handling to align with Gemini API guidelines.
// The API key is sourced directly from environment variables and is assumed to be always available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = 'gemini-2.5-flash';

function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string; } }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error("FileReader did not return a string."));
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
    const imagePart = await fileToGenerativePart(imageFile);
    
    const prompt = `
      Identifique a ferramenta principal na imagem.
      Responda APENAS com o nome da ferramenta.
      Se a ferramenta for uma das seguintes, use o nome exato da lista: ${toolList.join(', ')}.
      Caso contrário, forneça o nome mais comum para a ferramenta.
      Se não for uma ferramenta, responda com "Não é uma ferramenta".
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, { text: prompt }] },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error identifying tool:", error);
    throw new Error("Não foi possível identificar a ferramenta. Tente novamente.");
  }
}
