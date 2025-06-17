import RegisterCandidatoForm from "./form";


export default function RegisterCandidatoPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3x1 font-extrabold text-gray-900">
                        Registro de Candidato
                    </h2>
                </div>
                <RegisterCandidatoForm />
            </div>
        </div>
    );
}