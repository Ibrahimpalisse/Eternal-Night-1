import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../../contexts/ToastContext';
import { Tag } from 'lucide-react';

const CategoryModal = ({ isOpen, onClose, onSubmit }) => {
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      setError('Le nom de la catégorie est requis');
      return;
    }

    if (categoryName.trim().length < 2) {
      setError('Le nom de la catégorie doit contenir au moins 2 caractères');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onSubmit(categoryName.trim());
      setCategoryName('');
      onClose();
      toast.success('Catégorie créée avec succès');
    } catch (error) {
      setError(error.message || 'Erreur lors de la création de la catégorie');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCategoryName('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900/95 border border-white/10 text-white max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Tag className="w-5 h-5 text-purple-400" />
            Créer une catégorie
          </DialogTitle>
          <DialogDescription>Remplissez les informations pour créer ou modifier une catégorie.</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-300 mb-2">
              Nom de la catégorie
            </label>
            <Input
              id="categoryName"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Ex: Fantasy, Romance, Action..."
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
              disabled={isLoading}
            />
            {error && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal; 