import React, { useState } from 'react';
import ResponsiveStatusBadge from './ResponsiveStatusBadge';
import LikeButton from './LikeButton';
import FavoriteButton from '../FavoriteButton';

const ComponentDemo = () => {
  const [likes, setLikes] = useState({ thumbs: 156, heart: 423, sparkles: 89 });
  const [favorites, setFavorites] = useState(1247);

  const handleLikeChange = (variant) => (itemId, isLiked, newCount) => {
    setLikes(prev => ({ ...prev, [variant]: newCount }));
    console.log(`${variant} ${isLiked ? 'liked' : 'unliked'}:`, newCount);
  };

  const handleFavoriteChange = (itemId, isFavorite, newCount) => {
    setFavorites(newCount);
    console.log(`${isFavorite ? 'Added to' : 'Removed from'} favorites:`, newCount);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Composants UI Responsives & Accessibles
          </h1>
          <p className="text-gray-400 text-lg">
            Démonstration des nouveaux composants avec focus sur l'UX mobile
          </p>
        </div>

        {/* Status Badges */}
        <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Status Badges Responsifs</h2>
          
          {/* Différentes tailles */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Tailles disponibles</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <ResponsiveStatusBadge status="en_cours" size="small" />
                <ResponsiveStatusBadge status="en_cours" size="default" />
                <ResponsiveStatusBadge status="en_cours" size="large" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Différents statuts</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <ResponsiveStatusBadge status="en_cours" />
                <ResponsiveStatusBadge status="terminé" />
                <ResponsiveStatusBadge status="published" />
                <ResponsiveStatusBadge status="draft" />
                <ResponsiveStatusBadge status="pending" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Options d'affichage</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <ResponsiveStatusBadge status="en_cours" showIcon={true} showText={true} />
                <ResponsiveStatusBadge status="en_cours" showIcon={true} showText={false} />
                <ResponsiveStatusBadge status="en_cours" showIcon={false} showText={true} />
              </div>
            </div>
          </div>
        </section>

        {/* Like Buttons */}
        <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Boutons Like Interactifs</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Variantes d'icônes</h3>
              <div className="flex flex-wrap gap-6 items-center">
                <LikeButton 
                  itemId="demo-thumbs"
                  variant="thumbs"
                  initialLikeCount={likes.thumbs}
                  onLikeChange={handleLikeChange('thumbs')}
                />
                <LikeButton 
                  itemId="demo-heart"
                  variant="heart"
                  initialLikeCount={likes.heart}
                  onLikeChange={handleLikeChange('heart')}
                />
                <LikeButton 
                  itemId="demo-sparkles"
                  variant="sparkles"
                  initialLikeCount={likes.sparkles}
                  onLikeChange={handleLikeChange('sparkles')}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Tailles disponibles</h3>
              <div className="flex flex-wrap gap-6 items-center">
                <LikeButton 
                  itemId="demo-small"
                  variant="thumbs"
                  size="small"
                  initialLikeCount={42}
                />
                <LikeButton 
                  itemId="demo-default"
                  variant="thumbs"
                  size="default"
                  initialLikeCount={156}
                />
                <LikeButton 
                  itemId="demo-large"
                  variant="thumbs"
                  size="large"
                  initialLikeCount={1203}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Options d'affichage</h3>
              <div className="flex flex-wrap gap-6 items-center">
                <LikeButton 
                  itemId="demo-count"
                  variant="heart"
                  showCount={true}
                  initialLikeCount={89}
                />
                <LikeButton 
                  itemId="demo-no-count"
                  variant="heart"
                  showCount={false}
                  initialLikeCount={89}
                />
                <LikeButton 
                  itemId="demo-no-burst"
                  variant="sparkles"
                  showBurst={false}
                  initialLikeCount={234}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Favorite Button */}
        <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Bouton Favoris Amélioré</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Tailles et états</h3>
              <div className="flex flex-wrap gap-6 items-center">
                <FavoriteButton 
                  bookId="demo-fav-small"
                  size="small"
                  initialFavoriteCount={favorites}
                  onFavoriteChange={handleFavoriteChange}
                />
                <FavoriteButton 
                  bookId="demo-fav-default"
                  size="default"
                  initialFavoriteCount={favorites}
                  onFavoriteChange={handleFavoriteChange}
                />
                <FavoriteButton 
                  bookId="demo-fav-large"
                  size="large"
                  initialFavoriteCount={favorites}
                  onFavoriteChange={handleFavoriteChange}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Options d'affichage</h3>
              <div className="flex flex-wrap gap-6 items-center">
                <FavoriteButton 
                  bookId="demo-fav-count"
                  showCount={true}
                  initialFavoriteCount={favorites}
                  onFavoriteChange={handleFavoriteChange}
                />
                <FavoriteButton 
                  bookId="demo-fav-no-count"
                  showCount={false}
                  initialFavoriteCount={favorites}
                  onFavoriteChange={handleFavoriteChange}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Responsive Demo */}
        <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Tests Responsivité</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-4">
                Composants dans une carte (simulation mobile)
              </h3>
              
              {/* Simulation d'une carte de livre mobile */}
              <div className="max-w-sm mx-auto bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-purple-600/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                      Fantasy
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <ResponsiveStatusBadge status="en_cours" size="small" />
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Livre de Test</h3>
                    <p className="text-gray-400 text-sm">par Auteur Test</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-1 text-blue-400">
                      <span>📖</span>
                      <span>25</span>
                    </div>
                    <FavoriteButton 
                      bookId="demo-card"
                      size="small"
                      initialFavoriteCount={1247}
                      className="justify-start"
                    />
                    <LikeButton 
                      itemId="demo-card-like"
                      variant="heart"
                      size="small"
                      initialLikeCount={423}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Instructions d'accessibilité */}
        <section className="bg-green-900/20 backdrop-blur-sm border border-green-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">✨ Fonctionnalités d'Accessibilité</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-300 mb-3">Touch Targets</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• Minimum 44px sur mobile (WCAG AA)</li>
                <li>• Tailles adaptatives selon l'écran</li>
                <li>• Zones de clic étendues</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-green-300 mb-3">Navigation Clavier</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• Focus visible avec outline</li>
                <li>• Navigation par Tab</li>
                <li>• Activation par Espace/Entrée</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-green-300 mb-3">Lecteurs d'écran</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• aria-label descriptifs</li>
                <li>• aria-pressed pour les états</li>
                <li>• Annonces des changements</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-green-300 mb-3">Responsive Design</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• Emojis sur petits écrans</li>
                <li>• Texte complet sur desktop</li>
                <li>• Animations adaptatives</li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ComponentDemo; 
 