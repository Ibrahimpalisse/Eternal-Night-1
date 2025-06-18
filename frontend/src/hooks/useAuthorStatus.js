import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthorService from '../services/Author';

const useAuthorStatus = () => {
  const { user } = useAuth();
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadApplicationStatus = async () => {
      if (user) {
        try {
          setLoading(true);
          setError(null);
          const response = await AuthorService.getApplicationStatus();
          setApplicationStatus(response.data);
        } catch (err) {
          console.error('Erreur lors du chargement du statut:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setApplicationStatus(null);
        setLoading(false);
      }
    };

    loadApplicationStatus();
  }, [user]);

  const refreshStatus = async () => {
    if (user) {
      try {
        setError(null);
        const response = await AuthorService.getApplicationStatus();
        setApplicationStatus(response.data);
      } catch (err) {
        console.error('Erreur lors du rafraîchissement du statut:', err);
        setError(err.message);
      }
    }
  };

  return {
    applicationStatus,
    loading,
    error,
    refreshStatus,
    // Helpers
    hasApplication: applicationStatus?.hasApplication || false,
    canApply: applicationStatus?.canApply || false,
    isPending: applicationStatus?.status === 'pending',
    isApproved: applicationStatus?.status === 'approved',
    isRejected: applicationStatus?.status === 'rejected'
  };
};

export default useAuthorStatus; 