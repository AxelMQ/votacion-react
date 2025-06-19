const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AsociarCandidatoPayload {
  votacion_id: number;
  candidato_id: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const asociarCandidatoAVotacion = async (payload: AsociarCandidatoPayload): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/api/votaciones/candidato`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Error al asociar candidato");
  }
  return data;
};