
import React, { useState } from 'react';
import { User } from '../types';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [showLogin, setShowLogin] = useState(true);

  if (showLogin) {
    return <LoginScreen onLoginSuccess={onLoginSuccess} onSwitchToSignUp={() => setShowLogin(false)} />;
  } else {
    return <SignUpScreen onSignUpSuccess={onLoginSuccess} onSwitchToLogin={() => setShowLogin(true)} />;
  }
};

export default AuthScreen;
