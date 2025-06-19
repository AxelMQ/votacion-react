const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface YaVotoResponse {
  success: boolean;
  yaVoto: boolean;
}

export const yaVoto = async (votacionId: number, estudianteId: number): Promise<boolean> => {
  const response = await fetch(`${API_URL}/api/votos/votacion/${votacionId}/estudiante/${estudianteId}/ya-voto`);
  const data: YaVotoResponse = await response.json();
  if (!response.ok || !data.success) {
    throw new Error("No se pudo verificar si el estudiante ya votó");
  }
  return data.yaVoto;
};