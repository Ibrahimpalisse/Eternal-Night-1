import React from 'react';
import { Clock, CheckCircle, PlayCircle, PauseCircle } from 'lucide-react';

const ResponsiveStatusBadge = ({ 
  status, 
  size = 'default', 
  showIcon = true, 
  showText = true,
  className = '',
  onClick,
  ariaLabel 
}) => {
  // Configuration des statuts
  const statusConfig = {
    'en_cours': {
      label: 'En cours',
      shortLabel: '⏳',
      icon: Clock,
      bgColor: 'bg-orange-500/90',
      borderColor: 'border-orange-500/30',
      textColor: 'text-white',
      iconColor: 'text-orange-100',
      hoverColor: 'hover:bg-orange-600/90',
      glowColor: 'hover:shadow-orange-500/25'
    },
    'terminé': {
      label: 'Terminé',
      shortLabel: '✓',
      icon: CheckCircle,
      bgColor: 'bg-green-500/90',
      borderColor: 'border-green-500/30',
      textColor: 'text-white',
      iconColor: 'text-green-100',
      hoverColor: 'hover:bg-green-600/90',
      glowColor: 'hover:shadow-green-500/25'
    },
    'arrete': {
      label: 'Arrêté',
      shortLabel: '⏹️',
      icon: PauseCircle,
      bgColor: 'bg-red-500/90',
      borderColor: 'border-red-500/30',
      textColor: 'text-white',
      iconColor: 'text-red-100',
      hoverColor: 'hover:bg-red-600/90',
      glowColor: 'hover:shadow-red-500/25'
    },
    'published': {
      label: 'Publié',
      shortLabel: '✓',
      icon: CheckCircle,
      bgColor: 'bg-emerald-500/90',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-white',
      iconColor: 'text-emerald-100',
      hoverColor: 'hover:bg-emerald-600/90',
      glowColor: 'hover:shadow-emerald-500/25'
    },
    'draft': {
      label: 'Brouillon',
      shortLabel: '📝',
      icon: PauseCircle,
      bgColor: 'bg-gray-500/90',
      borderColor: 'border-gray-500/30',
      textColor: 'text-white',
      iconColor: 'text-gray-100',
      hoverColor: 'hover:bg-gray-600/90',
      glowColor: 'hover:shadow-gray-500/25'
    },
    'pending': {
      label: 'En attente',
      shortLabel: '⏱️',
      icon: Clock,
      bgColor: 'bg-yellow-500/90',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-gray-900',
      iconColor: 'text-yellow-900',
      hoverColor: 'hover:bg-yellow-600/90',
      glowColor: 'hover:shadow-yellow-500/25'
    }
  };

  // Configuration des tailles responsive
  const sizeConfig = {
    small: {
      padding: 'px-1.5 py-0.5 sm:px-2 sm:py-1',
      text: 'text-xs sm:text-sm',
      icon: 'w-2.5 h-2.5 sm:w-3 sm:h-3',
      minHeight: 'min-h-[20px] sm:min-h-[24px]',
      gap: 'gap-0.5 sm:gap-1'
    },
    default: {
      padding: 'px-2 py-1 sm:px-3 sm:py-1.5',
      text: 'text-xs sm:text-sm lg:text-base',
      icon: 'w-3 h-3 sm:w-4 sm:h-4',
      minHeight: 'min-h-[24px] sm:min-h-[28px] lg:min-h-[32px]',
      gap: 'gap-1 sm:gap-1.5'
    },
    large: {
      padding: 'px-3 py-1.5 sm:px-4 sm:py-2',
      text: 'text-sm sm:text-base lg:text-lg',
      icon: 'w-4 h-4 sm:w-5 sm:h-5',
      minHeight: 'min-h-[32px] sm:min-h-[36px] lg:min-h-[44px]',
      gap: 'gap-1.5 sm:gap-2'
    }
  };

  const config = statusConfig[status] || statusConfig['draft'];
  const sizes = sizeConfig[size] || sizeConfig.default;
  const Icon = config.icon;

  // Déterminer quoi afficher selon la taille d'écran
  const getContent = () => {
    return (
      <>
        {showIcon && (
          <Icon className={`${sizes.icon} ${config.iconColor} flex-shrink-0 transition-transform duration-200 group-hover:scale-110`} />
        )}
        {showText && (
          <span className={`${sizes.text} font-medium select-none whitespace-nowrap`}>
            {config.label}
          </span>
        )}
      </>
    );
  };

  const baseClasses = `
    inline-flex items-center justify-center
    ${sizes.padding} ${sizes.minHeight} ${sizes.gap}
    ${config.bgColor} ${config.borderColor} ${config.textColor}
    backdrop-blur-sm border rounded-full font-medium
    transition-all duration-300 ease-out
    ${config.hoverColor} hover:scale-105 ${config.glowColor}
    hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 
    focus:ring-offset-gray-900 focus:ring-${status === 'en_cours' ? 'orange' : status === 'terminé' ? 'green' : 'gray'}-500/50
    group select-none
    ${onClick ? 'cursor-pointer' : 'cursor-default'}
    ${className}
  `;

  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      className={baseClasses}
      onClick={onClick}
      aria-label={ariaLabel || `Statut: ${config.label}`}
      role={onClick ? 'button' : 'status'}
      tabIndex={onClick ? 0 : undefined}
    >
      {getContent()}
    </Component>
  );
};

export default ResponsiveStatusBadge; 
 
 
 