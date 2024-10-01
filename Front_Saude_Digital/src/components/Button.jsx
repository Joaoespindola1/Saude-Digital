import React from 'react';

function Button({ text, onClick }) {
  return (
    <button
      className="bg-bg_azul_escuro hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;
