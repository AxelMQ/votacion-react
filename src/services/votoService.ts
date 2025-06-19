const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Voto {
  id: number;
  votacion_id: number;
  estudiante_id: number;
  candidato_id: number;
  fecha: string;
}

interface ApiResponse {
  success: boolean;
  data: Voto[];
  message?: string;
}

export const getVotosPorVotacion = async (votacionId: number | string): Promise<Voto[]> => {
  const response = await fetch(`${API_URL}/api/votos/votacion/${votacionId}`);
  const data: ApiResponse = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Error al obtener votos");
  }
  return data.data;
};