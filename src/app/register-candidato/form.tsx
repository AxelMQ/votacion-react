'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
// import { useRouter } from 'next/navigation';
import { registerCandidato } from '@/services/registerCandidato';

interface FormData {
  carnet: string;
  nombre: string;
  apellido: string;
  propuestas: string[];
  foto: File | null;
}

export default function RegisterCandidatoForm() {
  const [formData, setFormData] = useState<FormData>({
    carnet: '',
    nombre: '',
    apellido: '',
    propuestas: [''],
    foto: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  // const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.carnet.trim()) newErrors.carnet = 'El carnet es requerido';
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    if (!formData.foto) newErrors.foto = 'La foto es requerida';
    if (!formData.propuestas.some(p => p.trim())) newErrors.propuestas = 'Agrega al menos una propuesta';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'foto' && files) {
      setFormData(prev => ({ ...prev, foto: files[0] }));
      setErrors(prev => ({ ...prev, foto: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePropuestaChange = (idx: number, value: string) => {
    setFormData(prev => {
      const propuestas = [...prev.propuestas];
      propuestas[idx] = value;
      return { ...prev, propuestas };
    });
    setErrors(prev => ({ ...prev, propuestas: '' }));
  };

  const addPropuesta = () => {
    setFormData(prev => ({ ...prev, propuestas: [...prev.propuestas, ''] }));
  };

  const removePropuesta = (idx: number) => {
    setFormData(prev => {
      const propuestas = prev.propuestas.filter((_, i) => i !== idx);
      return { ...prev, propuestas };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccess('');
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await registerCandidato({
        carnet: formData.carnet,
        nombre: formData.nombre,
        apellido: formData.apellido,
        propuestas: formData.propuestas.filter(p => p.trim()),
        foto: formData.foto as File,
      });
      if (response.success || (response.message && response.message.toLowerCase().includes("exitosamente"))) {
        setSuccess(response.message || '¡Registro exitoso!');
        setErrors({});
        setFormData({
          carnet: '',
          nombre: '',
          apellido: '',
          propuestas: [''],
          foto: null,
        });
      } else {
        setErrors({ general: response.message || 'Error en el registro.' });
      }
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Error en el registro.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {/* Mensaje de error */}
        {errors.general && !success && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
            {errors.general}
            </div>
        )}
        {/* Mensaje de éxito */}
        {success && (
            <div className="p-3 text-sm text-green-700 bg-green-100 rounded-md">
            {success}
            </div>
        )}
      <div className="space-y-4">
        {/* Carnet */}
        <div>
          <label htmlFor="carnet" className="block text-sm font-medium text-gray-700">
            Carnet
          </label>
          <input
            id="carnet"
            name="carnet"
            type="text"
            className={`mt-1 block w-full text-gray-500 px-3 py-2 border ${errors.carnet ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            value={formData.carnet}
            onChange={handleChange}
          />
          {errors.carnet && <p className="mt-1 text-sm text-red-600">{errors.carnet}</p>}
        </div>
        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Nombre
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
        {/* Apellido */}
        <div>
          <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
            Apellido
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
        {/* Propuestas */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Propuestas
          </label>
          {formData.propuestas.map((propuesta, idx) => (
            <div key={idx} className="flex items-center mt-1">
              <input
                type="text"
                className="flex-1 px-3 py-2 border  text-gray-500 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={`Propuesta ${idx + 1}`}
                value={propuesta}
                onChange={e => handlePropuestaChange(idx, e.target.value)}
              />
              {formData.propuestas.length > 1 && (
                <button
                  type="button"
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => removePropuesta(idx)}
                  title="Eliminar propuesta"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
            onClick={addPropuesta}
          >
            + Agregar propuesta
          </button>
          {errors.propuestas && <p className="mt-1 text-sm text-red-600">{errors.propuestas}</p>}
        </div>
        {/* Foto */}
        <div>
          <label htmlFor="foto" className="block text-sm font-medium text-gray-700">
            Foto
          </label>
          <input
            id="foto"
            name="foto"
            type="file"
            accept="image/*"
            className={`mt-1 block w-full text-gray-500 px-3 py-2 border ${errors.foto ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            onChange={handleChange}
          />
          {errors.foto && <p className="mt-1 text-sm text-red-600">{errors.foto}</p>}
        </div>
      </div>
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Registrando...' : 'Registrar Candidato'}
        </button>
      </div>
    </form>
  );
}