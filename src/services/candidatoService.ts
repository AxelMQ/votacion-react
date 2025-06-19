const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Candidato {
  id: number;
  carnet: string;
  nombre: string;
  apellido: string;
  propuestas: string;
  fotoUrl: string | null;
  fecha_registro: string;
}

interface ApiResponse {
  success: boolean;
  data: Candidato[];
  message?: string;
}

export const getCandidatos = async (): Promise<Candidato[]> => {
  const response = await fetch(`${API_URL}/api/candidatos`);
  const data: ApiResponse = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Error al obtener candidatos");
  }
  return data.data;
};