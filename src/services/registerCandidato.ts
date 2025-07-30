const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface CandidatoRegisterData {
  carnet: string;
  nombre: string;
  apellido: string;
  propuestas: string[];
  foto: File;
}

// Define the expected response data structure
interface CandidatoResponseData {
  id: number;
  carnet: string;
  nombre: string;
  apellido: string;
  fotoUrl: string;
  propuestas: string[];
  created_at: string;
  // Add other fields that your API returns
}

interface ApiResponse<T = CandidatoResponseData> {
  success: boolean;
  message: string;
  data?: T;
}

export const registerCandidato = async (
  candidato: CandidatoRegisterData
): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append("carnet", candidato.carnet);
  formData.append("nombre", candidato.nombre);
  formData.append("apellido", candidato.apellido);
  candidato.propuestas.forEach((p, idx) => 
    formData.append(`propuestas[${idx}]`, p)
  );
  formData.append("foto", candidato.foto);

  const response = await fetch(`${API_URL}/api/candidatos/register`, {
    method: "POST",
    body: formData,
  });

  const data: ApiResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error en el registro de candidato");
  }

  return data;
};