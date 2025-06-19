const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface PuedeVotarResponse {
  success: boolean;
  puedeVotar: boolean;
}

export const puedeVotar = async (votacionId: number, estudianteId: number): Promise<boolean> => {
  const response = await fetch(`${API_URL}/api/votaciones/${votacionId}/puede-votar/${estudianteId}`);
  const data: PuedeVotarResponse = await response.json();
  if (!response.ok || !data.success) {
    throw new Error("No se pudo verificar si el estudiante puede votar");
  }
  return data.puedeVotar;
};