import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormValidation } from '../../utils/validation';
import User from '../../services/User';
import { useToast } from '../../components/common/Toast';
import openBookLogo from '../../assets/open-book.svg';
import { EmailVerification } from '../../components';
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

const Register = () => {
  useScrollToTop();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  
  // Utiliser react-hook-form avec validation Zod
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid, isSubmitting },
    setError,
    watch
  } = useForm({
    resolver: zodResolver(FormValidation.registerSchema),
    mode: 'onChange',
    defaultValues: {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
    }
  });

  // Observer les valeurs des champs pour la validation en temps réel
  const watchedFields = watch();
  
  // État pour les erreurs de validation dynamique
  const [dynamicPasswordError, setDynamicPasswordError] = useState('');
  
  // Validation dynamique du mot de passe en temps réel
  useEffect(() => {
    if (watchedFields.password) {
      const validation = FormValidation.analyzePassword(watchedFields.password);
      if (!validation.success) {
        setDynamicPasswordError(validation.error);
      } else {
        setDynamicPasswordError('');
      }
    } else {
      setDynamicPasswordError('');
    }
  }, [watchedFields.password]);

  // Fonction appelée lorsque le formulaire est valide
  const onSubmit = async (data) => {
    try {
      const result = await User.register({
        name: data.username,
        email: data.email,
        password: data.password
      });
      
      if (result.success) {
        setIsRegistrationComplete(true);
        toast.success("Inscription réussie! Veuillez vérifier votre email.");
        // Ouvrir la modal de vérification d'email après un court délai
        setVerificationEmail(data.email);
        setTimeout(() => {
          setShowVerificationModal(true);
        }, 100);
      } else {
        toast.error(result.message || "Une erreur est survenue lors de l'inscription");
      }
    } catch (error) {
      // Gestion des erreurs spécifiques
      if (error.message.includes("email")) {
        setError('email', { 
          type: 'manual',
          message: error.message 
        });
      } else if (error.message.includes("username")) {
        setError('username', { 
          type: 'manual',
          message: error.message 
        });
      } else {
        setError('root', { 
          type: 'manual',
          message: error.message || "Une erreur est survenue lors de l'inscription"
        });
      }
      toast.error(error.message || "Échec de l'inscription");
    }
  };

  // Gérer la vérification réussie de l'email
  const handleVerificationSuccess = (email) => {
    toast.success("Email vérifié avec succès! Vous pouvez maintenant vous connecter.");
    // Fermer la modal avec un léger délai pour éviter les problèmes de démontage
    setTimeout(() => {
      setShowVerificationModal(false);
      setTimeout(() => {
        navigate('/auth/login'); // Redirection vers la page de connexion
      }, 100);
    }, 100);
  };

  // Gérer la fermeture du modal de vérification
  const handleCloseVerificationModal = () => {
    // Fermer la modal avec un léger délai pour éviter les problèmes de démontage
    setTimeout(() => {
      setShowVerificationModal(false);
    }, 100);
  };
  
  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      


      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 md:py-24">
        {/* Logo and site name */}
        <div className="flex flex-col items-center mb-8 md:mb-12 animate-fade-in-down">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500/20 to-white/20 rounded-2xl p-4 backdrop-blur-sm border border-white/20 shadow-[0_8px_16px_rgb(0_0_0/0.4)] hover:scale-105 transition-all duration-500 hover:shadow-purple-500/20">
            <img src={openBookLogo} alt="Night Novels Logo" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-center mt-4 md:mt-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-200 to-white animate-gradient-x">Create Account</h1>
          <p className="text-sm md:text-base text-gray-400 mt-2 md:mt-3 text-center max-w-sm animate-fade-in">
            Join our community of readers and writers
          </p>
        </div>

        {/* Register form */}
        <div className="w-full max-w-md px-4 animate-fade-in-up">
          <div className="bg-white/[0.07] backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 shadow-[0_8px_32px_rgb(0_0_0/0.4)] transition-all duration-300 hover:shadow-purple-500/10">
            
            {/* Instructions de validation */}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {errors.root && (
                <p className="text-red-400 text-sm">{errors.root.message}</p>
              )}

              <div className="group">
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-purple-400">
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    className={`w-full px-4 py-3 bg-white/10 border ${errors.username ? 'border-red-500 ring-1 ring-red-500/50' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 ${watchedFields.username && !errors.username ? 'pr-10' : ''}`}
                    placeholder="Choose a username"
                    {...register('username')}
                  />
                  <ValidationIndicator 
                    isValid={watchedFields.username && !errors.username} 
                    hasError={!!errors.username} 
                    isEmpty={!watchedFields.username}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  />
                </div>
                {errors.username ? (
                  <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
                ) : (
                  <p className="text-gray-500 text-xs mt-1">Minimum 3 caractères.</p>
                )}
              </div>

              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-purple-400">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    className={`w-full px-4 py-3 bg-white/10 border ${errors.email ? 'border-red-500 ring-1 ring-red-500/50' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 ${watchedFields.email && !errors.email ? 'pr-10' : ''}`}
                    placeholder="your@email.com"
                    {...register('email')}
                  />
                  <ValidationIndicator 
                    isValid={watchedFields.email && !errors.email} 
                    hasError={!!errors.email} 
                    isEmpty={!watchedFields.email}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  />
                </div>
                {errors.email ? (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                ) : (
                  <p className="text-gray-500 text-xs mt-1">Format email valide requis.</p>
                )}
              </div>

              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-purple-400">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={`w-full px-4 py-3 bg-white/10 border ${errors.password ? 'border-red-500 ring-1 ring-red-500/50' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 pr-20`}
                    placeholder="Create a password"
                    {...register('password')}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <ValidationIndicator 
                      isValid={watchedFields.password && !errors.password} 
                      hasError={!!errors.password} 
                      isEmpty={!watchedFields.password}
                  />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
                    >
                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                </div>
                  </div>
                {/* Affichage de l'erreur dynamique ou de l'erreur de validation classique */}
                {dynamicPasswordError ? (
                  <p className="text-red-400 text-sm mt-1">{dynamicPasswordError}</p>
                ) : errors.password ? (
                  <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                ) : (
                  <p className="text-gray-500 text-xs mt-1">Votre mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.</p>
                )}
              </div>

              <div className="group">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-purple-400">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className={`w-full px-4 py-3 bg-white/10 border ${errors.confirmPassword ? 'border-red-500 ring-1 ring-red-500/50' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 pr-20`}
                    placeholder="Confirm your password"
                    {...register('confirmPassword')}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <ValidationIndicator 
                      isValid={watchedFields.confirmPassword && !errors.confirmPassword && watchedFields.password === watchedFields.confirmPassword} 
                      hasError={!!errors.confirmPassword} 
                      isEmpty={!watchedFields.confirmPassword}
                  />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
                    >
                    {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                </div>
                  </div>
                {errors.confirmPassword ? (
                  <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
                ) : (
                  <p className="text-gray-500 text-xs mt-1">Doit correspondre au mot de passe ci-dessus.</p>
                )}
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex items-center mt-1">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500 bg-white/10 transition-colors duration-200"
                  {...register('terms')}
                />
                </div>
                <label htmlFor="terms" className="block text-sm text-gray-300 hover:text-white transition-colors duration-200 leading-relaxed">
                  J'accepte les <a href="#" className="text-purple-400 hover:text-purple-300 hover:underline">conditions d'utilisation</a> et la <a href="#" className="text-purple-400 hover:text-purple-300 hover:underline">politique de confidentialité</a>
                </label>
              </div>
              {errors.terms ? (
                <p className="text-red-400 text-sm mt-1">{errors.terms.message}</p>
              ) : (
                <p className="text-gray-500 text-xs mt-1">Veuillez accepter les conditions d'utilisation.</p>
              )}

              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`group relative w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 px-4 rounded-xl flex justify-center items-center font-medium transition-all duration-300 shadow-lg shadow-purple-500/20 ${!isValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-purple-500 hover:to-purple-400 hover:shadow-purple-500/30 transform hover:scale-[1.02] active:scale-[0.98]'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <span className="relative z-10 flex items-center">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating account...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Create Account
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/auth/login" className="font-medium text-purple-400 hover:text-purple-300 hover:underline transition-all duration-200">
                  Sign in
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
      
      {/* Modal de vérification d'email - rendu conditionnel avec garde supplémentaire */}
      {showVerificationModal && isRegistrationComplete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="relative w-full max-w-md">
            <EmailVerification
              email={verificationEmail}
              onVerificationSuccess={handleVerificationSuccess}
              onCancel={handleCloseVerificationModal}
              showSendEmailForm={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;