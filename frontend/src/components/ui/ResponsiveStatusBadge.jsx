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

  // Configuration des tailles
  const sizeConfig = {
    small: {
      padding: 'px-2 py-1',
      text: 'text-xs',
      icon: 'w-3 h-3',
      minHeight: 'min-h-[24px]',
      gap: 'gap-1'
    },
    default: {
      padding: 'px-3 py-1.5',
      text: 'text-sm',
      icon: 'w-4 h-4',
      minHeight: 'min-h-[32px]',
      gap: 'gap-1.5'
    },
    large: {
      padding: 'px-4 py-2',
      text: 'text-base',
      icon: 'w-5 h-5',
      minHeight: 'min-h-[44px]', // Minimum touch target
      gap: 'gap-2'
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
          <span className={`${sizes.text} font-medium select-none`}>
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
 
 
 