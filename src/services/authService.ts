// services/authService.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface StudentRegisterData {
  carnet: string;
  nombre: string;
  apellido: string;
  password: string;
  curso?: string;  // Opcional si no es requerido
  paralelo?: string; // Opcional si no es requerido
}

interface LoginCredentials {
  carnet: string;
  password: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  token?: string;
  user?: {
    id: string;
    carnet: string;
    nombre: string;
    apellido: string;
  };
}

// Configuración común para fetch
const fetchConfig = {
  baseHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 8000 // 8 segundos
};

export const registerStudent = async (studentData: StudentRegisterData): Promise<ApiResponse> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), fetchConfig.timeout);
    
    const response = await fetch(`${API_URL}/api/estudiantes/register`, {
      method: 'POST',
      headers: fetchConfig.baseHeaders,
      body: JSON.stringify({
        carnet: studentData.carnet, // Asegúrate que coincida con el modelo del backend
        nombre: studentData.nombre,
        apellido: studentData.apellido,
        password: studentData.password,
        curso: studentData.curso || '', // Enviar como cadena vacía si no se proporciona
        paralelo: studentData.paralelo || '', // Enviar como cadena vacía si no se proporciona
      }),
      signal: controller.signal
    });

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en el registro');
    }

    return data;
  } catch (error) {
    console.error('Error en registerStudent:', error);
    throw error instanceof Error ? error : new Error('Error desconocido');
  }
};

export const loginStudent = async (credentials: LoginCredentials): Promise<ApiResponse> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), fetchConfig.timeout);

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: fetchConfig.baseHeaders,
      body: JSON.stringify({
        carnet: credentials.carnet, // Asegúrate que coincida con el backend
        password: credentials.password
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
    }

    return data;

  } catch (error) {
     console.error('Error en loginStudent:', error);
    
    // Mensajes más específicos para el usuario
    if (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === 'AbortError') {
      throw new Error('La solicitud tardó demasiado. Por favor intente nuevamente');
    }
    
    throw error instanceof Error ? error : new Error('Error desconocido al iniciar sesión');
  }
};