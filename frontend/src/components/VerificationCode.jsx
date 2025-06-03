import React, { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { FormValidation } from '../utils/validation';

const VerificationCode = ({ 
  code = ['', '', '', '', '', ''], 
  onChange, 
  onComplete,
  className = ''
}) => {
  const [error, setError] = useState('');
  const [localCode, setLocalCode] = useState(code);
  const [codeCompleted, setCodeCompleted] = useState(false);
  const inputRefs = useRef([]);
  
  // Ref pour vérifier si le composant est monté
  const isMountedRef = useRef(true);
  
  // Cleanup au démontage
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Synchroniser le code local avec le code fourni par les props
  useEffect(() => {
    if (!isMountedRef.current) return;
    setLocalCode(code);
  }, [code]);

  // Vérifier si le code est complet mais ne pas soumettre automatiquement
  useEffect(() => {
    if (!isMountedRef.current) return;
    
    const isComplete = localCode.every(digit => digit !== '') && localCode.length === 6;
    setCodeCompleted(isComplete);
  }, [localCode]);

  // Handle input change avec protection DOM
  const handleChange = (index, value) => {
    if (!isMountedRef.current) return;
    if (!/^[0-9]*$/.test(value)) return;

    const newCode = [...localCode];
    newCode[index] = value;

    // Validate the digit using FormValidation
    if (value !== '') {
      const validation = FormValidation.validateDigits(value);
      if (!validation.success) {
        if (isMountedRef.current) {
        setError(validation.error);
        }
        return;
      } else {
        if (isMountedRef.current) {
        setError(''); // Clear error if validation is successful
        }
      }
    }

    // Utiliser flushSync pour la mise à jour critique du state
    flushSync(() => {
      if (isMountedRef.current) {
    setLocalCode(newCode);
      }
    });

    // Notifier le parent du changement
    if (onChange && isMountedRef.current) {
      onChange(newCode);
    }

    // Focus next input if value is entered avec protection
    if (value !== '' && index < 5 && isMountedRef.current) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        setTimeout(() => {
          if (isMountedRef.current && nextInput) {
            nextInput.focus();
          }
        }, 10);
      }
    }
  };

  // Handle key press avec protection DOM
  const handleKeyDown = (index, e) => {
    if (!isMountedRef.current) return;
    
    if (e.key === 'Backspace' && index > 0 && localCode[index] === '') {
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        setTimeout(() => {
          if (isMountedRef.current && prevInput) {
            prevInput.focus();
          }
        }, 10);
      }
    }
  };

  // Handle paste avec protection DOM
  const handlePaste = (e) => {
    if (!isMountedRef.current) return;
    
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      
      // Utiliser flushSync pour la mise à jour critique
      flushSync(() => {
        if (isMountedRef.current) {
      setLocalCode(newCode);
        }
      });
      
      // Notifier le parent du changement
      if (onChange && isMountedRef.current) {
        onChange(newCode);
      }
      
      // Focus dernier input avec protection
      const lastInput = inputRefs.current[5];
      if (lastInput && isMountedRef.current) {
        setTimeout(() => {
          if (isMountedRef.current && lastInput) {
            lastInput.focus();
          }
        }, 10);
      }
    }
  };

  // Fonction sécurisée pour assigner les refs
  const setInputRef = (el, index) => {
    if (isMountedRef.current && inputRefs.current) {
      inputRefs.current[index] = el;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {error && (
        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
          <p className="text-sm text-red-500 font-semibold">{error}</p>
        </div>
      )}
      <div className="grid grid-cols-6 gap-1 w-full">
        {localCode.map((digit, index) => (
          <input
            key={`verification-input-${index}`}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            ref={(el) => setInputRef(el, index)}
            className="w-full aspect-square text-center text-lg font-bold bg-white/[0.07] border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white transition-all duration-200"
            aria-label={`Code digit ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default VerificationCode;