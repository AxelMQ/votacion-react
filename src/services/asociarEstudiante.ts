const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AsociarEstudiantePayload {
  votacion_id: number;
  estudiante_id: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
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