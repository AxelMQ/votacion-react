const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface EmitirVotoPayload {
  votacion_id: number | string;
  candidato_id: number;
  estudiante_id: number;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export const emitirVoto = async (payload: EmitirVotoPayload): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/api/votos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data: ApiResponse = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Error al emitir el voto");
  }
  return data;
};