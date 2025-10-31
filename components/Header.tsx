import React from 'react';
import { WrenchIcon } from './icons/WrenchIcon';
import { LogoutIcon } from './icons/LogoutIcon';

interface HeaderProps {
  onLogout: () => void;
  userEmail: string | null;
}

const Header: React.FC<HeaderProps> = ({ onLogout, userEmail }) => {
  return (
    <header className="bg-brand-primary shadow-md">
      <div className="container mx-auto px-4 py-5 md:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <WrenchIcon className="h-8 w-8 text-white mr-3"/>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
            Sistema de Protocolo de Ferramentas
          </h1>
        </div>
        <div className="flex items-center space-x-4">
            {userEmail && <span className="hidden lg:inline text-white text-sm">{userEmail}</span>}
            <button
              onClick={onLogout}
              className="bg-brand-secondary hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center"
              aria-label="Sair do sistema"
            >
              <LogoutIcon className="h-5 w-5 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;