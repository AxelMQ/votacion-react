const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiResponse {
  success: boolean;
  data: any;
  message?: string;
}

export const actualizarEstadoVotacion = async (id: number | string, estado: string): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/api/votaciones/${id}/estado`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado }),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Error al actualizar estado");
  }
  return data;
};