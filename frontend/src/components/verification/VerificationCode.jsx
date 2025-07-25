import React, { useState, useRef, useEffect } from 'react';

const VerificationCode = ({ 
  code = ['', '', '', '', '', ''], 
  onChange, 
  onComplete,
  className = ''
}) => {
  const [localCode, setLocalCode] = useState(code);
  const inputRefs = useRef([]);

  // Synchroniser avec les props
  useEffect(() => {
    setLocalCode(code);
  }, [code]);

  // Fonction de gestion simplifiée
  const handleChange = (index, value) => {
    console.log('VerificationCode - Input change:', index, value);
    
    // Autoriser seulement les chiffres et la chaîne vide
    if (value !== '' && !/^[0-9]$/.test(value)) {
      console.log('VerificationCode - Rejected non-digit:', value);
      return;
    }

    const newCode = [...localCode];
    newCode[index] = value;
    setLocalCode(newCode);
    
    console.log('VerificationCode - New digits:', newCode);

    // Notifier le parent
    if (onChange) {
      console.log('VerificationCode - Calling onChange with:', newCode);
      onChange(newCode);
    } else {
      console.log('VerificationCode - No onChange callback provided!');
    }

    // Focus sur le champ suivant si un chiffre est saisi
    if (value !== '' && index < 5) {
      setTimeout(() => {
        const nextInput = inputRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      }, 50);
    }
  };

  // Gestion des touches
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && localCode[index] === '' && index > 0) {
      setTimeout(() => {
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
        }
      }, 50);
    }
  };

  // Gestion du collage
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setLocalCode(newCode);
      
      if (onChange) {
        onChange(newCode);
      }
      
      // Focus sur le dernier champ
      setTimeout(() => {
        const lastInput = inputRefs.current[5];
        if (lastInput) {
          lastInput.focus();
        }
      }, 50);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-6 gap-1 w-full">
        {localCode.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            ref={(el) => {
              if (el) {
                inputRefs.current[index] = el;
              }
            }}
            className="w-full aspect-square text-center text-lg font-bold bg-white/[0.07] border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white transition-all duration-200"
            style={{ 
              pointerEvents: 'auto', 
              userSelect: 'auto',
              touchAction: 'manipulation',
              cursor: 'text',
              zIndex: 999,
              position: 'relative'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default VerificationCode;