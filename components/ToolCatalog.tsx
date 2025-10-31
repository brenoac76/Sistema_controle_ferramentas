
import React, { useState } from 'react';
import { Tool } from '../types';
import Modal from './Modal';
import { AddIcon } from './icons/AddIcon';

interface ToolCatalogProps {
  tools: Tool[];
  onAddTool: (tool: Omit<Tool, 'id' | 'isLoaned'>) => void;
}

const ToolCatalog: React.FC<ToolCatalogProps> = ({ tools, onAddTool }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newToolName, setNewToolName] = useState('');
  const [newToolDescription, setNewToolDescription] = useState('');
  const [error, setError] = useState('');

  const handleAddToolSubmit = () => {
    if (!newToolName.trim() || !newToolDescription.trim()) {
      setError('Nome e descrição são obrigatórios.');
      return;
    }
    onAddTool({ name: newToolName, description: newToolDescription });
    setIsModalOpen(false);
    setNewToolName('');
    setNewToolDescription('');
    setError('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Catálogo de Ferramentas</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-light hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center"
        >
          <AddIcon className="h-5 w-5 mr-2" />
          Nova Ferramenta
        </button>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {tools.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">Nenhuma ferramenta cadastrada.</p>
        ) : (
          tools.map(tool => (
            <div key={tool.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{tool.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{tool.description}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full text-white ${tool.isLoaned ? 'bg-status-loaned' : 'bg-status-available'}`}>
                {tool.isLoaned ? 'Emprestada' : 'Disponível'}
              </span>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <Modal title="Adicionar Nova Ferramenta" onClose={() => setIsModalOpen(false)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="tool-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Ferramenta</label>
              <input
                type="text"
                id="tool-name"
                value={newToolName}
                onChange={(e) => setNewToolName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-light focus:border-brand-light"
              />
            </div>
            <div>
              <label htmlFor="tool-desc" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
              <textarea
                id="tool-desc"
                rows={3}
                value={newToolDescription}
                onChange={(e) => setNewToolDescription(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-light focus:border-brand-light"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddToolSubmit}
                className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Adicionar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ToolCatalog;
