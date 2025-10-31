
import React, { useState, useMemo, useEffect } from 'react';
import { Tool, Loan, User } from './types';
import Header from './components/Header';
import LoanForm from './components/LoanForm';
import ToolCatalog from './components/ToolCatalog';
import LoanHistory from './components/LoanHistory';
import ToolIdentifier from './components/ToolIdentifier';
import { AddIcon } from './components/icons/AddIcon';
import FullLoanHistory from './components/FullLoanHistory';
import EmployeeManager from './components/EmployeeManager';
import AuthScreen from './components/AuthScreen';
import { fetchData, postData } from './services/sheetService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [tools, setTools] = useState<Tool[]>([]);
  const [employees, setEmployees] = useState<string[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isToolIdentifierOpen, setIsToolIdentifierOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const { tools, employees, loans } = await fetchData();
      const processedTools = tools.map(tool => {
        const activeLoan = loans.find(loan => loan.toolId === tool.id && !loan.returnDate);
        return { ...tool, isLoaned: !!activeLoan };
      });
      setTools(processedTools);
      setEmployees(employees);
      setLoans(loans);
    } catch (error) {
      console.error("Erro ao carregar dados da planilha:", error);
      alert("Não foi possível carregar os dados. Verifique a URL do Apps Script e a configuração da planilha.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const activeLoans = useMemo(() => loans.filter(loan => !loan.returnDate), [loans]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };
  
  const handleLogout = () => {
    setUser(null);
  };

  const handleAddTool = async (tool: Omit<Tool, 'id' | 'isLoaned'>) => {
    const newTool: Tool = {
      ...tool,
      id: new Date().toISOString(),
      isLoaned: false,
    };
    await postData({ action: 'ADD_TOOL', data: newTool });
    setTools(prevTools => [...prevTools, newTool]);
  };

  const handleLoanTool = async (employeeName: string, toolId: string) => {
    const newLoan: Loan = {
      id: new Date().toISOString(),
      employeeName,
      toolId,
      loanDate: new Date().toISOString(),
      returnDate: null,
    };
    await postData({ action: 'ADD_LOAN', data: newLoan });
    setLoans(prevLoans => [...prevLoans, newLoan]);
    setTools(prevTools =>
      prevTools.map(tool =>
        tool.id === toolId ? { ...tool, isLoaned: true } : tool
      )
    );
  };

  const handleReturnTool = async (loanId: string) => {
    const loanToReturn = loans.find(l => l.id === loanId);
    if (!loanToReturn) return;

    const updatedLoan = { ...loanToReturn, returnDate: new Date().toISOString() };
    await postData({ action: 'UPDATE_LOAN', data: updatedLoan });

    setLoans(prevLoans =>
      prevLoans.map(loan =>
        loan.id === loanId ? { ...loan, returnDate: new Date().toISOString() } : loan
      )
    );
    setTools(prevTools =>
      prevTools.map(tool =>
        tool.id === loanToReturn.toolId ? { ...tool, isLoaned: false } : tool
      )
    );
  };
  
  const getToolNameById = (toolId: string) => {
    return tools.find(t => t.id === toolId)?.name || 'Ferramenta desconhecida';
  };

  const handleAddEmployee = async (name: string) => {
    if (name && !employees.includes(name)) {
      await postData({ action: 'ADD_EMPLOYEE', data: { name } });
      setEmployees(prev => [...prev, name]);
    }
  };

  const handleRemoveEmployee = async (name: string) => {
    const hasActiveLoan = activeLoans.some(loan => loan.employeeName === name);
    if (hasActiveLoan) {
      alert('Não é possível remover um montador com empréstimos ativos.');
      return;
    }
    await postData({ action: 'REMOVE_EMPLOYEE', data: { name } });
    setEmployees(prev => prev.filter(emp => emp !== name));
  };
  
  if (!user) {
    return <AuthScreen onLoginSuccess={handleLogin} />;
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-gray-800 dark:text-gray-200">Carregando dados da planilha...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Header onLogout={handleLogout} userEmail={user.email} />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <LoanForm
              tools={tools.filter(t => !t.isLoaned)}
              employees={employees}
              onLoan={handleLoanTool}
            />
            <EmployeeManager 
              employees={employees}
              onAddEmployee={handleAddEmployee}
              onRemoveEmployee={handleRemoveEmployee}
            />
             <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Ações Rápidas</h2>
                <button
                  onClick={() => setIsToolIdentifierOpen(true)}
                  className="w-full bg-brand-light hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
                >
                  <AddIcon className="h-5 w-5 mr-2" />
                  Identificar Ferramenta por Imagem
                </button>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-8">
            <LoanHistory 
              activeLoans={activeLoans} 
              getToolNameById={getToolNameById}
              onReturn={handleReturnTool} 
            />
            <ToolCatalog tools={tools} onAddTool={handleAddTool} />
            <FullLoanHistory loans={loans} getToolNameById={getToolNameById} />
          </div>
        </div>
      </main>
       {isToolIdentifierOpen && (
        <ToolIdentifier
          onClose={() => setIsToolIdentifierOpen(false)}
          existingToolNames={tools.map(t => t.name)}
        />
      )}
    </div>
  );
};

export default App;
