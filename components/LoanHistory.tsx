
import React from 'react';
import { Loan } from '../types';
import { ReturnIcon } from './icons/ReturnIcon';

interface LoanHistoryProps {
  activeLoans: Loan[];
  getToolNameById: (toolId: string) => string;
  onReturn: (loanId: string) => void;
}

const LoanHistory: React.FC<LoanHistoryProps> = ({ activeLoans, getToolNameById, onReturn }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Empréstimos Ativos</h2>
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {activeLoans.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">Nenhuma ferramenta emprestada no momento.</p>
        ) : (
          activeLoans.map(loan => (
            <div key={loan.id} className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center">
              <div>
                <p className="font-bold text-brand-primary dark:text-brand-accent">{getToolNameById(loan.toolId)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Montador:</span> {loan.employeeName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Emprestado em: {new Date(loan.loanDate).toLocaleString('pt-BR')}
                </p>
              </div>
              <button
                onClick={() => onReturn(loan.id)}
                className="mt-3 sm:mt-0 bg-status-available hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center text-sm"
              >
                <ReturnIcon className="h-4 w-4 mr-2" />
                Registrar Devolução
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LoanHistory;
