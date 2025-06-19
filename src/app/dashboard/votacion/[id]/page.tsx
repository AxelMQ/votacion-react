'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getVotacionCompleta, VotacionCompleta } from "@/services/votacionCompleta";
import { actualizarEstadoVotacion } from "@/services/cambiarEstado";

export default function VotacionDetallePage() {
  const params = useParams() as { id?: string };
  const id = params?.id;
  const [votacion, setVotacion] = useState<VotacionCompleta | null>(null);
  const estados = ["pendiente", "en_progreso", "finalizada"];
  const [nuevoEstado, setNuevoEstado] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getVotacionCompleta(id as string)
      .then(setVotacion)
      .catch((err) => setMensaje(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (votacion) setNuevoEstado(votacion.estado);
  }, [votacion]);

  const handleActualizarEstado = async () => {
    if (!id || !nuevoEstado) return;
    setLoading(true);
    setMensaje("");
    try {
      const res = await actualizarEstadoVotacion(id, nuevoEstado);
      setVotacion((prev) => prev ? { ...prev, estado: nuevoEstado } : prev);
      setMensaje("¡Estado actualizado correctamente!");
    } catch (err: any) {
      setMensaje(err.message || "Error al actualizar estado");
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
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}${c.fotoUrl}`}
                          alt={c.nombre}
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
                  {votacion.participantes.map((p) => (
                    <li key={p.id} className="text-sm text-gray-800">
                      {p.nombre} {p.apellido} <span className="text-xs text-gray-500">({p.carnet})</span>
                    </li>
                  ))}
                </ul>
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