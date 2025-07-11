import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  Badge, 
  MessageSquare, 
  BookOpen, 
  Search,
  LogIn,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  UserCheck,
  Star,
  Edit3,
  Trash2,
  Eye,
  Users,
  Activity,
  TrendingUp,
  Award,
  Globe,
  Instagram,
  Twitter,
  Hash,
  FileText,
  Bell,
  Send
} from 'lucide-react';
import { getRoleBadges, getRoleDisplayText, getStatusIcon, getStatusBadge, getStatusDisplayName, isAuthorUser } from './userUtils.jsx';
import UserWorksSection from './UserWorksSection';


const UserDetailsModal = ({ user, isOpen, onClose, onEdit, onDelete, previousModal }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMounted, setIsMounted] = useState(false);
  
  // États pour la section notifications
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'info',
    priority: 'normal'
  });
  const [isSendingNotification, setIsSendingNotification] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isOpen || !user || !isMounted) {
    return null;
  }

  // Fonctions utilitaires
  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleDisplayText = (roles) => {
    if (!roles || roles.length === 0) return 'Aucun rôle';
    const roleMap = {
      'user': 'Utilisateur',
      'author': 'Auteur',
      'moderator': 'Modérateur',
      'admin': 'Administrateur'
    };
    return roles.map(role => roleMap[role] || role).join(', ');
  };

  const getStatusDisplayName = (status) => {
    const statusMap = {
      'active': 'Actif',
      'blocked': 'Bloqué',
      'pending': 'En attente',
      'suspended': 'Suspendu'
    };
    return statusMap[status] || 'Inconnu';
  };

  const getStatusBadgeClass = (status) => {
    const classMap = {
      'active': 'bg-green-500/20 text-green-400 border-green-500/30',
      'blocked': 'bg-red-500/20 text-red-400 border-red-500/30',
      'pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'suspended': 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };
    return classMap[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      'active': <CheckCircle className="w-4 h-4 text-green-400" />,
      'blocked': <XCircle className="w-4 h-4 text-red-400" />,
      'pending': <Clock className="w-4 h-4 text-yellow-400" />,
      'suspended': <AlertTriangle className="w-4 h-4 text-orange-400" />
    };
    return iconMap[status] || <Clock className="w-4 h-4 text-gray-400" />;
  };

  const getRoleBadgeClass = (role) => {
    const classMap = {
      'user': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'author': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'moderator': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'admin': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return classMap[role] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  // Fonctions pour les notifications
  const handleNotificationChange = (field, value) => {
    setNotificationData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendNotification = async () => {
    if (!notificationData.title.trim() || !notificationData.message.trim()) {
      alert('Le titre et le message sont requis');
      return;
    }

    setIsSendingNotification(true);
    try {
      console.log('Envoi de notification à:', user.name, notificationData);
      // Ici vous implémenteriez l'API call pour envoyer la notification
      // await sendNotificationToUser(user.id, notificationData);
      
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Réinitialiser le formulaire
      setNotificationData({
        title: '',
        message: '',
        type: 'info',
        priority: 'normal'
      });
      
      alert('Notification envoyée avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert('Erreur lors de l\'envoi de la notification');
    } finally {
      setIsSendingNotification(false);
    }
  };

  // Onglets disponibles
  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'favorites', label: 'Favoris', icon: Activity },
    { id: 'novels', label: 'Romans réalisés', icon: BookOpen },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[99999] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999
      }}
    >
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl sm:rounded-2xl w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl mx-2 sm:mx-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-slate-700/50 gap-4 sm:gap-0">
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-xl object-cover" />
              ) : (
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">{user.name || 'Utilisateur'}</h2>
              <p className="text-gray-400 text-sm sm:text-base truncate">{user.email}</p>
              <div className="flex items-center gap-2 mt-1 sm:mt-2">
                {getStatusIcon(user.status)}
                <span className={`px-2 py-1 border rounded-full text-xs font-medium ${getStatusBadgeClass(user.status)}`}>
                  {getStatusDisplayName(user.status)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Clic sur le bouton de modification');
                  onEdit(user, previousModal);
                }}
                className="p-2.5 text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-indigo-600/20 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-110 active:scale-95 ring-1 ring-transparent hover:ring-purple-500/30"
                title="Modifier l'utilisateur"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2.5 text-gray-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-110 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="border-b border-slate-700/50 overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap hover:scale-105 ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-400 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 shadow-lg'
                      : 'border-transparent text-gray-400 hover:text-white hover:bg-slate-700/30'
                  }`}
                >
                  <IconComponent className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-200px)] custom-scrollbar">
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Informations personnelles */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-slate-700/30 rounded-xl p-4 sm:p-6 border border-slate-600/30">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    Informations Personnelles
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">
                        Inscrit le {formatDate(user.joinDate || user.accountCreated)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">
                        Dernière connexion: {formatDate(user.lastLogin)}
                      </span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-3">
                        <Hash className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{user.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-xl p-4 sm:p-6 border border-slate-600/30">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Badge className="w-5 h-5 text-purple-400" />
                    Rôles et Permissions
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Rôles actuels</p>
                      <div className="flex flex-wrap gap-2">
                        {(user.roles || ['user']).map((role) => (
                          <span 
                            key={role}
                            className={`px-2 py-1 border rounded-full text-xs font-medium ${getRoleBadgeClass(role)}`}
                          >
                            {getRoleDisplayText([role])}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Statut du compte</p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(user.status)}
                        <span className={`px-2 py-1 border rounded-full text-xs font-medium ${getStatusBadgeClass(user.status)}`}>
                          {getStatusDisplayName(user.status)}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Statistiques */}
              <div className="bg-slate-700/30 rounded-xl p-4 sm:p-6 border border-slate-600/30">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  Statistiques
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-white">{user.totalComments || 0}</div>
                    <div className="text-xs sm:text-sm text-gray-400">Commentaires</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-white">{user.worksCount || 0}</div>
                    <div className="text-xs sm:text-sm text-gray-400">Œuvres</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-white">{user.followersCount || 0}</div>
                    <div className="text-xs sm:text-sm text-gray-400">Abonnés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-white">{user.likesReceived || 0}</div>
                    <div className="text-xs sm:text-sm text-gray-400">Likes reçus</div>
                  </div>
                </div>
              </div>

              {/* Réseaux sociaux */}
              {(user.socialMedia || user.website || user.portfolio) && (
                <div className="bg-slate-700/30 rounded-xl p-4 sm:p-6 border border-slate-600/30">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-400" />
                    Liens externes
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {user.website && (
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                      >
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-sm">Site web</span>
                      </a>
                    )}
                    {user.socialMedia?.instagram && (
                      <a
                        href={`https://instagram.com/${user.socialMedia.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                      >
                        <Instagram className="w-4 h-4 text-pink-400" />
                        <span className="text-white text-sm">{user.socialMedia.instagram}</span>
                      </a>
                    )}
                    {user.socialMedia?.twitter && (
                      <a
                        href={`https://twitter.com/${user.socialMedia.twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                      >
                        <Twitter className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-sm">{user.socialMedia.twitter}</span>
                      </a>
                    )}
                    {user.portfolio && (
                      <a
                        href={user.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm">Portfolio</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Section d'envoi de notification */}
              <div className="bg-slate-700/30 rounded-xl p-4 sm:p-6 border border-slate-600/30">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-400" />
                  Envoyer une notification à {user.name}
                </h3>
                
                <div className="space-y-4">
                  {/* Type et priorité */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Type de notification
                      </label>
                      <select
                        value={notificationData.type}
                        onChange={(e) => handleNotificationChange('type', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                      >
                        <option value="info">Information</option>
                        <option value="warning">Avertissement</option>
                        <option value="success">Félicitations</option>
                        <option value="error">Alerte</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Priorité
                      </label>
                      <select
                        value={notificationData.priority}
                        onChange={(e) => handleNotificationChange('priority', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                      >
                        <option value="low">Faible</option>
                        <option value="normal">Normale</option>
                        <option value="high">Élevée</option>
                        <option value="urgent">Urgente</option>
                      </select>
                    </div>
                  </div>

                  {/* Titre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Titre de la notification
                    </label>
                    <input
                      type="text"
                      value={notificationData.title}
                      onChange={(e) => handleNotificationChange('title', e.target.value)}
                      placeholder="Ex: Nouveau message important"
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {notificationData.title.length}/100 caractères
                    </p>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      value={notificationData.message}
                      onChange={(e) => handleNotificationChange('message', e.target.value)}
                      placeholder="Votre message détaillé ici..."
                      rows={4}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm resize-none"
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {notificationData.message.length}/500 caractères
                    </p>
                  </div>

                  {/* Aperçu */}
                  {(notificationData.title || notificationData.message) && (
                    <div className="p-4 bg-slate-800/30 border border-slate-600/30 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Aperçu de la notification :</h4>
                      <div className={`p-3 rounded-lg border-l-4 ${
                        notificationData.type === 'info' ? 'bg-blue-500/10 border-blue-500' :
                        notificationData.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500' :
                        notificationData.type === 'success' ? 'bg-green-500/10 border-green-500' :
                        'bg-red-500/10 border-red-500'
                      }`}>
                        {notificationData.title && (
                          <h5 className="font-medium text-white text-sm mb-1">
                            {notificationData.title}
                          </h5>
                        )}
                        {notificationData.message && (
                          <p className="text-gray-300 text-xs">
                            {notificationData.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bouton d'envoi */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSendNotification}
                      disabled={isSendingNotification || !notificationData.title.trim() || !notificationData.message.trim()}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg font-medium text-sm transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                    >
                      {isSendingNotification ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Envoyer la notification
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Historique des notifications (simulation) */}
              <div className="bg-slate-700/30 rounded-xl p-4 sm:p-6 border border-slate-600/30">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  Historique des notifications
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-800/30 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium text-sm">Bienvenue sur la plateforme</span>
                      <span className="text-xs text-gray-400">Il y a 2 jours</span>
                    </div>
                    <p className="text-gray-300 text-xs">Message de bienvenue automatique envoyé lors de l'inscription.</p>
                  </div>
                  <div className="p-3 bg-slate-800/30 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium text-sm">Profil vérifié</span>
                      <span className="text-xs text-gray-400">Il y a 1 semaine</span>
                    </div>
                    <p className="text-gray-300 text-xs">Votre profil a été vérifié et approuvé par notre équipe.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-6">
              <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                <h3 className="text-lg font-semibold text-white mb-4">Favoris</h3>
                <p className="text-gray-400 text-center py-8">Fonctionnalité à venir...</p>
              </div>
            </div>
          )}

          {activeTab === 'novels' && (
            <div className="space-y-6">
              <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                <h3 className="text-lg font-semibold text-white mb-4">Romans réalisés</h3>
                <p className="text-gray-400 text-center py-8">Fonctionnalité à venir...</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                <h3 className="text-lg font-semibold text-white mb-4">Paramètres du compte</h3>
                <p className="text-gray-400 text-center py-8">Fonctionnalité à venir...</p>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );

  if (typeof document === 'undefined' || !document.body) {
    return null;
  }
  
  return createPortal(modalContent, document.body);
};

export default UserDetailsModal; 