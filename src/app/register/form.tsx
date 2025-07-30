'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PasswordInput from '@/components/register/PasswordInput';
import { registerStudent } from '@/services/authService';

interface FormData {
  carnet: string;
  nombre: string;
  apellido: string;
  password: string;
  confirmPassword: string;
  curso: string;
  paralelo: string;
}

export default function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    carnet: '',
    nombre: '',
    apellido: '',
    password: '',
    confirmPassword: '',
    curso: '',    // Valores por defecto o puedes hacerlos seleccionables
    paralelo: ''    // en el formulario
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.carnet.trim()) {
      newErrors.carnet = 'El carnet es requerido';
    } else if (!/^\d{6,10}$/.test(formData.carnet)) {
      newErrors.carnet = 'Carnet inválido (6-10 dígitos)';
    }
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'Nombre muy corto';
    }
    
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando se modifica
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await registerStudent({
        carnet: formData.carnet,
        nombre: formData.nombre,
        apellido: formData.apellido,
        password: formData.password,
        curso: formData.curso,
        paralelo: formData.paralelo
      });
    
        if (response.success) {
        router.push('/login?registered=true');
      } else {
        setErrors({
          general: response.message || 'Error en el registro. Intente nuevamente.'
        });
      }
      
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Error en el registro. Intente nuevamente.'
    });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {errors.general && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
          {errors.general}
        </div>
      )}
      
      <div className="space-y-4">
        {/* Campo Carnet */}
        <div>
          <label htmlFor="carnet" className="block text-sm font-medium text-gray-700">
            Número de Cédula de Identidad
          </label>
          <input
            id="carnet"
            name="carnet"
            type="text"
            inputMode="numeric"
            className={`mt-1 block w-full text-gray-500 px-3 py-2 border ${errors.carnet ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            value={formData.carnet}
            onChange={handleChange}
          />
          {errors.carnet && <p className="mt-1 text-sm text-red-600">{errors.carnet}</p>}
        </div>

        {/* Campo Nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Nombres
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            className={`mt-1 block w-full text-gray-500 px-3 py-2 border ${errors.nombre ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            value={formData.nombre}
            onChange={handleChange}
          />
          {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
        </div>

        {/* Campo Apellido */}
        <div>
          <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
            Apellidos
          </label>
          <input
            id="apellido"
            name="apellido"
            type="text"
            className={`mt-1 block w-full text-gray-500 px-3 py-2 border ${errors.apellido ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            value={formData.apellido}
            onChange={handleChange}
          />
          {errors.apellido && <p className="mt-1 text-sm text-red-600">{errors.apellido}</p>}
        </div>

        {/* Campo Curso */}
        <div>
          <label htmlFor="curso" className="block text-sm font-medium text-gray-700">
            Curso
          </label>
          <select
            id="curso"
            name="curso"
            className="mt-1 block w-full text-gray-500 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={formData.curso}
            onChange={handleChange}
          >
            <option value="1ro">1ro</option>
            <option value="2do">2do</option>
            <option value="3ro">3ro</option>
            <option value="4to">4to</option>
            <option value="5to">5to</option>
            <option value="6to">6to</option>
          </select>
        </div>

        {/* Campo Paralelo */}
          <div>
            <label htmlFor="paralelo" className="block text-sm font-medium text-gray-700">
              Paralelo
            </label>
            <select
              id="paralelo"
              name="paralelo"
              className="mt-1 block w-full text-gray-500 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.paralelo}
              onChange={handleChange}
            >
              <option value="">Selecciona un paralelo</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>

        {/* Campo Contraseña */}
        <PasswordInput
            id="password"
            name="password"
            label="Contraseña"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            showRequirements={true}
        />

        {/* Campo Confirmar Contraseña */}
        <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirmar Contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Repite tu contraseña"
        />

      </div>
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </button>
      </div>

      <div className="text-sm text-center">
        <span className="text-gray-600">¿Ya tienes una cuenta? </span>
        <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
          Inicia sesión
        </a>
      </div>
    </form>
  );
}