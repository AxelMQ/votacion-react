const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Votacion {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  creado_en: string;
}

interface ApiResponse {
  success: boolean;
  data: Votacion[];
  message?: string;
}

export const getVotaciones = async (): Promise<Votacion[]> => {
  const response = await fetch(`${API_URL}/api/votaciones`);
  const data: ApiResponse = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Error al obtener votaciones");
  }
  return data.data;
};