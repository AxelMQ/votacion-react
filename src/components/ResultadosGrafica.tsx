import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { VotacionCompleta } from "@/services/votacionCompleta";
import { Voto } from "@/services/votoService";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  votacion: VotacionCompleta;
  votos: Voto[];
}

export default function ResultadosGrafica({ votacion, votos }: Props) {
  // Calcular votos por candidato
  const votosPorCandidato = votacion.candidatos.map((c) => ({
    ...c,
    cantidad: votos.filter((v) => v.candidato_id === c.id).length,
  }));

  // Encontrar el máximo de votos
  const maxVotos = Math.max(...votosPorCandidato.map(c => c.cantidad), 0);

  // Datos para la gráfica
  const chartData = {
    labels: votosPorCandidato.map((c) => `${c.nombre} ${c.apellido}`),
    datasets: [
      {
        label: "Votos",
        data: votosPorCandidato.map((c) => c.cantidad),
        backgroundColor: votosPorCandidato.map((c) =>
          c.cantidad === maxVotos && maxVotos > 0 ? "#22c55e" : "#3b82f6"
        ),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true, precision: 0 },
    },
  };

  return (
    <div>
      <Bar data={chartData} options={chartOptions} />
      <ul className="space-y-1 mt-4">
        {votosPorCandidato.map((c) => (
          <li
            key={c.id}
            className={`flex items-center gap-2 ${
              c.cantidad === maxVotos && maxVotos > 0
                ? "font-bold text-green-700"
                : "text-gray-800"
            }`}
          >
            <span>
              {c.nombre} {c.apellido}
            </span>
            <span className="px-2 py-1 bg-gray-200 rounded text-xs">
              {c.cantidad} voto(s)
              {c.cantidad === maxVotos && maxVotos > 0 ? " 🏆" : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}