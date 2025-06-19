'use client';
import { crearVotacion } from "@/services/votacionesService";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NuevaVotacionForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mensaje, setMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria";
    if (!formData.fecha) newErrors.fecha = "La fecha es obligatoria";
    if (!formData.hora_inicio) newErrors.hora_inicio = "La hora de inicio es obligatoria";
    if (!formData.hora_fin) newErrors.hora_fin = "La hora de fin es obligatoria";
    // Validación de rango de horas
    if (formData.hora_inicio && formData.hora_fin && formData.hora_inicio >= formData.hora_fin) {
      newErrors.hora_fin = "La hora de fin debe ser mayor que la de inicio";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      // Formatear hora a HH:mm:ss si es necesario
      const votacionData = {
        ...formData,
        hora_inicio: formData.hora_inicio.length === 5 ? formData.hora_inicio + ":00" : formData.hora_inicio,
        hora_fin: formData.hora_fin.length === 5 ? formData.hora_fin + ":00" : formData.hora_fin,
      };
      const response = await crearVotacion(votacionData);
      if (response.success) {
        setMensaje("¡Votación creada exitosamente!");
        setFormData({
          nombre: "",
          descripcion: "",
          fecha: "",
          hora_inicio: "",
          hora_fin: "",
        });
        setErrors({});
        // Guarda la votación en localStorage para usarla en la siguiente página
        localStorage.setItem("votacionActual", JSON.stringify(response.data));
        // Redirige a la página de asignar candidatos
        router.push('/votacion-nueva/asignar-candidatos');
        
      
      } else {
        setMensaje("");
        setErrors({ general: response.message || "Error al crear la votación" });
      }
    } catch (error) {
      setMensaje("");
      setErrors({ general: error instanceof Error ? error.message : "Error al crear la votación" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
        {errors.general && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md text-center">
          {errors.general}
        </div>
      )}
      {mensaje && (
        <div className="p-3 text-sm text-green-700 bg-green-100 rounded-md text-center">
          {mensaje}
        </div>
      )}
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
          Nombre de la votación
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 text-gray-500  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
          Fecha
        </label>
        <input
          id="fecha"
          name="fecha"
          type="date"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={formData.fecha}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="hora_inicio" className="block text-sm font-medium text-gray-700">
            Hora de inicio
          </label>
          <input
            id="hora_inicio"
            name="hora_inicio"
            type="time"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={formData.hora_inicio}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex-1">
          <label htmlFor="hora_fin" className="block text-sm font-medium text-gray-700">
            Hora de fin
          </label>
          <input
            id="hora_fin"
            name="hora_fin"
            type="time"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={formData.hora_fin}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
      >
        {isLoading ? "Creando..." : "Crear votación"}
      </button>
      {mensaje && (
        <div className="p-3 text-sm text-green-700 bg-green-100 rounded-md text-center">
          {mensaje}
        </div>
      )}
    </form>
  );
}