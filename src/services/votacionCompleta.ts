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

export interface Participante {
  id: number;
  carnet: string;
  nombre: string;
  apellido: string;
  curso?: string;
  paralelo?: string;
}

export interface VotacionCompleta {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  creado_en: string;
  candidatos: Candidato[];
  participantes: Participante[];
}

interface ApiResponse {
  success: boolean;
  data: VotacionCompleta;
  message?: string;
}

export const getVotacionCompleta = async (id: number | string): Promise<VotacionCompleta> => {
  const response = await fetch(`${API_URL}/api/votaciones/${id}/completa`);
  const data: ApiResponse = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Error al obtener detalles de la votación");
  }
  return data.data;
};