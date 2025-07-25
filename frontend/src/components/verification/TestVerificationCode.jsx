import React, { useState } from 'react';

const TestVerificationCode = () => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);

  const handleChange = (index, value) => {
    console.log('Input change:', index, value);
    
    if (value !== '' && !/^[0-9]$/.test(value)) {
      console.log('Rejected non-digit:', value);
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    
    console.log('New digits:', newDigits);
  };

  return (
    <div className="p-8 bg-gray-800 rounded-lg">
      <h3 className="text-white text-xl mb-4">Test de saisie de code</h3>
      <div className="flex gap-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            className="w-12 h-12 text-center text-xl bg-white text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ 
              backgroundColor: 'white', 
              color: 'black',
              border: '2px solid #ccc',
              fontSize: '20px'
            }}
          />
        ))}
      </div>
      <div className="mt-4 text-white">
        <p>Code actuel: {digits.join('')}</p>
        <p>Nombre de chiffres: {digits.filter(d => d !== '').length}</p>
      </div>
    </div>
  );
};

export default TestVerificationCode; 