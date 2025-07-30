const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AsociarCandidatoPayload {
  votacion_id: number;
  candidato_id: number;
}

// Define a more specific interface for the expected response data
interface VotacionCandidatoData {
  id: number;
  votacion_id: number;
  candidato_id: number;
  created_at: string;
  // Add other relevant fields that your API returns
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export const asociarCandidatoAVotacion = async (payload: AsociarCandidatoPayload): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/api/votaciones/candidato`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: ApiResponse<VotacionCandidatoData> = await response.json();
  
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Error al asociar candidato");
  }
  return data;
};