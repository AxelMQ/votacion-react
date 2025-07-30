'use client';
import { useState, useEffect } from "react";
import { getEstudiantes, Estudiante } from "@/services/estudiantesService";
import { asociarEstudianteAVotacion } from "@/services/asociarEstudiante";
import { useRouter } from "next/navigation";

interface Votacion {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  // Agrega aquí otros campos que necesites
}

export default function AsignarEstudiantesPage() {
  const [votacion, setVotacion] = useState<Votacion | null>(null);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const votacionGuardada = localStorage.getItem("votacionActual");
    if (votacionGuardada) setVotacion(JSON.parse(votacionGuardada));
    getEstudiantes()
      .then(setEstudiantes)
      .catch(() => setMensaje("Error al obtener estudiantes"))
      .finally(() => setLoading(false));
  }, []);

  const handleSeleccion = (id: number) => {
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    if (seleccionados.length === 0) {
      setMensaje("Selecciona al menos un estudiante.");
      return;
    }
    if (!votacion?.id) {
      setMensaje("No se encontró la votación.");
      return;
    }
    setLoading(true);
    try {
      await Promise.all(
        seleccionados.map((estudiante_id) =>
          asociarEstudianteAVotacion({ votacion_id: votacion.id, estudiante_id })
        )
      );
      setMensaje("¡Estudiantes asignados correctamente!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al asignar estudiantes";
      setMensaje(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        {/* ...info de la votación igual que antes... */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Selecciona los estudiantes que podrán votar
        </h2>
        {mensaje && (
          <div className="p-3 text-sm text-green-700 bg-green-100 rounded-md text-center">
            {mensaje}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {loading ? (
              <p className="text-gray-500">Cargando estudiantes...</p>
            ) : estudiantes.length === 0 ? (
              <p className="text-gray-500">No hay estudiantes disponibles.</p>
            ) : (
              <ul className="space-y-2">
                {estudiantes.map(e => (
                  <li key={e.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`estudiante-${e.id}`}
                      checked={seleccionados.includes(e.id)}
                      onChange={() => handleSeleccion(e.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`estudiante-${e.id}`} className="text-black font-medium">
                      {e.nombre} {e.apellido} ({e.carnet})
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
          >
            Asignar estudiantes
          </button>
        </form>
      </div>
    </div>
  );
}