/* eslint-disable react/prop-types */
import React from "react";

const Input = ({ label, type = "text", id, placeholder, value, onChange }) => {
  return (
    <div className="mb-4 w-full">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bg_azul_escuro"
      />
    </div>
  );
};

export default Input;
