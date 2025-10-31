import React, { useState } from 'react';
import { WrenchIcon } from './icons/WrenchIcon';

const ApiKeyPrompt: React.FC = () => {
  const [apiKeyInput, setApiKeyInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedKey = apiKeyInput.trim();
    if (trimmedKey) {
      // Salva a chave no localStorage (envolvida em aspas para ser um JSON string válido)
      // e recarrega a página para que o App.tsx possa continuar.
      window.localStorage.setItem('gemini-api-key', JSON.stringify(trimmedKey));
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 text-center">
        <WrenchIcon className="mx-auto h-12 w-12 text-brand-primary" />
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mt-4">Configuração de Chave de API Necessária</h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          Para utilizar as funcionalidades de inteligência artificial, por favor, insira sua chave de API do Google Gemini.
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Sua chave será salva de forma segura apenas no seu navegador.
        </p>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="Cole sua chave de API aqui"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-brand-light"
            aria-label="Chave de API do Google Gemini"
            />
            <button
            type="submit"
            className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!apiKeyInput.trim()}
            >
            Salvar e Continuar
            </button>
        </form>
        
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Não tem uma chave? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-brand-light hover:underline font-medium">Obtenha uma no Google AI Studio.</a>
        </p>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;
