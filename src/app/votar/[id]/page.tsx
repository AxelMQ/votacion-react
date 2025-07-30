'use client';
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getVotacionCompleta, VotacionCompleta } from "@/services/votacionCompleta";
import { emitirVoto } from "@/services/emitirVoto";
import { getCandidatosPorVotacion, Candidato } from "@/services/candidatosVotacionService";
import { CandidatoCard } from "@/components/CandidatoCardProps";

export default function VotarPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const [votacion, setVotacion] = useState<VotacionCompleta | null>(null);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [candidatoId, setCandidatoId] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingCandidatos, setLoadingCandidatos] = useState(true);

  // Obtener estudiante autenticado desde localStorage
  const getEstudianteId = () => {
    const userData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (!userData) return null;
    try {
      const user = JSON.parse(userData);
      return Number(user.id);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getVotacionCompleta(id)
      .then(setVotacion)
      .catch(() => setMensaje("Error al cargar la votación"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoadingCandidatos(true);
    getCandidatosPorVotacion(id)
      .then(setCandidatos)
      .catch(() => setCandidatos([]))
      .finally(() => setLoadingCandidatos(false));
  }, [id]);

  const handleVotar = async () => {
    if (!candidatoId) {
      setMensaje("Selecciona un candidato.");
      return;
    }
    if (!id) {
        setMensaje("No se encontró la votación.");
        return;
    }
    const estudianteId = getEstudianteId();
    if (!estudianteId) {
      setMensaje("No se pudo identificar al usuario.");
      return;
    }
    setMensaje("");
    try {
      await emitirVoto({ votacion_id: id, candidato_id: candidatoId, estudiante_id: estudianteId });
      setMensaje("¡Voto registrado correctamente!");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al emitir el voto.";
      setMensaje(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg w-full p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-black mb-4">Votar en: {votacion?.nombre || ""}</h2>
        {loading ? (
          <p className="text-gray-500">Cargando votación...</p>
        ) : votacion ? (
          <>
            {loadingCandidatos ? (
              <p className="text-gray-500">Cargando candidatos...</p>
            ) : candidatos.length === 0 ? (
              <p className="text-gray-500">No hay candidatos disponibles.</p>
            ) : (
              <ul className="space-y-4 mb-4">
                {candidatos.map((c) => (
                  <CandidatoCard
                    key={c.id}
                    candidato={c}
                    seleccionado={candidatoId === c.id}
                    onSelect={setCandidatoId}
                  />
                ))}
              </ul>
            )}
            <button
              className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
              onClick={handleVotar}
              disabled={loadingCandidatos || !candidatoId}
            >
              Votar
            </button>
            {mensaje && <div className="mt-4 text-center text-green-700">{mensaje}</div>}
          </>
        ) : (
          <p className="text-red-600">{mensaje}</p>
        )}
      </div>
    </div>
  );
}