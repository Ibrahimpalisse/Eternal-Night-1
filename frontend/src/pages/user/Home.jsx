import React from 'react';
import { useScrollToTop } from '../../hooks';
import { HeroSection } from "../../components";
import { PopularBooks } from "../../components";
import { OngoingBooks } from "../../components";
import { CompletedBooks } from "../../components";
import { SearchDialog } from "../../components";
import { NewChapters } from "../../components";

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