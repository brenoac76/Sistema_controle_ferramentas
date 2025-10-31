import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;
let activeApiKey: string | null = null;

function getAiClient(): GoogleGenAI {
  const storedKey = window.localStorage.getItem('gemini-api-key');
  
  if (!storedKey) {
    throw new Error("Nenhuma chave de API foi encontrada. Por favor, configure sua chave de API para usar esta funcionalidade.");
  }

  // A chave é armazenada como uma string JSON, então precisamos fazer o parse.
  const apiKey = JSON.parse(storedKey);

  if (typeof apiKey !== 'string' || !apiKey) {
    throw new Error("A chave de API armazenada é inválida. Por favor, configure-a novamente.");
  }
  
  // Se o cliente não existir ou a chave tiver sido alterada, crie uma nova instância.
  if (!ai || activeApiKey !== apiKey) {
    ai = new GoogleGenAI({ apiKey: apiKey });
    activeApiKey = apiKey;
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
    const localAi = getAiClient();
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
    if (error instanceof Error && error.message.includes("API key")) {
        throw new Error("A chave de API do Google não está configurada ou é inválida.");
    }
    throw new Error("Não foi possível identificar a ferramenta. Verifique sua chave de API e tente novamente.");
  }
}
