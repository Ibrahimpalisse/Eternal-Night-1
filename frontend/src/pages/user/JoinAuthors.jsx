import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import AuthorApplicationForm from '../../components/authors/AuthorApplicationForm';
import AuthorInfo from '../../components/authors/AuthorInfo';
import { Button } from '../../components/ui/button';
import AuthorService from '../../services/Author';
import useAuthorStatus from '../../hooks/useAuthorStatus';
import openBookLogo from '../../assets/open-book.svg';

const JoinAuthors = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { applicationStatus, loading: statusLoading, hasApplication, refreshStatus } = useAuthorStatus();

  // Rediriger si non authentifié
  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/login');
      return;
    }
  }, [loading, user, navigate]);

  // Le statut est maintenant géré par le hook useAuthorStatus

  const handleApplicationSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      console.log('🔐 Utilisateur connecté:', user);
      console.log('🍪 Cookies disponibles:', document.cookie);
      console.log('Soumission de candidature avec les données:', formData);
      
      // Appeler l'API pour soumettre la candidature
      const response = await AuthorService.submitApplication(formData);
      
      if (response.success) {
        toast.success(response.message || 'Votre candidature a été soumise avec succès !');
        
        // Rafraîchir le statut
        await refreshStatus();
      } else {
        throw new Error(response.message || 'Erreur lors de la soumission');
      }
      
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast.error(error.message || 'Erreur lors de la soumission de votre candidature. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || statusLoading) {
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

        {/* Statut de candidature ou formulaire */}
        <div className="w-full animate-fade-in-up">
          {hasApplication ? (
            // Afficher le statut de la candidature
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/[0.07] backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-[0_8px_32px_rgb(0_0_0/0.4)]">
                <div className="text-center">
                  {applicationStatus.status === 'pending' && (
                    <>
                      <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-4">Candidature en cours d'examen</h3>
                      <p className="text-gray-300 mb-6">
                        Votre candidature a été soumise avec succès ! Un administrateur l'examine actuellement. 
                        Vous recevrez une notification une fois qu'une décision aura été prise.
                      </p>
                      <div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 rounded-lg">
                        <span className="text-yellow-400 font-medium">Statut : En attente</span>
                      </div>
                    </>
                  )}
                  
                  {applicationStatus.status === 'approved' && (
                    <>
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-4">Félicitations ! Candidature approuvée</h3>
                      <p className="text-gray-300 mb-6">
                        Votre candidature a été approuvée ! Vous êtes maintenant officiellement auteur sur Night Novels. 
                        Vous pouvez commencer à publier vos œuvres.
                      </p>
                      <div className="inline-flex items-center px-4 py-2 bg-green-500/20 rounded-lg">
                        <span className="text-green-400 font-medium">Statut : Approuvé</span>
                      </div>
                    </>
                  )}
                  
                  {applicationStatus.status === 'rejected' && (
                    <>
                      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-4">Candidature refusée</h3>
                      <p className="text-gray-300 mb-6">
                        Malheureusement, votre candidature n'a pas été retenue cette fois-ci. 
                        Vous pouvez soumettre une nouvelle candidature en améliorant votre présentation.
                      </p>
                      <div className="space-y-4">
                        <div className="inline-flex items-center px-4 py-2 bg-red-500/20 rounded-lg">
                          <span className="text-red-400 font-medium">Statut : Refusé</span>
                        </div>
                        <div>
                          <Button 
                            onClick={refreshStatus}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
                          >
                            Soumettre une nouvelle candidature
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Afficher le formulaire de candidature
          <AuthorApplicationForm 
            onSubmit={handleApplicationSubmit}
            isSubmitting={isSubmitting}
            user={user}
          />
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinAuthors; 