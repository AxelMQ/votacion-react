const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Define the expected response data structure
interface VotacionEstadoData {
  id: number;
  estado: string;
  updated_at: string;
  // Add other fields that your API returns
}

interface ApiResponse<T = VotacionEstadoData> {
  success: boolean;
  data: T;
  message?: string;
}

export const actualizarEstadoVotacion = async (
  id: number | string, 
  estado: string
): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/api/votaciones/${id}/estado`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado }),
  });

  const data: ApiResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Error al actualizar estado");
  }

  return data;
};