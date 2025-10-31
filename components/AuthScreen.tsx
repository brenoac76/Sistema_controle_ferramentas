
import React from 'react';
import { User } from '../types';
import LoginScreen from './LoginScreen';

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  return <LoginScreen onLoginSuccess={onLoginSuccess} />;
};

export default AuthScreen;