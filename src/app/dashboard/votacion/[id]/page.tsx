'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getVotacionCompleta, VotacionCompleta } from "@/services/votacionCompleta";
import { actualizarEstadoVotacion } from "@/services/cambiarEstado";
import { getVotosPorVotacion, Voto } from "@/services/votoService";
import ResultadosGrafica from "@/components/ResultadosGrafica";
import Image from "next/image";

export default function VotacionDetallePage() {
  const params = useParams() as { id?: string };
  const id = params?.id;
  const [votacion, setVotacion] = useState<VotacionCompleta | null>(null);
  const estados = ["pendiente", "en_progreso", "finalizada"];
  const [nuevoEstado, setNuevoEstado] = useState<string>("");
  const [votos, setVotos] = useState<Voto[]>([]);
  const [loadingVotos, setLoadingVotos] = useState(true);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getVotacionCompleta(id)
      .then((data) => setVotacion(data))
      .catch((err) => setMensaje(err.message || "Error al cargar la votación"))
      .finally(() => setLoading(false));
  }, [id]);

  // Cargar votos y actualizar cada 5 segundos
  useEffect(() => {
    if (!id) return;
    const fetchVotos = () => {
      setLoadingVotos(true);
      getVotosPorVotacion(id)
        .then(setVotos)
        .catch(() => setVotos([]))
        .finally(() => setLoadingVotos(false));
    };
    fetchVotos();
    const interval = setInterval(fetchVotos, 10000); // Actualiza cada 10 segundos
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (votacion) setNuevoEstado(votacion.estado);
  }, [votacion]);

  const handleActualizarEstado = async () => {
    if (!id || !nuevoEstado) return;
    setLoading(true);
    setMensaje("");
    try {
      await actualizarEstadoVotacion(id, nuevoEstado);
      setVotacion((prev) => prev ? { ...prev, estado: nuevoEstado } : prev);
      setMensaje("¡Estado actualizado correctamente!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMensaje(err.message);
      } else {
        setMensaje("Error al actualizar estado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl w-full p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-black mb-4">
          Detalle de la Votación {votacion ? `#${votacion.id}` : ""}
        </h2>
        {loading ? (
          <p className="text-gray-500">Cargando detalles...</p>
        ) : votacion ? (
          <>
            <div className="mb-4">
              <div className="font-semibold text-lg text-blue-800">{votacion.nombre}</div>
              <div className="text-gray-700">{votacion.descripcion}</div>
              <div className="text-xs text-gray-500">
                Fecha: {new Date(votacion.fecha).toLocaleDateString()}<br />
                Hora: {votacion.hora_inicio} - {votacion.hora_fin}<br />
                Estado actual: <span className="font-bold">{votacion.estado}</span>
                <div className="mt-2 flex items-center gap-2">
                  <select
                    value={nuevoEstado}
                    onChange={e => setNuevoEstado(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                    disabled={loading}
                  >
                    {estados.map(e => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleActualizarEstado}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    disabled={loading || nuevoEstado === votacion.estado}
                  >
                    Guardar
                  </button>
                </div>
                {mensaje && <div className="text-green-600 mt-2">{mensaje}</div>}
              </div>
            </div>
            <hr className="my-4" />
            <div className="mb-4">
              <h3 className="font-semibold text-blue-700 mb-2">Candidatos</h3>
              {votacion.candidatos.length === 0 ? (
                <p className="text-gray-500">No hay candidatos asignados.</p>
              ) : (
                <ul className="space-y-2">
                  {votacion.candidatos.map((c) => (
                    <li key={c.id} className="flex items-center space-x-2">
                      {c.fotoUrl ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}${c.fotoUrl}`}
                          alt={c.nombre}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-500">👤</span>
                      )}
                      <span className="font-medium text-black">{c.nombre} {c.apellido}</span>
                      <span className="text-xs text-gray-500 ml-2">({c.carnet})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-blue-700 mb-2">Participantes habilitados</h3>
              {votacion.participantes.length === 0 ? (
                <p className="text-gray-500">No hay participantes asignados.</p>
              ) : (
                <ul className="space-y-1 max-h-32 overflow-y-auto">
                  {votacion.participantes.map((p) => {
                    const yaVoto = votos.some((v) => v.estudiante_id === p.id);
                    return (
                      <li key={p.id} className="text-sm text-gray-800 flex items-center gap-2">
                        {p.nombre} {p.apellido} <span className="text-xs text-gray-500">({p.carnet})</span>
                        {yaVoto ? (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-semibold">Ya votó</span>
                        ) : (
                          <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">No ha votado</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className="mt-6">
            <h3 className="font-semibold text-blue-700 mb-2">Resultados parciales</h3>
            {loadingVotos ? (
              <p className="text-gray-500">Cargando votos...</p>
            ) : (
              <ul className="space-y-1">
                {votacion?.candidatos.map((c) => {
                  const cantidad = votos.filter(v => v.candidato_id === c.id).length;
                  return (
                    <li key={c.id} className="flex items-center gap-2">
                      <span className="font-medium text-black">{c.nombre} {c.apellido}</span>
                      <span className="px-2 py-1 bg-gray-200 rounded text-xs text-gray-800">{cantidad} voto(s)</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="mt-6">
            <h3 className="font-semibold text-blue-700 mb-2">Resultados parciales</h3>
            {loadingVotos ? (
              <p className="text-gray-500">Cargando votos...</p>
            ) : (
              votacion && <ResultadosGrafica votacion={votacion} votos={votos} />
            )}
          </div>
          </>
        ) : mensaje ? (
          <p className="text-red-600">{mensaje}</p>
        ) : null}
      </div>
    </div>
  );
}