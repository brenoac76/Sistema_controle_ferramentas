
import React, { useState, useRef } from 'react';
import { identifyToolFromImage } from '../services/geminiService';
import Modal from './Modal';
import { UploadIcon } from './icons/UploadIcon';
import { CloseIcon } from './icons/CloseIcon';

interface ToolIdentifierProps {
  onClose: () => void;
  existingToolNames: string[];
}

const ToolIdentifier: React.FC<ToolIdentifierProps> = ({ onClose, existingToolNames }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult('');
      setError('');
    }
  };

  const handleIdentifyClick = async () => {
    if (!selectedFile) {
      setError('Por favor, selecione uma imagem.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult('');

    try {
      const identifiedName = await identifyToolFromImage(selectedFile, existingToolNames);
      setResult(identifiedName);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro desconhecido.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
       setSelectedFile(file);
       setPreviewUrl(URL.createObjectURL(file));
       setResult('');
       setError('');
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
  };

  return (
    <Modal title="Identificar Ferramenta por Imagem" onClose={onClose}>
      <div className="space-y-4">
        <div 
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-brand-light"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          {previewUrl ? (
            <div className="relative group">
              <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-md" />
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setPreviewUrl(null); }} 
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
              <UploadIcon className="h-12 w-12 mb-2" />
              <p>Arraste uma imagem aqui ou clique para selecionar</p>
              <p className="text-xs">PNG, JPG, WEBP</p>
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}
        
        {result && (
          <div className="text-center bg-green-100 dark:bg-green-900/50 p-4 rounded-lg">
            <p className="font-semibold text-green-800 dark:text-green-200">Ferramenta Identificada:</p>
            <p className="text-2xl font-bold text-brand-primary dark:text-brand-accent">{result}</p>
          </div>
        )}

        <button
          onClick={handleIdentifyClick}
          disabled={!selectedFile || isLoading}
          className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Identificando...
            </>
          ) : 'Identificar Ferramenta'}
        </button>
      </div>
    </Modal>
  );
};

export default ToolIdentifier;
