import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import openBookLogo from '../../assets/open-book.svg';
import User from '../../services/User';
import { FormValidation } from '../../utils/validation';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../contexts/AuthContext';
import { EmailVerificationDialog } from "../../components";
import { CodeVerificationDialog } from "../../components";
import { useScrollToTop } from '../../hooks';


// Composants pour les icônes d'œil
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

// Composant pour les indicateurs de validation en temps réel
const ValidationIndicator = ({ isValid, hasError, isEmpty, className = '' }) => {
  if (isEmpty) return null;
  
  return (
    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${className}`}>
      {hasError ? (
        <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
          <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      ) : isValid ? (
        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce">
          <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      ) : null}
    </div>
  );
};

const Login = () => {
  useScrollToTop();
  // États séparés et stables
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // États pour les modals - un seul modal actif à la fois
  const [modalState, setModalState] = useState({
    type: null, // null | 'verification-dialog' | 'code-verification'
    email: ''
  });

  const navigate = useNavigate();
  const toast = useToast();
  const auth = useAuth();

  // Callbacks stables avec useCallback
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Supprimer les erreurs spécifiques
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (isLoading) return;

    // Validation
    const validation = FormValidation.validateForm('login', formData);
    if (!validation.success) {
      setErrors({ general: "Email ou mot de passe incorrect" });
      toast.error("Email ou mot de passe incorrect");
      return;
    }
      
    setIsLoading(true);
    setErrors({});

    try {
      const result = await auth.login(formData);

      if (result?.success) {
        toast.success("Connexion réussie");
        navigate('/user/home', { replace: true });
      } else if (result && (result.requiresVerification || result.needVerification)) {
        // Afficher le modal de vérification
        setModalState({
          type: 'verification-dialog',
          email: formData.email
        });
      } else {
        const errorMessage = result?.message || "Email ou mot de passe incorrect";
        
        if (errorMessage.includes("vérifi") || errorMessage.includes("verify")) {
          setModalState({
            type: 'verification-dialog',
            email: formData.email
          });
        } else {
          setErrors({ general: errorMessage });
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      if (error.silent) return;
      
      const errorMessage = error.message || "Une erreur est survenue lors de la connexion";
      
      if (errorMessage.includes("vérifi") || errorMessage.includes("verify") || errorMessage.includes("403")) {
        setModalState({
          type: 'verification-dialog',
          email: formData.email
        });
      } else {
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, isLoading, auth, toast, navigate]);

  // Callbacks pour les modals
  const handleVerificationSent = useCallback((sentEmail) => {
    console.log('handleVerificationSent called with email:', sentEmail);
    // Fermer d'abord le modal actuel
    setModalState(null);
    // Puis ouvrir le modal de vérification après un petit délai
    setTimeout(() => {
      setModalState({
        type: 'code-verification',
        email: sentEmail  // Utiliser directement sentEmail au lieu de modalState.email
      });
    }, 100);
  }, []);

  const handleVerificationSuccess = useCallback((verifiedEmail) => {
    setModalState({ type: null, email: '' });
    
    setTimeout(() => {
      toast.success(`Email ${verifiedEmail} vérifié avec succès ! Vous pouvez maintenant vous connecter.`);
      setFormData(prev => ({ ...prev, password: '' }));
      setErrors({});
    }, 100);
  }, [toast]);

  const handleCloseModal = useCallback(() => {
    setModalState({ type: null, email: '' });
  }, []);

  const isFormValid = formData.email && formData.password && !errors.email && !errors.password;

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      

      
              <div className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16 md:pt-24">
        {/* Logo and site name */}
        <div className="flex flex-col items-center mb-8 md:mb-12 animate-fade-in-down">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500/20 to-white/20 rounded-2xl p-4 backdrop-blur-sm border border-white/20 shadow-[0_8px_32px_rgb(0_0_0/0.4)] hover:scale-105 transition-all duration-500 hover:shadow-purple-500/20">
            <img src={openBookLogo} alt="Night Novels Logo" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-center mt-4 md:mt-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-200 to-white animate-gradient-x">Welcome Back</h1>
          <p className="text-sm md:text-base text-gray-400 mt-2 md:mt-3 text-center max-w-sm animate-fade-in">
            Sign in to continue your reading journey
          </p>
        </div>

        {/* Login form */}
        <div className="w-full max-w-md px-4 animate-fade-in-up">
          <div className="bg-white/[0.07] backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 shadow-[0_8px_32px_rgb(0_0_0/0.4)] transition-all duration-300 hover:shadow-purple-500/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* General error */}
              {errors.general && (
                <p className="text-red-400 text-sm">{errors.general}</p>
              )}

              {/* Email */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-purple-400">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/10 border ${errors.general ? 'border-red-500 ring-1 ring-red-500/50' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50`}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                </div>
              </div>
              
              {/* Password */}
              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-purple-400">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/10 border ${errors.general ? 'border-red-500 ring-1 ring-red-500/50' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 pr-20`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
                    >
                      {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Remember me and forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500 bg-white/10 transition-colors duration-200"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300 hover:text-white transition-colors duration-200">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link 
                    to="/auth/forgot-password" 
                    className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200 hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>
              
              {/* Submit button */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`group relative w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 px-4 rounded-xl flex justify-center items-center font-medium transition-all duration-300 shadow-lg shadow-purple-500/20 ${(!isFormValid || isLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:from-purple-500 hover:to-purple-400 hover:shadow-purple-500/30 transform hover:scale-[1.02] active:scale-[0.98]'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <span className="relative z-10 flex items-center">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Sign in
                    </>
                  )}
                </span>
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/auth/register" className="font-medium text-purple-400 hover:text-purple-300 hover:underline transition-all duration-200">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12 mb-8">
            <p className="text-xs text-gray-500 hover:text-gray-400 transition-colors duration-200">
              © {new Date().getFullYear()} Night Novels. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      
      {/* Modals - rendu conditionnel stable */}
      {modalState && modalState.type === 'verification-dialog' && (
        <EmailVerificationDialog
          isOpen={true}
          onClose={handleCloseModal}
          email={modalState.email}
          onVerificationSent={handleVerificationSent}
          onVerificationSuccess={handleVerificationSuccess}
        />
      )}

      {modalState && modalState.type === 'code-verification' && (
        <CodeVerificationDialog
          isOpen={true}
          onClose={handleCloseModal}
          email={modalState.email}
          onVerificationSuccess={handleVerificationSuccess}
        />
      )}
    </div>
  );
};

export default Login;
