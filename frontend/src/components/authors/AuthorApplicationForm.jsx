import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormValidation } from '../../utils/validation';
import { Button } from '../ui/button';

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

const AuthorApplicationForm = ({ onSubmit, isSubmitting, user }) => {
  // Utiliser react-hook-form avec validation Zod
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid },
    setError,
    watch
  } = useForm({
    resolver: zodResolver(FormValidation.authorApplicationSchema),
    mode: 'onChange',
    defaultValues: {
      authorName: user?.name || '',
      reason: '',
      socialLinks: {
        website: '',
        twitter: '',
        instagram: ''
      },
      acceptTerms: false
    }
  });

  // Observer les valeurs des champs pour la validation en temps réel
  const watchedFields = watch();

  // Fonction appelée lorsque le formulaire est valide
  const onFormSubmit = async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Gestion des erreurs spécifiques
      if (error.message.includes("nom")) {
        setError('authorName', { 
          type: 'manual',
          message: error.message 
        });
      } else if (error.message.includes("motivation") || error.message.includes("raison")) {
        setError('reason', { 
          type: 'manual',
          message: error.message 
        });
      } else {
        setError('root', { 
          type: 'manual',
          message: error.message || "Une erreur est survenue lors de la soumission"
        });
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/[0.07] backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 shadow-[0_8px_32px_rgb(0_0_0/0.4)] transition-all duration-300 hover:shadow-purple-500/10">
        
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {errors.root && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{errors.root.message}</p>
            </div>
          )}

          {/* Nom d'auteur */}
          <div className="group">
            <label htmlFor="authorName" className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-purple-400">
              Nom d'auteur <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                {...register("authorName")}
                type="text"
                id="authorName"
                className="w-full px-4 py-3 pr-12 bg-white/[0.05] border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 backdrop-blur-sm"
                placeholder="Votre nom de plume"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ValidationIndicator 
                  isValid={watchedFields.authorName && !errors.authorName}
                  hasError={!!errors.authorName}
                  isEmpty={!watchedFields.authorName}
                />
              </div>
            </div>
            {errors.authorName && (
              <p className="mt-2 text-sm text-red-400 animate-fade-in">{errors.authorName.message}</p>
            )}
          </div>

          {/* Motivation */}
          <div className="group">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-purple-400">
              Pourquoi voulez-vous rejoindre les auteurs ? <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <textarea
                {...register("reason")}
                id="reason"
                rows={6}
                className="w-full px-4 py-3 bg-white/[0.05] border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 backdrop-blur-sm resize-none"
                placeholder="Expliquez votre motivation et vos objectifs en tant qu'auteur... (100-1000 caractères)"
              />
              <div className="absolute top-3 right-3">
                <ValidationIndicator 
                  isValid={watchedFields.reason && !errors.reason}
                  hasError={!!errors.reason}
                  isEmpty={!watchedFields.reason}
                />
              </div>
            </div>
            <div className="flex justify-between mt-2">
              {errors.reason && (
                <p className="text-sm text-red-400 animate-fade-in">{errors.reason.message}</p>
              )}
              <p className="text-sm text-gray-400 ml-auto">
                {watchedFields.reason?.length || 0}/1000
              </p>
            </div>
          </div>

          {/* Liens sociaux */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-300">
              Liens sociaux <span className="text-sm text-gray-400 font-normal">(optionnel)</span>
            </h3>
            
            <div className="grid gap-4">
              {/* Site web */}
              <div className="group">
                <label htmlFor="website" className="block text-sm font-medium text-gray-400 mb-2">
                  Site web ou blog
                </label>
                <div className="relative">
                  <input
                    {...register("socialLinks.website")}
                    type="url"
                    id="website"
                    className="w-full px-4 py-3 pr-12 bg-white/[0.05] border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 backdrop-blur-sm"
                    placeholder="https://votresite.com"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <ValidationIndicator 
                      isValid={watchedFields.socialLinks?.website && !errors.socialLinks?.website}
                      hasError={!!errors.socialLinks?.website}
                      isEmpty={!watchedFields.socialLinks?.website}
                    />
                  </div>
                </div>
                {errors.socialLinks?.website && (
                  <p className="mt-2 text-sm text-red-400 animate-fade-in">{errors.socialLinks.website.message}</p>
                )}
              </div>

              {/* Twitter */}
              <div className="group">
                <label htmlFor="twitter" className="block text-sm font-medium text-gray-400 mb-2">
                  Profil Twitter
                </label>
                <div className="relative">
                  <input
                    {...register("socialLinks.twitter")}
                    type="url"
                    id="twitter"
                    className="w-full px-4 py-3 pr-12 bg-white/[0.05] border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 backdrop-blur-sm"
                    placeholder="https://twitter.com/votre-profil"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <ValidationIndicator 
                      isValid={watchedFields.socialLinks?.twitter && !errors.socialLinks?.twitter}
                      hasError={!!errors.socialLinks?.twitter}
                      isEmpty={!watchedFields.socialLinks?.twitter}
                    />
                  </div>
                </div>
                {errors.socialLinks?.twitter && (
                  <p className="mt-2 text-sm text-red-400 animate-fade-in">{errors.socialLinks.twitter.message}</p>
                )}
              </div>

              {/* Instagram */}
              <div className="group">
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-400 mb-2">
                  Profil Instagram
                </label>
                <div className="relative">
                  <input
                    {...register("socialLinks.instagram")}
                    type="url"
                    id="instagram"
                    className="w-full px-4 py-3 pr-12 bg-white/[0.05] border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 backdrop-blur-sm"
                    placeholder="https://instagram.com/votre-profil"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <ValidationIndicator 
                      isValid={watchedFields.socialLinks?.instagram && !errors.socialLinks?.instagram}
                      hasError={!!errors.socialLinks?.instagram}
                      isEmpty={!watchedFields.socialLinks?.instagram}
                    />
                  </div>
                </div>
                {errors.socialLinks?.instagram && (
                  <p className="mt-2 text-sm text-red-400 animate-fade-in">{errors.socialLinks.instagram.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Acceptation des conditions */}
          <div className="group">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                {...register("acceptTerms")}
                type="checkbox"
                className="mt-1 w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2 transition-all duration-200"
              />
              <span className="text-sm text-gray-300 leading-relaxed">
                J'accepte les <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors underline">conditions d'utilisation</a> et 
                je m'engage à respecter les <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors underline">règles de la communauté</a> <span className="text-red-400">*</span>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="mt-2 text-sm text-red-400 animate-fade-in">{errors.acceptTerms.message}</p>
            )}
          </div>

          {/* Bouton de soumission */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                  <span>Envoi en cours...</span>
                </div>
              ) : (
                'Soumettre ma candidature'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthorApplicationForm; 