import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';

const PostModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  post = null, 
  title: modalTitle 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'draft',
    type: 'general',
    image: null,
    imagePreview: null
  });
  
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Initialiser le formulaire avec les données du post si en mode édition
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        status: post.status,
        type: post.type,
        image: post.image || null,
        imagePreview: post.image || null
      });
    } else {
      setFormData({
        title: '',
        content: '',
        status: 'draft',
        type: 'general',
        image: null,
        imagePreview: null
      });
    }
  }, [post, isOpen]);

  // Fermer les dropdowns quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.type-dropdown')) {
        setIsTypeDropdownOpen(false);
      }
      if (!event.target.closest('.status-dropdown')) {
        setIsStatusDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getTypeLabel = (type) => {
    const labels = {
      general: 'Général',
      announcement: 'Annonce'
    };
    return labels[type];
  };

  const getStatusLabel = (status) => {
    const labels = {
      draft: 'Brouillon',
      published: 'Publier maintenant'
    };
    return labels[status];
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide');
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La taille de l\'image ne doit pas dépasser 5MB');
        return;
      }

      // Créer une preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      image: null,
      imagePreview: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (formData.title.trim() && formData.content.trim()) {
      // Créer un objet FormData si une image est présente
      const submitData = {
        title: formData.title,
        content: formData.content,
        status: formData.status,
        type: formData.type,
        image: formData.image,
        imagePreview: formData.imagePreview
      };
      
      onSubmit(submitData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-white/20 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ isolation: 'isolate' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{modalTitle}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">Titre</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Titre de votre post..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">Type</label>
              <div className="relative type-dropdown" style={{ zIndex: 1000000 }}>
                <button
                  type="button"
                  onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                  className="flex items-center justify-between gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white hover:bg-white/10 transition-colors w-full focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <span>{getTypeLabel(formData.type)}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isTypeDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl" 
                       style={{ zIndex: 999999 }}>
                    <div className="py-1">
                      {['general', 'announcement'].map(type => (
                        <button
                          key={type}
                          onClick={() => {
                            setFormData({ ...formData, type });
                            setIsTypeDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 hover:bg-white/10 transition-colors ${
                            formData.type === type ? 'text-blue-400 bg-white/5 font-medium' : 'text-gray-300'
                          }`}
                        >
                          {getTypeLabel(type)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Statut</label>
              <div className="relative status-dropdown" style={{ zIndex: 1000000 }}>
                <button
                  type="button"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="flex items-center justify-between gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white hover:bg-white/10 transition-colors w-full focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <span>{getStatusLabel(formData.status)}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isStatusDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl" 
                       style={{ zIndex: 999999 }}>
                    <div className="py-1">
                      {['draft', 'published'].map(status => (
                        <button
                          key={status}
                          onClick={() => {
                            setFormData({ ...formData, status });
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 hover:bg-white/10 transition-colors ${
                            formData.status === status ? 'text-blue-400 bg-white/5 font-medium' : 'text-gray-300'
                          }`}
                        >
                          {getStatusLabel(status)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section d'upload d'image */}
          <div>
            <label className="block text-white font-medium mb-2">Image (optionnelle)</label>
            
            {!formData.imagePreview ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-300 font-medium mb-1">Cliquez pour ajouter une image</p>
                <p className="text-gray-500 text-sm">PNG, JPG, GIF jusqu'à 5MB</p>
              </div>
            ) : (
              <div className="relative" style={{ zIndex: 1 }}>
                <img 
                  src={formData.imagePreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg border border-white/10"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Contenu</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Écrivez votre message..."
              rows={6}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium"
          >
            {post ? 'Mettre à jour' : (formData.status === 'published' ? 'Publier' : 'Sauvegarder')}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PostModal; 