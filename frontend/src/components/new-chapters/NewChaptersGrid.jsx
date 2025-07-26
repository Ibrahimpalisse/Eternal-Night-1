import React from 'react';
import NewChapterCard from './NewChapterCard';

const NewChaptersGrid = ({ chapters, onChapterClick, formatTimeAgo, viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <div className="space-y-3 sm:space-y-4">
        {chapters.map((chapter) => (
          <NewChapterCard
            key={chapter.id}
            chapter={chapter}
            onClick={onChapterClick}
            formatTimeAgo={formatTimeAgo}
            viewMode={viewMode}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {chapters.map((chapter) => (
        <NewChapterCard
          key={chapter.id}
          chapter={chapter}
          onClick={onChapterClick}
          formatTimeAgo={formatTimeAgo}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};

export default NewChaptersGrid; 