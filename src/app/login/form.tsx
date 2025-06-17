'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginStudent } from "@/services/authService";

export default function LoginForm() {
    const [carnet, setCarnet ] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        try {
            if (!carnet || !password) {
                throw new Error('Por favor completa todos los campos');
            }

            const response = await loginStudent({ carnet, password });

            if (response.success && response.token) {
                // Guarda el token si lo necesitas
                localStorage.setItem("token", response.token);
                setSuccess('¡Inicio de sesión exitoso!');
                // Redirige al dashboard o a donde desees
                // router.push('/dashboard');
                // Puedes limpiar los campos si quieres
                setCarnet('');
                setPassword('');
            } else {
                setError(response.message || 'Credenciales incorrectas');
            }

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message || 'Credenciales incorrectas');
            } else {
                setError('Credenciales incorrectas');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
             {error && (
                <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-3 text-sm text-green-700 bg-green-100 rounded-md">
                    {success}
                </div>
            )}
            <div className="rounded-md shadow-sm space-y-4">
                <div>
                    <label htmlFor="carnet" className="block text-sm font-medium text-gray-700 mb-1">
                        Carnet o Correo Institucional
                    </label>
                    <input
                      id="carnet"
                      name="carnet"
                      type="text"
                      required
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Ej: 20201010"
                      value={carnet}
                      onChange={(e) => setCarnet(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Ingresa tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>
{/* 
            <div className="flex items-center justify-between" >
                <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                        Recuerdame
                    </label>
                </div>
            </div> */}

            <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Procesando...
                        </>
                    ) : 'Iniciar Sesión'}
                </button>
            </div>

            <div className="text-sm text-center">
                <span className="text-gray-600">¿No tienes una cuenta? </span>
                <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                   Regístrate
                </a>
            </div>
        </form>
    );
}
