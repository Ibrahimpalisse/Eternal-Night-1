import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Composant bouton de fermeture réutilisable avec design amélioré
 * @param {Object} props - Les propriétés du composant
 * @param {function} props.onClick - Fonction appelée lors du clic
 * @param {string} props.variant - Variante du style ('default', 'danger', 'ghost', 'minimal')
 * @param {string} props.size - Taille du bouton ('sm', 'md', 'lg')
 * @param {string} props.className - Classes CSS supplémentaires
 * @param {boolean} props.disabled - État désactivé
 * @param {string} props.ariaLabel - Label d'accessibilité
 * @param {React.ReactNode} props.children - Contenu personnalisé (remplace l'icône X)
 */
const CloseButton = ({
  onClick,
  variant = 'default',
  size = 'md',
  className,
  disabled = false,
  ariaLabel = 'Fermer',
  children,
  ...props
}) => {
  // Styles de base
  const baseStyles = cn(
    // Base
    'inline-flex items-center justify-center rounded-full',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent',
    'active:scale-95',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
    
    // Tailles
    {
      'w-6 h-6': size === 'sm',
      'w-8 h-8': size === 'md', 
      'w-10 h-10': size === 'lg',
    },
    
    // Variantes
    {
      // Default - Style subtil avec hover élégant
      'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white focus:ring-white/50 border border-white/10 hover:border-white/20':
        variant === 'default',
      
      // Danger - Pour les actions destructives
      'bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 focus:ring-red-500/50 border border-red-500/20 hover:border-red-500/40':
        variant === 'danger',
      
      // Ghost - Style minimaliste transparent
      'bg-transparent text-gray-400 hover:bg-white/10 hover:text-white focus:ring-white/30':
        variant === 'ghost',
        
      // Minimal - Style très subtil
      'bg-transparent text-gray-500 hover:text-gray-300 focus:ring-white/20':
        variant === 'minimal',
    }
  );

  // Styles pour l'icône selon la taille
  const iconStyles = cn({
    'w-3 h-3': size === 'sm',
    'w-4 h-4': size === 'md',
    'w-5 h-5': size === 'lg',
  });

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(baseStyles, className)}
      {...props}
    >
      {children || <X className={iconStyles} />}
      
      {/* Effet de brillance au survol */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </button>
  );
};

export default CloseButton; 