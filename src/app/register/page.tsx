import RegisterForm from './form';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Registro de Estudiante
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Completa tus datos para participar en las votaciones
          </p>
        </div>
        <RegisterForm />
        
        <div className="mt-6 border-t border-gray-200 pt-6">
          <p className="text-xs text-gray-500 text-center">
            Al registrarte, aceptas los términos y condiciones del sistema de votación estudiantil.
          </p>
        </div>
      </div>
    </div>
  );
}