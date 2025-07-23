import React from 'react';
import { useScrollToTop } from '../../hooks';
import HeroSection from '../../components/HeroSection';
import PopularBooks from '../../components/PopularBooks';
import OngoingBooks from '../../components/OngoingBooks';
import CompletedBooks from '../../components/CompletedBooks';
import SearchDialog from '../../components/SearchDialog';
import NewChapters from '../../components/NewChapters';

function Home() {
  useScrollToTop();
  
  return (
    
    <div className="min-h-screen">
      <SearchDialog />
      <HeroSection />  
      {/* Section des livres populaires */}
      <section className="mb-8">
        <PopularBooks />
      </section>

      {/* Section des livres en cours */}
      <section className="mb-8">
        <OngoingBooks />
      </section>

      {/* Section des livres terminés */}
      <section className="mb-8">
        <CompletedBooks />
      </section>

      {/* Section des nouveaux chapitres */}
      <section className="mb-8">
        <NewChapters />
      </section>
    </div>
  );
}

export default Home; 