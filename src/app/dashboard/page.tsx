'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getVotaciones, Votacion } from "@/services/getVotaciones";
import { puedeVotar } from "@/services/puedeVotar";


interface UserData {
  id:string;
  nombre: string;
  apellido: string;
  carnet?: string;
  curso?: string;
  paralelo?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [votaciones, setVotaciones] = useState<Votacion[]>([]);
  const [loadingVotaciones, setLoadingVotaciones] = useState(true);
  const [puedeVotarMap, setPuedeVotarMap] = useState<Record<number, boolean | null>>({});
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    getVotaciones()
      .then(setVotaciones)
      .catch(() => setVotaciones([]))
      .finally(() => setLoadingVotaciones(false));
  }, [router]);

  // Nuevo useEffect SOLO para puedeVotar
  useEffect(() => {
    if (!user || !user.carnet || votaciones.length === 0) return;
    votaciones.forEach((v) => {
      puedeVotar(v.id, Number(user.id))
        .then((res) => setPuedeVotarMap((prev) => ({ ...prev, [v.id]: res })))
        .catch(() => setPuedeVotarMap((prev) => ({ ...prev, [v.id]: null })));
    });
  }, [user, votaciones]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          ¡Bienvenido{user ? `, ${user.nombre} ${user.apellido}` : ""}!
        </h2>
        <p className="text-gray-700 mb-6">
          Aquí podrás crear votaciones y ver tus opciones.
        </p>
        <div className="flex flex-col gap-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => router.push("/votacion-nueva")}
          >
            Crear nueva votación
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={() => setShowProfile((prev) => !prev)}
          >
            {showProfile ? "Ocultar perfil" : "Ver perfil"}
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
        {showProfile && user && (
          <div className="mt-6 p-4 bg-gray-100 rounded border border-gray-300 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Perfil</h3>
            <p>
              <span className="font-medium text-blue-700">Nombre:</span>{" "}
              <span className="text-gray-900">{user.nombre}</span>
            </p>
            <p>
              <span className="font-medium text-blue-700">Apellido:</span>{" "}
              <span className="text-gray-900">{user.apellido}</span>
            </p>
            {user.carnet && (
              <p>
                <span className="font-medium text-blue-700">Carnet:</span>{" "}
                <span className="text-gray-900">{user.carnet}</span>
              </p>
            )}
            {user.curso && (
              <p>
                <span className="font-medium text-blue-700">Curso:</span>{" "}
                <span className="text-gray-900">{user.curso}</span>
              </p>
            )}
            {user.paralelo && (
              <p>
                <span className="font-medium text-blue-700">Paralelo:</span>{" "}
                <span className="text-gray-900">{user.paralelo}</span>
              </p>
            )}
          </div>
        )}

        <hr className="my-6" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Votaciones registradas</h3>
        {loadingVotaciones ? (
          <p className="text-gray-500">Cargando votaciones...</p>
        ) : votaciones.length === 0 ? (
          <p className="text-gray-500">No hay votaciones registradas.</p>
        ) : (
          <ul className="space-y-3 text-left">
          {votaciones.map((v) => (
            <li key={v.id} className="p-3 bg-gray-100 rounded border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-semibold text-blue-800">{v.nombre}</div>
                <div className="text-sm text-gray-700">{v.descripcion}</div>
                <div className="text-xs text-gray-500">
                  Fecha: {new Date(v.fecha).toLocaleDateString()} | Estado: {v.estado}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 sm:mt-0">
                <button
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-xs font-semibold"
                  onClick={() => router.push(`/dashboard/votacion/${v.id}`)}
                >
                  Ver detalles
                </button>
                {puedeVotarMap[v.id] === undefined ? (
                  <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded text-xs">Verificando...</span>
                ) : puedeVotarMap[v.id] ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Habilitado para votar</span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">No habilitado</span>
                )}
              </div>
            </li>
          ))}
        </ul>
        )}
      </div>
    </div>
  );
}