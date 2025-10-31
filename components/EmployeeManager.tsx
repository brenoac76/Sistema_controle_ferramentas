import React, { useState } from 'react';
import { AddIcon } from './icons/AddIcon';
import { TrashIcon } from './icons/TrashIcon';

interface EmployeeManagerProps {
  employees: string[];
  onAddEmployee: (name: string) => void;
  onRemoveEmployee: (name: string) => void;
}

const EmployeeManager: React.FC<EmployeeManagerProps> = ({ employees, onAddEmployee, onRemoveEmployee }) => {
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [error, setError] = useState('');

  const handleAddClick = () => {
    if (!newEmployeeName.trim()) {
      setError('O nome não pode estar em branco.');
      return;
    }
    if (employees.includes(newEmployeeName.trim())) {
      setError('Este montador já está cadastrado.');
      return;
    }
    setError('');
    onAddEmployee(newEmployeeName.trim());
    setNewEmployeeName('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Gerenciar Montadores</h2>
      
      <div className="flex space-x-2">
        <input
          type="text"
          value={newEmployeeName}
          onChange={(e) => {
            setNewEmployeeName(e.target.value);
            setError('');
          }}
          placeholder="Nome do novo montador"
          className="flex-grow px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-light focus:border-brand-light"
        />
        <button
          onClick={handleAddClick}
          className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center"
        >
          <AddIcon className="h-5 w-5" />
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-2">
        {employees.length > 0 ? (
          employees.map(emp => (
            <div key={emp} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center">
              <span className="text-gray-800 dark:text-gray-200">{emp}</span>
              <button
                onClick={() => onRemoveEmployee(emp)}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 rounded-full"
                aria-label={`Remover ${emp}`}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-2">Nenhum montador cadastrado.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeManager;
