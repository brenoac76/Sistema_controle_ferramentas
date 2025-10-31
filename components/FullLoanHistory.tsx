import React from 'react';
import { Loan } from '../types';

interface FullLoanHistoryProps {
  loans: Loan[];
  getToolNameById: (toolId: string) => string;
}

const FullLoanHistory: React.FC<FullLoanHistoryProps> = ({ loans, getToolNameById }) => {
  const sortedLoans = [...loans].reverse();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Histórico Completo de Empréstimos</h2>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {sortedLoans.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">Nenhum empréstimo foi registrado ainda.</p>
        ) : (
          sortedLoans.map(loan => (
            <div 
              key={loan.id} 
              className={`p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center ${
                loan.returnDate ? 'bg-gray-100 dark:bg-gray-700/50' : 'bg-blue-50 dark:bg-blue-900/50'
              }`}
            >
              <div>
                <p className={`font-bold ${loan.returnDate ? 'text-gray-700 dark:text-gray-300' : 'text-brand-primary dark:text-brand-accent'}`}>
                  {getToolNameById(loan.toolId)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Montador:</span> {loan.employeeName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Emprestado em:</span> {new Date(loan.loanDate).toLocaleString('pt-BR')}
                </p>
                {loan.returnDate && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Devolvido em:</span> {new Date(loan.returnDate).toLocaleString('pt-BR')}
                  </p>
                )}
              </div>
              <span className={`mt-2 sm:mt-0 px-3 py-1 text-xs font-bold rounded-full text-white ${
                loan.returnDate ? 'bg-status-available' : 'bg-yellow-500'
              }`}>
                {loan.returnDate ? 'Devolvido' : 'Emprestado'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FullLoanHistory;
