// IMPORTANTE: Cole aqui a URL do seu App da Web implantado no Google Apps Script.
// Exemplo: const SCRIPT_URL = "https://script.google.com/macros/s/ABCD.../exec";
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwDEX00xBrrexx2P47W7LyIcv-zkWVMo7nF8vUl8vzgZi9z_rjMflQNT9ossz_W_7YepA/exec";

interface FetchDataResponse {
  tools: any[];
  employees: string[];
  loans: any[];
}

export async function fetchData(): Promise<FetchDataResponse> {
  try {
    const response = await fetch(SCRIPT_URL);
    if (!response.ok) {
      throw new Error(`A resposta da rede não foi bem-sucedida (GET): ${response.statusText}`);
    }
    return await response.json();
  } catch(e) {
    console.error("Falha na requisição fetch (GET):", e);
    throw new Error("Falha ao buscar dados do servidor. Verifique se o Google Apps Script está implantado corretamente para acesso GET.");
  }
}

export async function postData(body: object): Promise<any> {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      // O erro "Failed to fetch" geralmente indica um problema de CORS.
      // O servidor (Apps Script) precisa ser configurado para permitir solicitações de outras origens.
      mode: 'cors', 
      headers: {
        // Uma solução comum para problemas de CORS com o Apps Script é enviar os dados como
        // texto simples. Isso evita uma solicitação de "preflight" (OPTIONS) que pode falhar
        // se o script não tiver uma função `doOptions` configurada corretamente.
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(body), 
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro no POST:", errorText);
      throw new Error(`A resposta da rede não foi bem-sucedida (POST): ${errorText || response.statusText}`);
    }
    return await response.json();
  } catch (e) {
      console.error("Falha na requisição fetch (POST):", e);
      // Este erro pode ser um problema de CORS, de rede, ou a URL do Apps Script pode estar inacessível/incorreta.
      throw new Error("Falha ao conectar com o servidor. Verifique a configuração de CORS no seu Google Apps Script, sua conexão de rede, e se a URL está correta.");
  }
}