import React, { useState } from "react";
import { Candidato } from "@/services/candidatosVotacionService";

interface CandidatoCardProps {
  candidato: Candidato;
  seleccionado: boolean;
  onSelect: (id: number) => void;
}

export function CandidatoCard({ candidato, seleccionado, onSelect }: CandidatoCardProps) {
  const [open, setOpen] = useState(false);

  let propuestas: string[] = [];
  try {
    propuestas = JSON.parse(candidato.propuestas);
  } catch {
    propuestas = [candidato.propuestas];
  }

  return (
    <li className="flex flex-col items-start p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="flex items-center w-full">
        {candidato.fotoUrl ? (
          <div className="w-24 h-24 rounded-full bg-white border-4 border-green-200 shadow flex items-center justify-center mr-6 overflow-hidden">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${candidato.fotoUrl}`}
              alt={candidato.nombre}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mr-6 text-4xl border-4 border-gray-200 shadow">
            👤
          </div>
        )}
        <div className="flex-1">
          <div className="font-semibold text-xl text-gray-800">
            {candidato.nombre} {candidato.apellido}
          </div>
          <div className="text-xs text-gray-500">Carnet: {candidato.carnet}</div>
        </div>
        <input
          type="radio"
          name="candidato"
          value={candidato.id}
          checked={seleccionado}
          onChange={() => onSelect(candidato.id)}
          className="ml-4 w-5 h-5 accent-green-600"
        />
      </div>
      <button
        type="button"
        className="mt-4 text-blue-600 text-sm underline"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? "Ocultar propuestas" : "Ver propuestas"}
      </button>
      {open && (
        <ul className="mt-2 pl-4 list-disc text-gray-700 text-base">
          {propuestas.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      )}
    </li>
  );
}