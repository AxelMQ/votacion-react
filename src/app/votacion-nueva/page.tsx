import NuevaVotacionForm from "./form";

export default function NuevaVotacionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Crear nueva votación
        </h2>
        <NuevaVotacionForm />
      </div>
    </div>
  );
}