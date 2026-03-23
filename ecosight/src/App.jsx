import React, { useState } from 'react';
import HomePage from './HomePage';
import AuthPage from './AuthPage';
import EcoSightApp from './Ecosight';

export default function App() {
  // 'home', 'auth', or 'dashboard'
  const [currentView, setCurrentView] = useState('home'); 

  return (
    <>
      {currentView === 'home' && (
        <HomePage onGetStarted={() => setCurrentView('auth')} />
      )}
      
      {currentView === 'auth' && (
        <AuthPage onLogin={() => setCurrentView('dashboard')} />
      )}
      
      {currentView === 'dashboard' && (
        <EcoSightApp onLogout={() => setCurrentView('home')} />
      )}
    </>
  );
}