import React, { useRef, useEffect } from 'react';

const ChapterContent = ({
  chapterData,
  fontSize,
  fontFamily,
  lineHeight,
  setReadingProgress
}) => {
  const contentRef = useRef(null);

  // Formatage du contenu en paragraphes
  const formatContent = (content) => {
    return content.trim().split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-6" style={{ lineHeight: 'inherit' }}>
        {paragraph.trim()}
      </p>
    ));
  };

  // Calcul de la progression de lecture
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const scrolled = element.scrollTop;
        const maxScroll = element.scrollHeight - element.clientHeight;
        const progress = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
        setReadingProgress(Math.min(progress, 100));
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, [setReadingProgress]);

  return (
    <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6">
      
      {/* Titre du chapitre - visible sur mobile */}
      <div className="sm:hidden mb-6 p-4 rounded-xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/50">
        <h1 className="text-lg font-bold mb-1 text-white">
          Chapitre {chapterData.number}
        </h1>
        <h2 className="text-base font-medium text-gray-300">
          {chapterData.title}
        </h2>
      </div>

      {/* Zone de lecture */}
      <div 
        ref={contentRef}
        className="rounded-xl backdrop-blur-sm border border-slate-700/50 bg-slate-800/60 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600"
      >
        <div className="p-6 sm:p-8 lg:p-12">
          
          {/* Titre du chapitre - visible sur desktop */}
          <div className="hidden sm:block mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
              Chapitre {chapterData.number}
            </h1>
            <h2 className="text-lg sm:text-xl font-medium text-purple-300">
              {chapterData.title}
            </h2>
          </div>

          {/* Contenu du chapitre */}
          <div 
            className="prose prose-lg max-w-none prose-invert"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
              fontFamily: fontFamily === 'serif' ? 'Georgia, serif' : 
                         fontFamily === 'sans-serif' ? 'Inter, sans-serif' : 
                         'Monaco, monospace'
            }}
          >
            <div className="text-gray-200">
              {formatContent(chapterData.content)}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChapterContent; 