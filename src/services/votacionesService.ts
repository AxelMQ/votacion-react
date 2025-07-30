const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface VotacionData {
  nombre: string;
  descripcion: string;
  fecha: string;         // formato: YYYY-MM-DD
  hora_inicio: string;   // formato: HH:mm:ss
  hora_fin: string;      // formato: HH:mm:ss
}

// Define the expected response data structure
interface VotacionResponseData {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T = VotacionResponseData> {
  success: boolean;
  message: string;
  data?: T;
}

export const crearVotacion = async (
  votacion: VotacionData
): Promise<ApiResponse> => {
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