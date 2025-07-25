import { Link } from 'react-router-dom';
import openBookLogo from '../../assets/open-book.svg';

const NavbarLogo = ({ isMobile = false }) => {
  const containerClasses = isMobile 
    ? "flex items-center relative z-20"
    : "flex items-center relative z-20";
    
  const logoClasses = isMobile
    ? "relative text-white mr-3 transition-all duration-500 group-hover:scale-110"
    : "relative text-white mr-4 transition-all duration-500 group-hover:scale-110";
    
  const logoContainerClasses = isMobile
    ? "relative p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-black/50 backdrop-blur-sm border border-white/10 shadow-[0_8px_32px_rgb(0_0_0/0.4)] transition-all duration-500 group-hover:shadow-purple-500/20"
    : "relative p-2 rounded-2xl bg-black/50 backdrop-blur-sm border border-white/10 shadow-[0_8px_32px_rgb(0_0_0/0.4)] transition-all duration-500 group-hover:shadow-purple-500/20";
    
  const logoImageClasses = isMobile
    ? "w-6 h-6 sm:w-7 sm:h-7 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]"
    : "w-8 h-8 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]";
    
  const titleClasses = isMobile
    ? "text-base sm:text-lg font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent"
    : "text-lg font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent";
    
  const betaClasses = isMobile
    ? "text-[0.6rem] sm:text-xs text-white/50 uppercase tracking-wider font-medium"
    : "text-xs text-white/50 uppercase tracking-wider font-medium";
    
  const subtitleClasses = isMobile
    ? "text-[0.6rem] sm:text-[0.65rem] text-white/40 font-medium"
    : "text-[0.65rem] text-white/40 font-medium";
    
  const spacingClasses = isMobile
    ? "space-x-1 sm:space-x-2"
    : "space-x-2";
    
  const dividerClasses = isMobile
    ? "h-3 sm:h-4 w-[1px] bg-gradient-to-b from-white/5 via-white/10 to-white/5"
    : "h-4 w-[1px] bg-gradient-to-b from-white/5 via-white/10 to-white/5";

  return (
    <div className={containerClasses}>
      <Link to="/" className="flex items-center group">
        <div className={logoClasses}>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-white/20 rounded-2xl blur-xl"></div>
          <div className={logoContainerClasses}>
            <img src={openBookLogo} alt="Open Book Logo" className={logoImageClasses} />
          </div>
        </div>
        <div className="flex flex-col">
          <div className={`flex items-center ${spacingClasses}`}>
            <span className={titleClasses}>Night Novels</span>
            <div className={dividerClasses}></div>
            <span className={betaClasses}>Beta</span>
          </div>
          <span className={subtitleClasses}>Your Reading Journey</span>
        </div>
      </Link>
    </div>
  );
};

export default NavbarLogo; 