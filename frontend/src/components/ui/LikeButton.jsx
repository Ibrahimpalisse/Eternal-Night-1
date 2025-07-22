import React, { useState, useEffect } from 'react';
import { ThumbsUp, Heart, Sparkles } from 'lucide-react';

const LikeButton = ({ 
  itemId, 
  initialIsLiked = false, 
  initialLikeCount = 0,
  onLikeChange,
  variant = 'thumbs', // 'thumbs', 'heart', 'sparkles'
  size = 'default',
  className = '',
  showCount = true,
  showBurst = true
}) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);
  const [showBurstEffect, setShowBurstEffect] = useState(false);

  // Synchroniser avec les props si elles changent
  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikeCount(initialLikeCount);
  }, [initialIsLiked, initialLikeCount]);

  const handleToggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);

    try {
      const newIsLiked = !isLiked;
      const newCount = newIsLiked ? likeCount + 1 : likeCount - 1;

      // Mise à jour optimiste de l'UI
      setIsLiked(newIsLiked);
      setLikeCount(newCount);

      // Effet de burst quand on like
      if (newIsLiked && showBurst) {
        setShowBurstEffect(true);
        setTimeout(() => setShowBurstEffect(false), 600);
      }

      // TODO: Appel API pour sauvegarder l'état
      // await api.toggleLike(itemId, newIsLiked);

      // Notifier le parent du changement
      if (onLikeChange) {
        onLikeChange(itemId, newIsLiked, newCount);
      }

      // Simuler un délai d'API pour l'exemple
      await new Promise(resolve => setTimeout(resolve, 200));

    } catch (error) {
      console.error('Erreur lors de la mise à jour des likes:', error);
      
      // Revenir à l'état précédent en cas d'erreur
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount + 1 : likeCount - 1);
      
    } finally {
      setIsLoading(false);
    }
  };

  // Configuration des variantes d'icônes
  const variantConfig = {
    thumbs: {
      icon: ThumbsUp,
      activeColor: 'text-blue-400',
      inactiveColor: 'text-gray-400',
      hoverColor: 'hover:text-blue-400',
      bgActive: 'bg-blue-500/10',
      bgHover: 'hover:bg-blue-500/10',
      borderActive: 'border-blue-500/20',
      borderHover: 'hover:border-blue-500/20',
      shadowActive: 'shadow-blue-500/25',
      focusRing: 'focus:ring-blue-500/50'
    },
    heart: {
      icon: Heart,
      activeColor: 'text-red-400',
      inactiveColor: 'text-gray-400',
      hoverColor: 'hover:text-red-400',
      bgActive: 'bg-red-500/10',
      bgHover: 'hover:bg-red-500/10',
      borderActive: 'border-red-500/20',
      borderHover: 'hover:border-red-500/20',
      shadowActive: 'shadow-red-500/25',
      focusRing: 'focus:ring-red-500/50'
    },
    sparkles: {
      icon: Sparkles,
      activeColor: 'text-yellow-400',
      inactiveColor: 'text-gray-400',
      hoverColor: 'hover:text-yellow-400',
      bgActive: 'bg-yellow-500/10',
      bgHover: 'hover:bg-yellow-500/10',
      borderActive: 'border-yellow-500/20',
      borderHover: 'hover:border-yellow-500/20',
      shadowActive: 'shadow-yellow-500/25',
      focusRing: 'focus:ring-yellow-500/50'
    }
  };

  // Configuration des tailles
  const sizeConfig = {
    small: {
      icon: 'w-4 h-4 sm:w-3 sm:h-3',
      button: 'p-2 sm:p-1.5',
      text: 'text-sm sm:text-xs',
      minHeight: 'min-h-[44px] sm:min-h-[32px]',
      minWidth: 'min-w-[44px] sm:min-w-auto',
      gap: 'gap-1.5 sm:gap-1'
    },
    default: {
      icon: 'w-5 h-5 sm:w-4 sm:h-4',
      button: 'p-2.5 sm:p-2',
      text: 'text-base sm:text-sm',
      minHeight: 'min-h-[44px]',
      minWidth: 'min-w-[44px] sm:min-w-auto',
      gap: 'gap-2 sm:gap-1.5'
    },
    large: {
      icon: 'w-6 h-6 sm:w-5 sm:h-5',
      button: 'p-3 sm:p-2.5',
      text: 'text-lg sm:text-base',
      minHeight: 'min-h-[48px]',
      minWidth: 'min-w-[48px] sm:min-w-auto',
      gap: 'gap-2.5 sm:gap-2'
    }
  };

  const config = variantConfig[variant] || variantConfig.thumbs;
  const sizes = sizeConfig[size] || sizeConfig.default;
  const Icon = config.icon;

  return (
    <button
      onClick={handleToggleLike}
      disabled={isLoading}
      className={`
        group relative flex items-center justify-center
        ${sizes.button} ${sizes.minHeight} ${sizes.minWidth} ${sizes.gap}
        rounded-lg border border-transparent
        transition-all duration-300 ease-out
        hover:scale-105 hover:shadow-lg
        ${isLiked 
          ? `${config.activeColor} ${config.bgActive} ${config.borderActive} hover:${config.shadowActive}` 
          : `${config.inactiveColor} ${config.hoverColor} bg-gray-500/5 ${config.bgHover} ${config.borderHover}`
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-2 ${config.focusRing} focus:ring-offset-2 focus:ring-offset-gray-900
        ${className}
      `}
      title={isLiked ? 'Retirer le like' : 'Liker'}
      aria-label={`${isLiked ? 'Retirer le like' : 'Liker'} (${likeCount} likes actuellement)`}
      aria-pressed={isLiked}
    >
      <div className="relative flex items-center justify-center">
        <Icon 
          className={`
            ${sizes.icon} transition-all duration-300
            ${isLiked ? `${config.activeColor} scale-110 ${variant === 'heart' ? 'fill-current' : ''}` : 'text-current'}
            ${isLoading ? 'animate-pulse' : ''}
            group-hover:scale-125
          `}
        />
        
        {/* Effet de burst avec particules */}
        {showBurstEffect && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Effet de pulse principal */}
            <Icon 
              className={`
                ${sizes.icon} absolute inset-0 ${config.activeColor}
                animate-ping opacity-75
                ${variant === 'heart' ? 'fill-current' : ''}
              `}
              style={{
                animationDuration: '0.6s',
                animationIterationCount: '1'
              }}
            />
            
            {/* Particules qui éclatent */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-1 h-1 ${config.activeColor.replace('text-', 'bg-')} rounded-full animate-ping`}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-${8 + i * 2}px)`,
                  animationDelay: `${i * 50}ms`,
                  animationDuration: '0.8s',
                  animationIterationCount: '1'
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {showCount && (
        <span className={`${sizes.text} font-medium select-none transition-all duration-200`}>
          <span className="hidden sm:inline">{likeCount.toLocaleString()}</span>
          <span className="sm:hidden" aria-hidden="true">
            {likeCount >= 1000 ? `${Math.floor(likeCount/1000)}k` : likeCount}
          </span>
        </span>
      )}
    </button>
  );
};

export default LikeButton; 
 
 
 