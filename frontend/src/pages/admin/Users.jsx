import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import SlideNav from '../../components/admin/SlideNav';
import { ToastProvider } from '../../contexts/ToastContext';
import TokenRefreshNotification from '../../components/ui/TokenRefreshNotification';
import { 
  Menu, 
  Users as UsersIcon, 
  UserCheck, 
  UserX, 
  Shield,
  Search,
  Filter,
  MoreHorizontal,
  Edit3,
  Trash2,
  Ban,
  UserPlus,
  Download,
  Calendar,
  Mail,
  Eye,
  EyeOff
} from 'lucide-react';

const Users = () => {
  const { user, loading } = useAuth();
  // Récupérer l'état de la sidebar depuis localStorage
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('adminSidebarOpen');
    const isMobileCheck = window.innerWidth < 768;
    // Sur mobile, toujours commencer fermé, sinon utiliser la valeur sauvegardée
    if (isMobileCheck) {
      return false;
    }
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Fonction pour changer l'état de la sidebar et le sauvegarder
  const toggleSidebar = (newState) => {
    const state = newState !== undefined ? newState : !sidebarOpen;
    setSidebarOpen(state);
    
    // Ne sauvegarder l'état que pour desktop/tablet, pas pour mobile
    if (!isMobile) {
      localStorage.setItem('adminSidebarOpen', JSON.stringify(state));
    }
  };

  // Hook pour détecter la taille d'écran
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      
      // Sur mobile, fermer automatiquement pour une meilleure UX
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    // Initial check
    handleResize();
    
    // Listen for resize events
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Suppression de la dépendance sidebarOpen pour éviter les boucles

  // Calculer la marge gauche selon l'état de la sidebar et la taille d'écran
  const getContentMargin = () => {
    if (isMobile) {
      return 'ml-0';
    } else if (isTablet) {
      return sidebarOpen ? 'ml-64' : 'ml-14';
    } else {
      return sidebarOpen ? 'ml-64' : 'ml-16';
    }
  };

  // Données simulées des utilisateurs (à remplacer par des vraies données d'API)
  const mockUsers = [
    {
      id: 1,
      name: 'Alice Martin',
      email: 'alice.martin@example.com',
      role: 'user',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2024-01-20',
      avatar: null
    },
    {
      id: 2,
      name: 'Bob Dupont',
      email: 'bob.dupont@example.com',
      role: 'author',
      status: 'active',
      joinDate: '2024-01-10',
      lastLogin: '2024-01-19',
      avatar: null
    },
    {
      id: 3,
      name: 'Claire Rousseau',
      email: 'claire.rousseau@example.com',
      role: 'user',
      status: 'inactive',
      joinDate: '2024-01-05',
      lastLogin: '2024-01-15',
      avatar: null
    },
    {
      id: 4,
      name: 'David Leroy',
      email: 'david.leroy@example.com',
      role: 'admin',
      status: 'active',
      joinDate: '2023-12-20',
      lastLogin: '2024-01-20',
      avatar: null
    },
    {
      id: 5,
      name: 'Emma Bernard',
      email: 'emma.bernard@example.com',
      role: 'author',
      status: 'suspended',
      joinDate: '2024-01-01',
      lastLogin: '2024-01-18',
      avatar: null
    }
  ];

  // Statistiques calculées
  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(user => user.status === 'active').length;
  const inactiveUsers = mockUsers.filter(user => user.status === 'inactive').length;
  const suspendedUsers = mockUsers.filter(user => user.status === 'suspended').length;

  // Filtrage des utilisateurs
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Fonctions utilitaires
  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <Shield className="w-4 h-4 text-red-400" />;
      case 'author': return <Edit3 className="w-4 h-4 text-blue-400" />;
      default: return <UsersIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <UserCheck className="w-4 h-4 text-green-400" />;
      case 'inactive': return <EyeOff className="w-4 h-4 text-gray-400" />;
      case 'suspended': return <UserX className="w-4 h-4 text-red-400" />;
      default: return <UsersIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch(status) {
      case 'active': return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`;
      case 'inactive': return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`;
      case 'suspended': return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`;
      default: return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`;
    }
  };

  const getRoleBadge = (role) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch(role) {
      case 'admin': return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`;
      case 'author': return `${baseClasses} bg-blue-500/20 text-blue-400 border border-blue-500/30`;
      case 'user': return `${baseClasses} bg-purple-500/20 text-purple-400 border border-purple-500/30`;
      default: return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`;
    }
  };

  // Vérifier si l'utilisateur est connecté et est super admin
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/30 border-t-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Vérifier si l'utilisateur a le rôle super_admin
  const isSuperAdmin = user.roles?.includes('super_admin');
  if (!isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <ToastProvider>
      <div className="min-h-screen flex">
        {/* Navigation latérale */}
        <SlideNav 
          isOpen={sidebarOpen} 
          onToggle={() => toggleSidebar()}
        />

        {/* Contenu principal */}
        <div className={`flex-1 transition-all duration-300 ${getContentMargin()}`}>
          {/* Header */}
          <header className="bg-slate-900/50 border-b border-slate-700/50 px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-4">
                <button
                  onClick={() => toggleSidebar()}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Menu className="w-6 h-6 text-white" />
                </button>
                <h1 className="text-lg md:text-2xl font-bold text-white">Gestion des Utilisateurs</h1>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  <UserPlus className="w-4 h-4" />
                  <span>Nouvel utilisateur</span>
                </button>
                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          {/* Contenu */}
          <main className="p-4 md:p-6">
            {/* Statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="bg-slate-800/80 rounded-xl p-4 md:p-6 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Utilisateurs</p>
                    <p className="text-xl md:text-2xl font-bold text-white">{totalUsers}</p>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <UsersIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/80 rounded-xl p-4 md:p-6 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Utilisateurs Activés</p>
                    <p className="text-xl md:text-2xl font-bold text-white">{activeUsers}</p>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <UserCheck className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/80 rounded-xl p-4 md:p-6 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Utilisateurs Inactifs</p>
                    <p className="text-xl md:text-2xl font-bold text-white">{inactiveUsers}</p>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-500/20 rounded-xl flex items-center justify-center">
                    <EyeOff className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/80 rounded-xl p-4 md:p-6 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Utilisateurs Suspendus</p>
                    <p className="text-xl md:text-2xl font-bold text-white">{suspendedUsers}</p>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <UserX className="w-5 h-5 md:w-6 md:h-6 text-red-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filtres et recherche */}
            <div className="bg-slate-800/80 rounded-xl p-4 md:p-6 border border-slate-700/50 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Barre de recherche */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                    />
                  </div>
                </div>

                {/* Filtres */}
                <div className="flex gap-3">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    <option value="all">Tous les rôles</option>
                    <option value="user">Utilisateur</option>
                    <option value="author">Auteur</option>
                    <option value="admin">Admin</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    <option value="all">Tous les statuts</option>
                                          <option value="active">Activé</option>
                    <option value="inactive">Inactif</option>
                    <option value="suspended">Suspendu</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tableau des utilisateurs */}
            <div className="bg-slate-800/80 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50 border-b border-slate-600/50">
                    <tr>
                      <th className="text-left p-4 text-gray-300 font-medium">Utilisateur</th>
                      <th className="text-left p-4 text-gray-300 font-medium hidden sm:table-cell">Rôle</th>
                      <th className="text-left p-4 text-gray-300 font-medium hidden md:table-cell">Statut</th>
                      <th className="text-left p-4 text-gray-300 font-medium hidden lg:table-cell">Inscription</th>

                      <th className="text-right p-4 text-gray-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user, index) => (
                      <tr key={user.id} className="border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">{user.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <div className="text-white font-medium">{user.name}</div>
                              <div className="text-gray-400 text-sm">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            {getRoleIcon(user.role)}
                            <span className={getRoleBadge(user.role)}>
                              {user.role === 'admin' ? 'Admin' : user.role === 'author' ? 'Auteur' : 'Utilisateur'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(user.status)}
                            <span className={getStatusBadge(user.status)}>
                              {user.status === 'active' ? 'Activé' : user.status === 'inactive' ? 'Inactif' : 'Suspendu'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300 text-sm hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(user.joinDate).toLocaleDateString('fr-FR')}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 rounded-lg hover:bg-slate-600/50 text-gray-400 hover:text-white transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-slate-600/50 text-gray-400 hover:text-white transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-slate-600/50 text-gray-400 hover:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-slate-600/50 text-gray-400 hover:text-white transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-700/30">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Affichage de {indexOfFirstUser + 1} à {Math.min(indexOfLastUser, filteredUsers.length)} sur {filteredUsers.length} utilisateurs
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-lg border border-slate-600/50 text-gray-300 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Précédent
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded-lg transition-colors ${
                            currentPage === page
                              ? 'bg-purple-600 text-white'
                              : 'border border-slate-600/50 text-gray-300 hover:bg-slate-600/50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-lg border border-slate-600/50 text-gray-300 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
        
        <TokenRefreshNotification />
      </div>
    </ToastProvider>
  );
};

export default Users; 