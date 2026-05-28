import { useEffect, useState } from 'react';

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import {
  BarChart3,
  MapPinned,
  PieChart as PieChartIcon,
  TrendingUp,
  Recycle,
} from 'lucide-react';

import api from '../api/axios';

type SummaryData = {
  totalResiduos: number;
  areasActivas: number;
};

type ByAreaData = {
  areaId: number;
  area: string;
  color: string | null;
  total: number;
};

type ByTypeData = {
  tipo: string;
  total: number;
};

type TrendData = {
  anio: number;
  mes: number;
  total: number;
};

type ActiveChart = 'area' | 'type' | 'trend';

const TYPE_COLORS: Record<string, string> = {
  organico: '#189a73',
  inorganico: '#46c6a0',
  pet: '#7ed9b2',
};

export default function AnalysisPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [byArea, setByArea] = useState<ByAreaData[]>([]);
  const [byType, setByType] = useState<ByTypeData[]>([]);
  const [trend, setTrend] = useState<TrendData[]>([]);
  const [activeChart, setActiveChart] = useState<ActiveChart>('area');
  const [loading, setLoading] = useState(true);

  const loadAnalysis = async () => {
    try {
      const [summaryRes, areaRes, typeRes, trendRes] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/analytics/by-area'),
        api.get('/analytics/by-type'),
        api.get('/analytics/trend'),
      ]);

      setSummary(summaryRes.data);
      setByArea(areaRes.data);
      setByType(typeRes.data);
      setTrend(trendRes.data);
    } catch (error) {
      console.error('Error al cargar análisis:', error);
      alert('No se pudo cargar la información de análisis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="text-[#0f5138] font-bold">
        Cargando análisis...
      </div>
    );
  }

  const trendData = trend.map((item) => ({
    periodo: `${getMonthName(item.mes)} ${item.anio}`,
    total: item.total,
  }));

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-black text-[#0f5138]">
          Análisis
        </h1>

        <p className="text-gray-500 mt-1">
          Consulta el comportamiento de los residuos registrados por área, tipo y tendencia.
        </p>
      </section>

      {/* Cards superiores */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <StatCard
          title="Total de residuos registrados"
          value={summary?.totalResiduos?.toString() || '0'}
          subtitle="Suma total de lecturas"
          icon={<Recycle className="w-6 h-6" />}
        />

        <StatCard
          title="Áreas activas"
          value={summary?.areasActivas?.toString() || '0'}
          subtitle="Áreas registradas en el sistema"
          icon={<MapPinned className="w-6 h-6" />}
        />
      </section>

      {/* Selector de gráfica */}
      <section className="bg-white rounded-3xl border border-[#d9efe6] p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ChartButton
            active={activeChart === 'area'}
            icon={<BarChart3 className="w-5 h-5" />}
            label="Por área"
            onClick={() => setActiveChart('area')}
          />

          <ChartButton
            active={activeChart === 'type'}
            icon={<PieChartIcon className="w-5 h-5" />}
            label="Por tipo"
            onClick={() => setActiveChart('type')}
          />

          <ChartButton
            active={activeChart === 'trend'}
            icon={<TrendingUp className="w-5 h-5" />}
            label="Tendencia"
            onClick={() => setActiveChart('trend')}
          />
        </div>
      </section>

      {/* Gráfica dinámica */}
      <section className="bg-white rounded-3xl border border-[#d9efe6] p-6 shadow-sm">
        {activeChart === 'area' && (
          <>
            <ChartHeader
              title="Residuos por área"
              description="Total de residuos registrados en cada área."
            />

            <div className="h-[380px]">
              {byArea.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byArea}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="area" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="total"
                      radius={[10, 10, 0, 0]}
                    >
                      {byArea.map((item, index) => (
                        <Cell
                          key={`area-cell-${index}`}
                          fill={item.color || '#46c6a0'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart />
              )}
            </div>
          </>
        )}

        {activeChart === 'type' && (
          <>
            <ChartHeader
              title="Residuos por tipo"
              description="Distribución total entre orgánico, inorgánico y PET."
            />

            <div className="h-[380px]">
              {byType.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={byType}
                      dataKey="total"
                      nameKey="tipo"
                      outerRadius={130}
                      label
                    >
                      {byType.map((item, index) => (
                        <Cell
                          key={`type-cell-${index}`}
                          fill={TYPE_COLORS[item.tipo] || '#46c6a0'}
                        />
                      ))}
                    </Pie>

                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart />
              )}
            </div>
          </>
        )}

        {activeChart === 'trend' && (
          <>
            <ChartHeader
              title="Tendencia mensual"
              description="Comparativa de residuos registrados a lo largo de los meses."
            />

            <div className="h-[380px]">
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="periodo" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total"
                      name="Total de residuos"
                      stroke="#189a73"
                      strokeWidth={4}
                      dot={{
                        r: 5,
                        fill: '#46c6a0',
                      }}
                      activeDot={{
                        r: 7,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart />
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-3xl border border-[#d9efe6] p-6 shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-[#189a73] text-white flex items-center justify-center mb-5">
        {icon}
      </div>

      <p className="text-sm font-bold text-gray-500">
        {title}
      </p>

      <h2 className="text-3xl font-black text-[#0f5138] mt-2">
        {value}
      </h2>

      <p className="text-sm text-[#189a73] font-semibold mt-1">
        {subtitle}
      </p>
    </div>
  );
}

function ChartButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        h-12 px-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition
        ${
          active
            ? 'bg-[#189a73] text-white shadow-[0_10px_25px_rgba(24,154,115,0.25)]'
            : 'bg-[#f4fff9] text-[#5f756b] hover:bg-[#ddfff1] hover:text-[#0f5138]'
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

function ChartHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-black text-[#0f5138]">
        {title}
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        {description}
      </p>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      Sin datos para mostrar.
    </div>
  );
}

function getMonthName(month: number) {
  const months: Record<number, string> = {
    1: 'Ene',
    2: 'Feb',
    3: 'Mar',
    4: 'Abr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Ago',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dic',
  };

  return months[month] || `Mes ${month}`;
}