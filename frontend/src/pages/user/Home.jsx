import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user, loading } = useAuth();

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        {/* Background avec grille */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        
        {/* Étoiles animées */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="stars-small"></div>
          <div className="stars-medium"></div>
          <div className="stars-large"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white/70">Chargement en cours...</p>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen relative">
        {/* Background avec grille */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        
        {/* Étoiles animées */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="stars-small"></div>
          <div className="stars-medium"></div>
          <div className="stars-large"></div>
        </div>
        
        <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 md:px-8">
          <div className="w-full max-w-[90%] md:max-w-5xl bg-white/[0.03] backdrop-blur-xl rounded-xl md:rounded-2xl p-6 md:p-12 border border-white/10 shadow-[0_8px_32px_rgb(0_0_0/0.4)] text-center">
          
          {/* Contenu pour utilisateur connecté */}
          {user ? (
            <>
            <h1 className="mb-4 md:mb-8 text-4xl md:text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-white">
                Bienvenue, <span className="bg-clip-text bg-gradient-to-r from-purple-400 to-white block md:inline mt-2 md:mt-0">{user.name}</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-gray-300 mt-4 md:mt-6 max-w-xl md:max-w-2xl mx-auto leading-relaxed">
                Votre aventure littéraire commence ici. Explorez des milliers d'histoires et laissez-vous emporter.
              </p>

              {/* Informations utilisateur */}
              <div className="mt-8 p-4 bg-white/[0.02] backdrop-blur-sm rounded-lg border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-purple-400 font-medium">Email</div>
                    <div className="text-white/70">{user.email}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400 font-medium">Rôle</div>
                    <div className="text-white/70">
                      {user.rolesWithDescription?.[0]?.description || 'Utilisateur'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400 font-medium">Statut</div>
                    <div className="text-green-400">
                      {user.isVerified ? 'Vérifié' : 'En attente de vérification'}
                    </div>
                  </div>
                </div>
              </div>
  
            <div className="mt-8 md:mt-12 flex flex-col md:flex-row justify-center gap-4 md:gap-6">
              <button className="w-full md:w-auto px-6 md:px-8 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-500 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30">
                  Commencer la lecture
              </button>
              <button className="w-full md:w-auto px-6 md:px-8 py-3 bg-transparent text-white border border-white/20 rounded-xl font-medium hover:bg-white/5 transition-all duration-300">
                  Explorer la bibliothèque
              </button>
            </div>
            </>
          ) : (
            /* Contenu pour visiteur non connecté */
            <>
              <h1 className="mb-4 md:mb-8 text-4xl md:text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-white">
                Bienvenue sur Night Novels
              </h1>
              
              <p className="text-lg md:text-2xl text-gray-300 mt-4 md:mt-6 max-w-xl md:max-w-2xl mx-auto leading-relaxed">
                Découvrez un univers infini d'histoires captivantes. Votre prochaine aventure littéraire vous attend.
              </p>

              {/* Features pour les visiteurs */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-white/[0.02] backdrop-blur-sm rounded-lg border border-white/10">
                  <div className="w-12 h-12 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-purple-400 font-medium mb-2">Bibliothèque Immense</h3>
                  <p className="text-white/70 text-sm">Des milliers d'histoires dans tous les genres</p>
                </div>
                
                <div className="p-4 bg-white/[0.02] backdrop-blur-sm rounded-lg border border-white/10">
                  <div className="w-12 h-12 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-purple-400 font-medium mb-2">Favoris Personnalisés</h3>
                  <p className="text-white/70 text-sm">Sauvegardez et organisez vos lectures</p>
                </div>
                
                <div className="p-4 bg-white/[0.02] backdrop-blur-sm rounded-lg border border-white/10">
                  <div className="w-12 h-12 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-purple-400 font-medium mb-2">Communauté Active</h3>
                  <p className="text-white/70 text-sm">Rejoignez des milliers de lecteurs passionnés</p>
                </div>
              </div>

              <div className="mt-8 md:mt-12 flex flex-col md:flex-row justify-center gap-4 md:gap-6">
                <Link 
                  to="/auth/register"
                  className="w-full md:w-auto px-6 md:px-8 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-500 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 text-center"
                >
                  Commencer gratuitement
                </Link>
                <Link 
                  to="/auth/login"
                  className="w-full md:w-auto px-6 md:px-8 py-3 bg-transparent text-white border border-white/20 rounded-xl font-medium hover:bg-white/5 transition-all duration-300 text-center"
                >
                  Se connecter
                </Link>
              </div>
            </>
          )}
          </div>
        </div>
      </div>
    );
  };
  
  export default Home; 