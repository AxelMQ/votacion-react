const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AsociarEstudiantePayload {
  votacion_id: number;
  estudiante_id: number;
}

// Define a specific interface for the response data
interface VotacionEstudianteData {
  id: number;
  votacion_id: number;
  estudiante_id: number;
  created_at: string;
  // Add other fields that your API returns
}

interface ApiResponse<T = VotacionEstudianteData> {
  success: boolean;
  message: string;
  data?: T;
}

export const asociarEstudianteAVotacion = async (payload: AsociarEstudiantePayload): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/api/votaciones/participante`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Error al asociar estudiante");
  }
  return data;
};