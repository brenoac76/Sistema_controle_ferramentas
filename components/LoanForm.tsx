
import React, { useState } from 'react';
import { Tool } from '../types';
import { CheckIcon } from './icons/CheckIcon';

interface LoanFormProps {
  tools: Tool[];
  employees: string[];
  onLoan: (employeeName: string, toolId: string) => void;
}

const LoanForm: React.FC<LoanFormProps> = ({ tools, employees, onLoan }) => {
  const [employeeName, setEmployeeName] = useState<string>('');
  const [toolId, setToolId] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeName || !toolId) {
      setError('Por favor, selecione um montador e uma ferramenta.');
      return;
    }
    setError('');
    onLoan(employeeName, toolId);
    setEmployeeName('');
    setToolId('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Registrar Novo Empréstimo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="employee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome do Montador
          </label>
          <select
            id="employee"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-light focus:border-brand-light"
          >
            <option value="" disabled>Selecione um montador</option>
            {employees.map((emp) => (
              <option key={emp} value={emp}>{emp}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tool" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ferramenta Disponível
          </label>
          <select
            id="tool"
            value={toolId}
            onChange={(e) => setToolId(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-light focus:border-brand-light"
          >
            <option value="" disabled>Selecione uma ferramenta</option>
            {tools.map((tool) => (
              <option key={tool.id} value={tool.id}>{tool.name}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={!employeeName || !toolId}
          className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          <CheckIcon className="h-5 w-5 mr-2"/>
          Confirmar Empréstimo
        </button>
      </form>
    </div>
  );
};

export default LoanForm;
