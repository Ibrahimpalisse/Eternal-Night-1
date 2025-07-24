import React, { useState, useMemo } from 'react';
import { useScrollToTop } from '../../hooks';
import MembersStats from '../../components/members/MembersStats';
import MembersSearch from '../../components/members/MembersSearch';
import MembersTable from '../../components/members/MembersTable';
import MembersPagination from '../../components/members/MembersPagination';
import UserNovelsModal from '../../components/members/UserNovelsModal';

const mockNovelsByAuthor = {
  1: [
    {
      id: 101,
      title: "Les Chroniques d'Aether",
      author: "Emma Laurent",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center",
      description: "Une épopée fantastique dans un monde où la magie et la technologie s'affrontent.",
      chapters: 25,
      views: 12500,
      likes: 1247,
      comments: 423,
      status: "in_progress"
    },
    {
      id: 102,
      title: "Le Souffle du Nord",
      author: "Emma Laurent",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop&crop=center",
      description: "Un voyage initiatique à travers des terres gelées et hostiles.",
      chapters: 18,
      views: 8200,
      likes: 900,
      comments: 120,
      status: "completed"
    },
    {
      id: 103,
      title: "L'Éveil des Ombres",
      author: "Emma Laurent",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=400&fit=crop&crop=center",
      description: "Un roman sombre où les secrets de famille refont surface.",
      chapters: 20,
      views: 9500,
      likes: 1100,
      comments: 210,
      status: "in_progress"
    },
    {
      id: 104,
      title: "La Légende du Phénix",
      author: "Emma Laurent",
      image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=300&h=400&fit=crop&crop=center",
      description: "Une aventure épique à travers des terres en feu.",
      chapters: 22,
      views: 10400,
      likes: 980,
      comments: 180,
      status: "completed"
    },
    {
      id: 105,
      title: "Les Jardins du Temps",
      author: "Emma Laurent",
      image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300&h=400&fit=crop&crop=center",
      description: "Un voyage poétique entre passé et futur.",
      chapters: 16,
      views: 6700,
      likes: 800,
      comments: 90,
      status: "in_progress"
    }
  ],
  2: [
    {
      id: 201,
      title: "L'Ombre du Passé",
      author: "Marc Dubois",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop&crop=center",
      description: "Un thriller psychologique haletant.",
      chapters: 12,
      views: 4100,
      likes: 500,
      comments: 80,
      status: "completed"
    }
  ],
  4: [
    {
      id: 401,
      title: "Le Dernier Oracle",
      author: "Pierre Martin",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=center",
      description: "Un roman d'aventure et de mystère.",
      chapters: 20,
      views: 6000,
      likes: 700,
      comments: 150,
      status: "in_progress"
    }
  ],
  6: [
    {
      id: 601,
      title: "La Cité des Brumes",
      author: "Thomas Leroy",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop&crop=center",
      description: "Une enquête dans une ville où tout le monde a quelque chose à cacher.",
      chapters: 15,
      views: 5000,
      likes: 600,
      comments: 100,
      status: "in_progress"
    }
  ],
  8: [],
  10: [
    {
      id: 1001,
      title: "Les Flammes de l'Espoir",
      author: "David Lefevre",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center",
      description: "Un roman historique sur la résistance.",
      chapters: 30,
      views: 9000,
      likes: 1100,
      comments: 200,
      status: "completed"
    }
  ],
  12: [
    {
      id: 1201,
      title: "Le Secret des Profondeurs",
      author: "Nicolas Petit",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=center",
      description: "Un roman d'exploration sous-marine.",
      chapters: 22,
      views: 7200,
      likes: 800,
      comments: 90,
      status: "in_progress"
    }
  ]
};

const Members = () => {
  useScrollToTop();

  // Données mockées pour les membres
  const mockMembers = [
    {
      id: 1,
      name: "Emma Laurent",
      username: "emma_laurent",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      role: "author",
      novels: 5,
      likes: 8900,
      comments: 423,
      level: 3,
      isPremium: true,
      joinDate: "2023-01-15"
    },
    {
      id: 2,
      name: "Marc Dubois",
      username: "marc_dubois",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      role: "author",
      novels: 3,
      likes: 5600,
      comments: 256,
      level: 2,
      isPremium: false,
      joinDate: "2023-03-20"
    },
    {
      id: 3,
      name: "Sarah Moreau",
      username: "sarah_moreau",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      role: "reader",
      novels: 0,
      likes: 2300,
      comments: 89,
      level: 1,
      isPremium: true,
      joinDate: "2023-02-10"
    },
    {
      id: 4,
      name: "Pierre Martin",
      username: "pierre_martin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      role: "author",
      novels: 2,
      likes: 3200,
      comments: 145,
      level: 2,
      isPremium: false,
      joinDate: "2023-04-05"
    },
    {
      id: 5,
      name: "Marie Dubois",
      username: "marie_dubois",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      role: "reader",
      novels: 0,
      likes: 1800,
      comments: 67,
      level: 1,
      isPremium: false,
      joinDate: "2023-05-12"
    },
    {
      id: 6,
      name: "Thomas Leroy",
      username: "thomas_leroy",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      role: "author",
      novels: 4,
      likes: 4200,
      comments: 234,
      level: 3,
      isPremium: true,
      joinDate: "2023-01-30"
    },
    {
      id: 7,
      name: "Sophie Bernard",
      username: "sophie_bernard",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      role: "reader",
      novels: 0,
      likes: 3100,
      comments: 156,
      level: 2,
      isPremium: true,
      joinDate: "2023-06-15"
    },
    {
      id: 8,
      name: "Alexandre Moreau",
      username: "alex_moreau",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      role: "author",
      novels: 1,
      likes: 890,
      comments: 45,
      level: 1,
      isPremium: false,
      joinDate: "2023-07-20"
    },
    {
      id: 9,
      name: "Julie Rousseau",
      username: "julie_rousseau",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      role: "reader",
      novels: 0,
      likes: 1500,
      comments: 78,
      level: 1,
      isPremium: false,
      joinDate: "2023-08-10"
    },
    {
      id: 10,
      name: "David Lefevre",
      username: "david_lefevre",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      role: "author",
      novels: 3,
      likes: 3800,
      comments: 189,
      level: 2,
      isPremium: true,
      joinDate: "2023-09-05"
    },
    {
      id: 11,
      name: "Camille Durand",
      username: "camille_durand",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      role: "reader",
      novels: 0,
      likes: 2100,
      comments: 92,
      level: 1,
      isPremium: false,
      joinDate: "2023-10-15"
    },
    {
      id: 12,
      name: "Nicolas Petit",
      username: "nicolas_petit",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      role: "author",
      novels: 2,
      likes: 2900,
      comments: 134,
      level: 2,
      isPremium: false,
      joinDate: "2023-11-20"
    }
  ];

  // Calcul du classement par activité (score = commentaires + likes)
  const scoredMembers = useMemo(() => {
    const membersWithScore = mockMembers.map(m => ({ ...m, score: m.comments + m.likes }));
    membersWithScore.sort((a, b) => b.score - a.score);
    return membersWithScore.map((m, idx) => ({ ...m, classement: idx + 1 }));
  }, [mockMembers]);

  // États pour les filtres et pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // État pour la popup
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedNovels, setSelectedNovels] = useState([]);

  // Filtrage et tri des membres
  const filteredMembers = useMemo(() => {
    let filtered = scoredMembers.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || member.username.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'comments':
          aValue = a.comments;
          bValue = b.comments;
          break;
        case 'likes':
          aValue = a.likes;
          bValue = b.likes;
          break;
        case 'niveau':
          aValue = a.classement;
          bValue = b.classement;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    return filtered;
  }, [searchTerm, sortBy, sortOrder, scoredMembers]);

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);

  // Reset page quand la recherche change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fonction pour ouvrir la popup
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setSelectedNovels(user.role === 'author' ? (mockNovelsByAuthor[user.id] || []) : []);
    setOpenModal(true);
  };

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-6 xl:py-8">
        <MembersStats members={mockMembers} />
        <MembersSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} resultsCount={filteredMembers.length} />
        <MembersTable
          members={currentMembers}
          handleSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
          formatJoinDate={formatJoinDate}
          onUserClick={handleUserClick}
        />
        <MembersPagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} totalItems={filteredMembers.length} itemsPerPage={itemsPerPage} />
      </div>
      <UserNovelsModal open={openModal} onClose={() => setOpenModal(false)} user={selectedUser} novels={selectedNovels} />
    </div>
  );
};

export default Members; 