'use client';
import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  showRequirements?: boolean;
  placeholder?: string;
}

export default function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  error,
  showRequirements = false,
  placeholder = ''
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          className={`block w-full px-3 py-2 border ${
            error ? 'border-red-300' : 'border-gray-300'
          } rounded-md focus:outline-none text-gray-500 focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      
      {showRequirements && !error && (
        <p className="mt-1 text-xs text-gray-500">
          Mínimo 8 caracteres
        </p>
      )}
    </div>
  );
}