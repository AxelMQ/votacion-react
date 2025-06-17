import LoginForm from "./form";
import Link from "next/link";

export default function LoginPage(){
    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3x1 font-extrabold text-gray-900">
                        Iniciar Sesion
                    </h2>
                </div>
                
                <LoginForm/>
                
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded">
                <p className="text-green-800">
                    ¿Te gustaría postularte como candidato?{" "}
                    <Link href="/register-candidato" className="underline font-semibold text-green-700 hover:text-green-900">
                    Haz clic aquí para inscribirte
                    </Link>
                </p>
                </div>
            </div>
        </div>
    );
}