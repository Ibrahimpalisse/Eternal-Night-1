import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import AuthorApplicationForm from '../../components/authors/AuthorApplicationForm';
import AuthorInfo from '../../components/authors/AuthorInfo';
import { Button } from '../../components/ui/button';
import openBookLogo from '../../assets/open-book.svg';

const JoinAuthors = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rediriger si non authentifié
  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/login');
      return;
    }
  }, [loading, user, navigate]);

  const handleApplicationSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      // TODO: Appeler l'API pour soumettre la candidature
      console.log('Candidature soumise:', formData);
      
      // Simuler l'envoi (à remplacer par un vrai appel API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Votre candidature a été soumise avec succès ! Vous recevrez une réponse sous 48h.');
      
      // Rediriger vers le profil après soumission
      setTimeout(() => {
        navigate('/profil');
      }, 2000);
      
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast.error('Erreur lors de la soumission de votre candidature. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/30 border-t-purple-500 mx-auto"></div>
          <p className="text-white mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative z-10 text-center">
          <div className="bg-white/[0.07] backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-[0_8px_32px_rgb(0_0_0/0.4)]">
            <p className="text-white mb-6">Vous devez être connecté pour accéder à cette page</p>
            <Button 
              onClick={() => navigate('/auth/login')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
            >
              Se connecter
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 md:py-24">
        {/* Logo et titre */}
        <div className="flex flex-col items-center mb-8 md:mb-12 animate-fade-in-down">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500/20 to-white/20 rounded-2xl p-4 backdrop-blur-sm border border-white/20 shadow-[0_8px_32px_rgb(0_0_0/0.4)] hover:scale-105 transition-all duration-500 hover:shadow-purple-500/20">
            <img src={openBookLogo} alt="Night Novels Logo" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-center mt-4 md:mt-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-200 to-white animate-gradient-x">
            Rejoindre les Auteurs
          </h1>
          <p className="text-sm md:text-base text-gray-400 mt-2 md:mt-3 text-center max-w-md animate-fade-in">
            Vous avez une histoire à raconter ? Rejoignez notre communauté d'auteurs et partagez vos créations avec le monde.
          </p>
        </div>

        {/* Informations sur le programme auteur */}
        <div className="w-full max-w-4xl mb-8 animate-fade-in-up">
          <AuthorInfo />
        </div>

        {/* Formulaire de candidature */}
        <div className="w-full animate-fade-in-up">
          <AuthorApplicationForm 
            onSubmit={handleApplicationSubmit}
            isSubmitting={isSubmitting}
            user={user}
          />
        </div>
      </div>
    </div>
  );
};

export default JoinAuthors; 