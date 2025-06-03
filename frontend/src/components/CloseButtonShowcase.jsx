import React from 'react';
import CloseButton from './ui/CloseButton';

/**
 * Composant de démonstration pour le CloseButton
 * Montre toutes les variantes et tailles disponibles
 */
const CloseButtonShowcase = () => {
  const handleClick = (variant, size) => {
    console.log(`Clicked ${variant} button with size ${size}`);
  };

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            CloseButton - Guide de Style
          </h1>
          <p className="text-gray-400">
            Composant bouton de fermeture réutilisable avec différentes variantes et tailles
          </p>
        </div>

        {/* Variantes */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
            Variantes disponibles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Default */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
              <h3 className="text-sm font-medium text-white mb-4">Default</h3>
              <div className="flex justify-center space-x-2">
                <CloseButton
                  variant="default"
                  size="sm"
                  onClick={() => handleClick('default', 'sm')}
                />
                <CloseButton
                  variant="default"
                  size="md"
                  onClick={() => handleClick('default', 'md')}
                />
                <CloseButton
                  variant="default"
                  size="lg"
                  onClick={() => handleClick('default', 'lg')}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Style subtil avec bordure
              </p>
            </div>

            {/* Danger */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
              <h3 className="text-sm font-medium text-white mb-4">Danger</h3>
              <div className="flex justify-center space-x-2">
                <CloseButton
                  variant="danger"
                  size="sm"
                  onClick={() => handleClick('danger', 'sm')}
                />
                <CloseButton
                  variant="danger"
                  size="md"
                  onClick={() => handleClick('danger', 'md')}
                />
                <CloseButton
                  variant="danger"
                  size="lg"
                  onClick={() => handleClick('danger', 'lg')}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Pour actions destructives
              </p>
            </div>

            {/* Ghost */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
              <h3 className="text-sm font-medium text-white mb-4">Ghost</h3>
              <div className="flex justify-center space-x-2">
                <CloseButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleClick('ghost', 'sm')}
                />
                <CloseButton
                  variant="ghost"
                  size="md"
                  onClick={() => handleClick('ghost', 'md')}
                />
                <CloseButton
                  variant="ghost"
                  size="lg"
                  onClick={() => handleClick('ghost', 'lg')}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Style minimaliste transparent
              </p>
            </div>

            {/* Minimal */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
              <h3 className="text-sm font-medium text-white mb-4">Minimal</h3>
              <div className="flex justify-center space-x-2">
                <CloseButton
                  variant="minimal"
                  size="sm"
                  onClick={() => handleClick('minimal', 'sm')}
                />
                <CloseButton
                  variant="minimal"
                  size="md"
                  onClick={() => handleClick('minimal', 'md')}
                />
                <CloseButton
                  variant="minimal"
                  size="lg"
                  onClick={() => handleClick('minimal', 'lg')}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Style très subtil
              </p>
            </div>
          </div>
        </div>

        {/* États */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
            États disponibles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Normal */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
              <h3 className="text-sm font-medium text-white mb-4">Normal</h3>
              <CloseButton
                variant="default"
                size="md"
                onClick={() => handleClick('default', 'md')}
              />
            </div>

            {/* Disabled */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
              <h3 className="text-sm font-medium text-white mb-4">Disabled</h3>
              <CloseButton
                variant="default"
                size="md"
                disabled={true}
                onClick={() => handleClick('default', 'md')}
              />
            </div>

            {/* Avec contenu personnalisé */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
              <h3 className="text-sm font-medium text-white mb-4">Personnalisé</h3>
              <CloseButton
                variant="default"
                size="md"
                onClick={() => handleClick('custom', 'md')}
              >
                <span className="text-xs font-bold">✕</span>
              </CloseButton>
            </div>
          </div>
        </div>

        {/* Usage */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
            Exemples d'utilisation
          </h2>
          
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-sm font-medium text-white mb-4">Code d'exemple</h3>
            <pre className="text-xs text-gray-300 bg-black/50 p-4 rounded overflow-x-auto">
{`// Basique
<CloseButton onClick={handleClose} />

// Avec variante et taille
<CloseButton 
  variant="danger" 
  size="lg" 
  onClick={handleClose} 
/>

// Avec props personnalisées
<CloseButton
  variant="ghost"
  size="md"
  disabled={isLoading}
  className="absolute top-4 right-4"
  ariaLabel="Fermer la modal"
  onClick={handleClose}
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloseButtonShowcase; 