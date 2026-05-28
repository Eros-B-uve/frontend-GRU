import { useEffect, useState } from 'react';
import { X, MapPinned } from 'lucide-react';

import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

import api from '../api/axios';

type DashboardData = {
  areasActivas: number;
  residuoMasDesechado: {
    tipo: string;
    total: string;
  } | null;
  generacionPorTipo: {
    dia: string;
    tipo: string;
    total: string;
  }[];
  distribucionPorArea: {
    area: string;
    color: string;
    total: string;
  }[];
  registrosRecientes: {
    id: string;
    tipo: string;
    area: string;
    fecha: string;
    conteo: string;
  }[];
};

type AreaItem = {
  id: number;
  nombre: string;
  color: string | null;
  responsable_nombre: string | null;
  tiene_contenedores: boolean;
  containers?: {
    id: number;
    tipo: string;
  }[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [areasModalOpen, setAreasModalOpen] = useState(false);
  const [areas, setAreas] = useState<AreaItem[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(false);

  const loadDashboard = async () => {
    try {
      const response = await api.get('/analytics/dashboard');
      setData(response.data);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-[#0f5138] font-bold">
        Cargando dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-red-500 font-bold">
        No se pudo cargar la información del dashboard.
      </div>
    );
  }

  const lineData = formatWeeklyData(data.generacionPorTipo);

  const pieData = data.distribucionPorArea.map((item) => ({
    name: item.area,
    value: Number(item.total),
    color: item.color || '#46c6a0',
  }));

  const openAreasModal = async () => {
  setAreasModalOpen(true);
  setLoadingAreas(true);

  try {
    const response = await api.get('/areas');
    setAreas(response.data);
  } catch (error) {
    console.error('Error al cargar áreas:', error);
    alert('No se pudieron cargar las áreas');
  } finally {
    setLoadingAreas(false);
  }
};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-[#0f5138]">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Resumen general del monitoreo de residuos.
        </p>
      </div>

      {/* Cards superiores */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl border border-[#d9efe6] p-6 shadow-sm">
          <p className="text-sm font-bold text-gray-500">
            Residuo más desechado
          </p>

          <h2 className="text-3xl font-black text-[#0f5138] mt-2 capitalize">
            {data.residuoMasDesechado?.tipo || 'Sin datos'}
          </h2>

          <p className="text-sm text-[#189a73] font-semibold mt-1">
            {data.residuoMasDesechado
              ? `${Number(data.residuoMasDesechado.total)} registros`
              : 'Aún no hay lecturas'}
          </p>
        </div>

        <button
          type="button"
          onClick={openAreasModal}
          className="bg-white rounded-3xl border border-[#d9efe6] p-6 shadow-sm text-left hover:shadow-md hover:-translate-y-1 transition"
        >
          <p className="text-sm font-bold text-gray-500">
            Áreas activas
          </p>

          <h2 className="text-3xl font-black text-[#0f5138] mt-2">
            {data.areasActivas}
          </h2>

          <p className="text-sm text-[#189a73] font-semibold mt-1">
            Ver áreas registradas
          </p>
        </button>

        <div className="bg-white rounded-3xl border border-[#d9efe6] p-6 shadow-sm">
          <p className="text-sm font-bold text-gray-500">
            Registros recientes
          </p>

          <h2 className="text-3xl font-black text-[#0f5138] mt-2">
            {data.registrosRecientes.length}
          </h2>

          <p className="text-sm text-[#189a73] font-semibold mt-1">
            Últimas detecciones
          </p>
        </div>
      </section>

      {/* Gráficas juntas */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Gráfica generación por tipo */}
        <div className="bg-white rounded-3xl border border-[#d9efe6] p-6 shadow-sm">
          <h2 className="text-xl font-black text-[#0f5138]">
            Generación por tipo
          </h2>

          <p className="text-sm text-gray-500 mt-1 mb-5">
            Registros por día de la semana.
          </p>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="organico"
                  stroke="#189a73"
                  fill="#189a73"
                  fillOpacity={0.35}
                />

                <Area
                  type="monotone"
                  dataKey="inorganico"
                  stroke="#46c6a0"
                  fill="#46c6a0"
                  fillOpacity={0.35}
                />

                <Area
                  type="monotone"
                  dataKey="pet"
                  stroke="#7ed9b2"
                  fill="#7ed9b2"
                  fillOpacity={0.35}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfica distribución por área */}
        <div className="bg-white rounded-3xl border border-[#d9efe6] p-6 shadow-sm">
          <h2 className="text-xl font-black text-[#0f5138]">
            Distribución por área
          </h2>

          <p className="text-sm text-gray-500 mt-1 mb-5">
            Total de residuos registrados por área.
          </p>

          <div className="h-[320px]">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={105}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Sin datos para mostrar.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Registros recientes */}
      <section className="bg-white rounded-3xl border border-[#d9efe6] p-6 shadow-sm">
        <h2 className="text-xl font-black text-[#0f5138]">
          Registros recientes
        </h2>

        <p className="text-sm text-gray-500 mt-1 mb-5">
          Últimas lecturas detectadas por los sensores.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-[#5f756b] border-b border-[#d9efe6]">
                <th className="py-3">Tipo</th>
                <th className="py-3">Área</th>
                <th className="py-3">Conteo</th>
                <th className="py-3">Fecha</th>
              </tr>
            </thead>

            <tbody>
              {data.registrosRecientes.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[#edf7f3] text-sm text-gray-600"
                >
                  <td className="py-3 font-bold text-[#0f5138] capitalize">
                    {item.tipo}
                  </td>

                  <td className="py-3">
                    {item.area}
                  </td>

                  <td className="py-3">
                    {item.conteo}
                  </td>

                  <td className="py-3">
                    {new Date(item.fecha).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {data.registrosRecientes.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              Todavía no hay registros.
            </div>
          )}
        </div>
      </section>
      {areasModalOpen && (
  <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm flex items-center justify-center px-4">
    <div className="w-full max-w-[720px] bg-white rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.25)] p-7">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-bold text-[#46c6a0] uppercase tracking-[0.18em]">
            Áreas activas
          </p>

          <h2 className="text-2xl font-black text-[#0f5138] mt-1">
            Áreas registradas en la escuela
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setAreasModalOpen(false)}
          className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {loadingAreas ? (
        <p className="text-[#0f5138] font-bold">
          Cargando áreas...
        </p>
      ) : areas.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          No hay áreas registradas.
        </div>
      ) : (
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
          {areas.map((area) => (
            <div
              key={area.id}
              className="border border-[#d9efe6] rounded-2xl p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl text-white flex items-center justify-center"
                  style={{
                    backgroundColor: area.color || '#46c6a0',
                  }}
                >
                  <MapPinned className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-black text-[#0f5138]">
                    {area.nombre}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Responsable: {area.responsable_nombre || 'Sin responsable'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-[#189a73]">
                  {area.containers?.length || 0} contenedores
                </p>

                <p className="text-xs text-gray-400">
                  ID: {area.id}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}
    </div>
  );
}

function formatWeeklyData(
  data: DashboardData['generacionPorTipo'],
) {
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const translatedDays: Record<string, string> = {
    Monday: 'Lun',
    Tuesday: 'Mar',
    Wednesday: 'Mié',
    Thursday: 'Jue',
    Friday: 'Vie',
    Saturday: 'Sáb',
    Sunday: 'Dom',
  };

  return days.map((day) => {
    const rows = data.filter((item) => item.dia === day);

    return {
      dia: translatedDays[day],
      organico: Number(
        rows.find((item) => item.tipo === 'organico')?.total || 0,
      ),
      inorganico: Number(
        rows.find((item) => item.tipo === 'inorganico')?.total || 0,
      ),
      pet: Number(
        rows.find((item) => item.tipo === 'pet')?.total || 0,
      ),
    };
  });
}