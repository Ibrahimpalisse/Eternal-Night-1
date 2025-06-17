import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProfileSettings from '../../components/ProfileSettings';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileTabs from '../../components/profile/ProfileTabs';
import { Button } from '../../components/ui/button';
import User from '../../services/User';
import Profile from '../../services/Profile';
import { useToast } from '../../contexts/ToastContext';
import { securityStorage } from '../../utils/securityStorage';

const Profil = () => {
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('settings');
  const [profileData, setProfileData] = useState(null);

  // Charger les données du profil avec les descriptions des rôles
  useEffect(() => {
    const loadProfileData = async () => {
      if (user) {
        try {
          const data = await Profile.getProfile();
          if (data.success) {
            setProfileData(data);
            // Mettre à jour l'utilisateur avec les nouvelles données
            setUser(prevUser => ({
              ...prevUser,
              ...data.user,
              profile: data.profile
            }));
          }
        } catch (error) {
          console.error('Erreur lors du chargement du profil:', error);
          toast.error('Erreur lors du chargement du profil');
        }
      }
    };

    loadProfileData();
  }, [user?.id, setUser, toast]);

  // Lire l'onglet depuis les paramètres URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    // Pour l'instant, seul 'settings' est disponible
    if (tab && ['settings'].includes(tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab('settings'); // Par défaut à 'settings'
    }
  }, [searchParams]);

  // Mettre à jour l'URL quand l'onglet change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Rediriger si non authentifié quand le chargement initial est terminé
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/login');
      return;
    }
  }, [loading, user, navigate]);

  // Mettre à jour isLoading basé sur le loading d'AuthContext
  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-white mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white">Erreur lors du chargement du profil</p>
          <Button 
            onClick={() => navigate('/auth/login')}
            className="mt-4 bg-purple-600 hover:bg-purple-700"
          >
            Se connecter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* En-tête du profil */}
        <ProfileHeader user={user} />

        {/* Navigation des onglets */}
        <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Contenu des onglets */}
        <div className="bg-gray-900/50 rounded-lg border border-white/10 p-4 sm:p-8 backdrop-blur-sm">
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Paramètres du compte</h2>
              <ProfileSettings user={user} setUser={setUser} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profil;
