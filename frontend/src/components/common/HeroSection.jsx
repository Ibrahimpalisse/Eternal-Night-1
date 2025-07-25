import React from 'react';

const HeroSection = () => {
  return (
    <div className="w-full">
      {/* Container principal pour l'image hero */}
      <div className="w-full h-[50vh] md:h-[70vh] lg:h-[50vh] overflow-hidden group" style={{ position: 'relative' }}>
        {/* Image de fond avec effet hover */}
        <div 
          className="inset-0 bg-cover bg-center bg-no-repeat transition-all ease-out group-hover:scale-105"
          style={{
            position: 'absolute',
            backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&h=1080&fit=crop&crop=center')"
          }}
        />
        
        {/* Overlay sombre pour la lisibilité */}
        <div className="inset-0 bg-black/40 group-hover:bg-black/50 transition-all" style={{ position: 'absolute' }} />
        
        {/* Contenu centré */}
        <div className="flex items-center justify-center h-full px-4" style={{ position: 'relative' }}>
          <div className="text-center max-w-5xl mx-auto">
            {/* Titre principal */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight tracking-wide drop-shadow-lg">
              ETERNAL NIGHT
            </h1>
            
            {/* Sous-titre descriptif */}
            <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-white mb-4 opacity-95 leading-relaxed">
              VOTRE UNIVERS D'HISTOIRES CAPTIVANTES
            </h2>
            
            <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium text-white/90 mb-8 leading-relaxed">
              DE QUALITÉ PREMIUM À L'INTERNATIONAL
            </h3>
            
            {/* Ligne décorative plus visible */}
            <div className="flex items-center justify-center mb-8">
              <div className="h-px bg-white/40 w-16 md:w-20"></div>
              <div className="mx-4 text-white text-2xl md:text-3xl font-light">+</div>
              <div className="h-px bg-white/40 w-16 md:w-20"></div>
            </div>
            
            {/* Texte mis en valeur */}
            <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-purple-300 tracking-wider leading-relaxed">
              + DE <span className="text-purple-200 text-shadow">1000 HISTOIRES</span> À VOTRE DISPOSITION
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 