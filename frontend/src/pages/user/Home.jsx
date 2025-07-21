import React from 'react';
import HeroSection from '../../components/HeroSection';
import PopularBooks from '../../components/PopularBooks';
import OngoingBooks from '../../components/OngoingBooks';
import CompletedBooks from '../../components/CompletedBooks';
import NewChapters from '../../components/NewChapters';

const Home = () => {
  return (
    <div>
      <HeroSection />
      <PopularBooks />
      <OngoingBooks />
      <CompletedBooks />
      <NewChapters />
    </div>
  );
};

export default Home; 