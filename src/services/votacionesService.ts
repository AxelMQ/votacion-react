const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface VotacionData {
  nombre: string;
  descripcion: string;
  fecha: string;         // formato: YYYY-MM-DD
  hora_inicio: string;   // formato: HH:mm:ss
  hora_fin: string;      // formato: HH:mm:ss
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const crearVotacion = async (votacion: VotacionData): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/api/votaciones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(votacion)
  });

  const data: ApiResponse = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Error al crear la votación");
  }
  return data;
};