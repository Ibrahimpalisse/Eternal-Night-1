// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/user/Home';
import Login from './pages/user/login';
import Register from './pages/user/Register';
import ResetPassword from './pages/user/ResetPassword';
import ForgotPassword from './pages/user/ForgotPassword';
import Profil from './pages/user/Profil';
import JoinAuthors from './pages/user/JoinAuthors';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TokenRefreshNotification from './components/ui/TokenRefreshNotification';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import Profile from './services/Profile';

// Composant wrapper pour s'assurer que tout est correctement initialisé
const AppContent = () => {
  // Vérification globale du blocage de sécurité au chargement de l'app
  useEffect(() => {
    const checkSecurityOnLoad = async () => {
      // Attendre un moment pour que les services soient prêts
      setTimeout(() => {
        const securityStatus = Profile.checkSecurityBlock();
        
        if (securityStatus.blocked) {
          console.warn('Blocage de sécurité détecté au chargement de l\'application - Déconnexion immédiate');
          
          // Déclencher immédiatement la déconnexion forcée
          if (window.UserService && typeof window.UserService.handleForceLogout === 'function') {
            window.UserService.handleForceLogout('Session bloquée - Tentative de contournement détectée');
          }
        }
      }, 100);
    };
    
    checkSecurityOnLoad();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
          <Navbar />
      <main className="flex-grow pt-16 md:pt-20">
            <ToastProvider>
              <Routes>
                {/* Route for the Home page */}
                <Route path="/" element={<Home />} />
                {/* Route for the user home page */}
                <Route path="/user/home" element={<Home />} />
                {/* Route for the Login page */}
                <Route path="/auth/login" element={<Login />} />
                {/* Route for the Register page */}
                <Route path="/auth/register" element={<Register />} />
                {/* Route for the Forgot Password page */}
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                {/* Route for the Reset Password page */}
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                {/* Add other routes here as needed */}
                <Route path="/user/profil" element={<Profil />} />
                {/* Route for Join Authors page */}
                <Route path="/join-authors" element={<JoinAuthors />} />
              </Routes>
            </ToastProvider>
          </main>
      <Footer />
      <TokenRefreshNotification />
        </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;