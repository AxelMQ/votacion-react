const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Estudiante {
  id: number;
  carnet: string;
  nombre: string;
  apellido: string;
  curso?: string;
  paralelo?: string;
}

interface ApiResponse {
  success: boolean;
  data: Estudiante[];
  message?: string;
}

export const getEstudiantes = async (): Promise<Estudiante[]> => {
  const response = await fetch(`${API_URL}/api/estudiantes`);
  const data: ApiResponse = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Error al obtener estudiantes");
  }
  return data.data;
};