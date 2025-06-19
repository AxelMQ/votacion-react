'use client';
import { useState, useEffect } from "react";
import { getCandidatos, Candidato } from "@/services/candidatoService";
import { asociarCandidatoAVotacion } from "@/services/asociarCandidato";
import { useRouter } from "next/navigation";

export default function AsignarCandidatosPage() {
  const [votacion, setVotacion] = useState<any>(null);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const votacionGuardada = localStorage.getItem("votacionActual");
    if (votacionGuardada) {
      setVotacion(JSON.parse(votacionGuardada));
    }
    getCandidatos()
      .then(setCandidatos)
      .catch(() => setMensaje("Error al obtener candidatos"))
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
      setMensaje("Selecciona al menos un candidato.");
      return;
    }
    if (!votacion?.id) {
      setMensaje("No se encontró la votación.");
      return;
    }
    setLoading(true);
    try {
      // Asocia cada candidato seleccionado a la votación
      await Promise.all(
        seleccionados.map((candidato_id) =>
          asociarCandidatoAVotacion({ votacion_id: votacion.id, candidato_id })
        )
      );
      setMensaje("¡Candidatos asignados correctamente!");
      setTimeout(() => {
        router.push("/votacion-nueva/asignar-estudiantes");
      }, 1200); // Espera 1.2 segundos para mostrar el mensaje antes de redirigir
    } catch (error: any) {
      setMensaje(error.message || "Error al asignar candidatos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        {votacion && (
          <div className="mb-4 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold text-blue-800 mb-1">Votación actual</h3>
            <p><span className="font-medium text-blue-800">Nombre:</span> <span className="text-black">{votacion.nombre}</span></p>
            <p><span className="font-medium text-blue-800">Descripción:</span> <span className="text-black">{votacion.descripcion}</span></p>
            <p><span className="font-medium text-blue-800">Fecha:</span> <span className="text-black">{new Date(votacion.fecha).toLocaleDateString()}</span></p>
            <p><span className="font-medium text-blue-800">Hora inicio:</span> <span className="text-black">{votacion.hora_inicio}</span></p>
            <p><span className="font-medium text-blue-800">Hora fin:</span> <span className="text-black">{votacion.hora_fin}</span></p>
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Selecciona los candidatos para la votación
        </h2>
        {mensaje && (
          <div className="p-3 text-sm text-green-700 bg-green-100 rounded-md text-center">
            {mensaje}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {loading ? (
              <p className="text-gray-500">Cargando candidatos...</p>
            ) : candidatos.length === 0 ? (
              <p className="text-gray-500">No hay candidatos disponibles.</p>
            ) : (
              <ul className="space-y-2">
                {candidatos.map(c => (
                  <li key={c.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`candidato-${c.id}`}
                      checked={seleccionados.includes(c.id)}
                      onChange={() => handleSeleccion(c.id)}
                      className="mr-2"
                    />
                    
                    <div className="w-12 h-12 relative rounded-full overflow-hidden">
                        {c.fotoUrl ? (
                            <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}${c.fotoUrl.startsWith('/') ? '' : '/'}${c.fotoUrl}`}
                            alt={`Foto de ${c.nombre}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                console.log(`Error loading image for ${c.nombre}:`, c.fotoUrl);
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = ''; // Clear src
                                if (e.currentTarget.parentElement) {
                                    e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center"><span class="text-gray-500 text-2xl">👤</span></div>';
                                }
                            }}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-2xl">👤</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                      <label htmlFor={`candidato-${c.id}`} className="text-black font-medium">
                        {c.nombre} {c.apellido}
                      </label>
                      <p className="text-sm text-gray-500">Carnet: {c.carnet}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
          >
            Asignar candidatos
          </button>
        </form>
      </div>
    </div>
  );
}