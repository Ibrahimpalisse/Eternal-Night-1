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
import Library from './pages/user/Library';
import Bookmarks from './pages/user/Bookmarks';
import Members from './pages/user/Members';
import NovelDetails from './pages/user/NovelDetails';
import ChapterReader from './pages/user/ChapterReader';
import Notifications from './pages/user/Notifications';
import BestNovels from './pages/user/BestNovels';
import NewChapters from './pages/user/NewChapters';
import AdminDashboard from './pages/admin/Dashboard';
import AuthorDashboard from './pages/author/AuthorDashboard';
import { Navbar, Footer } from "./components";
import TokenRefreshNotification from './components/ui/TokenRefreshNotification';
import { ToastProvider } from './components/common/Toast';
import { AuthProvider } from './contexts/AuthContext';
import { NavigationManager as NavigationProvider } from "./components";
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
    <NavigationProvider>
      <Routes>
        {/* Route for Admin Dashboard - Sans navbar/footer */}
        <Route path="/admin/*" element={<AdminDashboard />} />
        
        {/* Route for Author Dashboard - Sans navbar/footer */}
        <Route path="/author/*" element={<AuthorDashboard />} />
        
        {/* Routes avec layout normal */}
        <Route path="/*" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-16 md:pt-20">
              <Routes>
                {/* Route for the Home page */}
                <Route path="/" element={<Home />} />
                {/* Route for the user home page */}
                <Route path="/user/home" element={<Home />} />
                {/* Route for the Login page */}
                <Route path="/login" element={<Login />} />
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
                {/* Route for Library page */}
                <Route path="/library" element={<Library />} />
                {/* Route for Bookmarks page */}
                <Route path="/bookmarks" element={<Bookmarks />} />
                {/* Route for Members page */}
                <Route path="/members" element={<Members />} />
                {/* Route for Novel Details page */}
                <Route path="/novel/:id" element={<NovelDetails />} />
                {/* Route for Chapter Reading page */}
                <Route path="/read/:novelId/chapter/:chapterNumber" element={<ChapterReader />} />
                {/* Route for Notifications page */}
                <Route path="/notifications" element={<Notifications />} />
                {/* Route for Best Novels page */}
                <Route path="/best-novels" element={<BestNovels />} />
                {/* Route for New Chapters page */}
                <Route path="/new-chapters" element={<NewChapters />} />
              </Routes>
            </main>
            <Footer />
            <TokenRefreshNotification />
          </div>
        } />
      </Routes>
    </NavigationProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;