import { useState } from 'react';

import {
  CalendarDays,
  Download,
  FileText,
  Search,
  Recycle,
  MapPinned,
  ListChecks,
} from 'lucide-react';

import api from '../api/axios';

type ReportData = {
  periodo: {
    inicio: string;
    fin: string;
  };
  totalResiduos: number;
  porTipo: {
    tipo: string;
    total: number;
  }[];
  porArea: {
    area: string;
    color: string | null;
    total: number;
  }[];
  registros: {
    id: number;
    tipo: string;
    area: string;
    conteo: number;
    fecha: string;
  }[];
};

export default function ReportsPage() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const handleGenerateReport = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!start || !end) {
      alert('Selecciona fecha de inicio y fecha final');
      return;
    }

    if (start > end) {
      alert('La fecha de inicio no puede ser mayor que la fecha final');
      return;
    }

    setLoading(true);

    try {
      const response = await api.get('/reports', {
        params: {
          start,
          end,
        },
      });

      setReport(response.data);
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'No se pudo generar el reporte';

      alert(Array.isArray(message) ? message.join('\n') : message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!start || !end) {
      alert('Primero selecciona un periodo');
      return;
    }

    setDownloadingPdf(true);

    try {
      const response = await api.get('/reports/pdf', {
        params: {
          start,
          end,
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/pdf',
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-giru-${start}-${end}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error al descargar PDF:', error);
      alert('No se pudo descargar el PDF');
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-black text-[#0f5138]">
          Reportes
        </h1>

        <p className="text-gray-500 mt-1">
          Genera reportes por periodo y descarga el resumen en formato PDF.
        </p>
      </section>

      {/* Filtros */}
      <section className="bg-white rounded-3xl border border-[#d9efe6] p-6 shadow-sm">
        <form
          onSubmit={handleGenerateReport}
          className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto_auto] gap-4 items-end"
        >
          <DateInput
            label="Fecha inicial"
            value={start}
            onChange={setStart}
          />

          <DateInput
            label="Fecha final"
            value={end}
            onChange={setEnd}
          />

          <button
            type="submit"
            disabled={loading}
            className="h-12 px-5 rounded-2xl bg-gradient-to-r from-[#189a73] to-[#46c6a0] text-white font-bold flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(24,154,115,0.25)] hover:brightness-105 transition disabled:opacity-60"
          >
            <Search className="w-5 h-5" />
            {loading ? 'Generando...' : 'Consultar'}
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloadingPdf || !start || !end}
            className="h-12 px-5 rounded-2xl bg-[#0f5138] text-white font-bold flex items-center justify-center gap-2 hover:brightness-110 transition disabled:opacity-60"
          >
            <Download className="w-5 h-5" />
            {downloadingPdf ? 'Descargando...' : 'PDF'}
          </button>
        </form>
      </section>

      {!report ? (
        <section className="bg-white rounded-3xl border border-[#d9efe6] p-10 shadow-sm text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#ddfff1] text-[#189a73] flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black text-[#0f5138]">
            Sin reporte generado
          </h2>

          <p className="text-gray-500 mt-2">
            Selecciona un periodo para consultar los datos registrados.
          </p>
        </section>
      ) : (
        <>
          {/* Cards resumen */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatCard
              title="Total de residuos"
              value={report.totalResiduos.toString()}
              subtitle={`Periodo: ${report.periodo.inicio} al ${report.periodo.fin}`}
              icon={<Recycle className="w-6 h-6" />}
            />

            <StatCard
              title="Tipos registrados"
              value={report.porTipo.length.toString()}
              subtitle="Clasificaciones con lecturas"
              icon={<ListChecks className="w-6 h-6" />}
            />

            <StatCard
              title="Áreas con registros"
              value={report.porArea.length.toString()}
              subtitle="Áreas activas en el periodo"
              icon={<MapPinned className="w-6 h-6" />}
            />
          </section>

          {/* Resúmenes */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-[#d9efe6] p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#0f5138]">
                Resumen por tipo
              </h2>

              <p className="text-sm text-gray-500 mt-1 mb-5">
                Total de residuos agrupados por clasificación.
              </p>

              {report.porTipo.length > 0 ? (
                <div className="space-y-3">
                  {report.porTipo.map((item) => (
                    <SummaryRow
                      key={item.tipo}
                      label={item.tipo}
                      value={item.total}
                      color={getTypeColor(item.tipo)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyMessage text="No hay datos por tipo en este periodo." />
              )}
            </div>

            <div className="bg-white rounded-3xl border border-[#d9efe6] p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#0f5138]">
                Resumen por área
              </h2>

              <p className="text-sm text-gray-500 mt-1 mb-5">
                Total de residuos registrados en cada área.
              </p>

              {report.porArea.length > 0 ? (
                <div className="space-y-3">
                  {report.porArea.map((item) => (
                    <SummaryRow
                      key={item.area}
                      label={item.area}
                      value={item.total}
                      color={item.color || '#46c6a0'}
                    />
                  ))}
                </div>
              ) : (
                <EmptyMessage text="No hay datos por área en este periodo." />
              )}
            </div>
          </section>

          {/* Tabla registros */}
          <section className="bg-white rounded-3xl border border-[#d9efe6] p-6 shadow-sm">
            <h2 className="text-xl font-black text-[#0f5138]">
              Registros del periodo
            </h2>

            <p className="text-sm text-gray-500 mt-1 mb-5">
              Lecturas registradas entre las fechas seleccionadas.
            </p>

            {report.registros.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-sm text-[#5f756b] border-b border-[#d9efe6]">
                      <th className="py-3">ID</th>
                      <th className="py-3">Tipo</th>
                      <th className="py-3">Área</th>
                      <th className="py-3">Conteo</th>
                      <th className="py-3">Fecha</th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.registros.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-[#edf7f3] text-sm text-gray-600"
                      >
                        <td className="py-3 font-bold text-[#0f5138]">
                          #{item.id}
                        </td>

                        <td className="py-3 capitalize">
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
              </div>
            ) : (
              <EmptyMessage text="No hay registros en este periodo." />
            )}
          </section>
        </>
      )}
    </div>
  );
}

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-[#0f5138] mb-2">
        {label}
      </label>

      <div className="h-12 bg-[#f7fffb] border border-[#cdeee1] rounded-2xl flex items-center px-4 focus-within:border-[#46c6a0] focus-within:ring-4 focus-within:ring-[#46c6a0]/15 transition">
        <CalendarDays className="w-5 h-5 text-[#46c6a0] mr-3" />

        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none text-gray-700 text-sm"
        />
      </div>
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

function SummaryRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#edf7f3] p-4">
      <div className="flex items-center gap-3">
        <span
          className="w-4 h-4 rounded-full"
          style={{
            backgroundColor: color,
          }}
        />

        <span className="font-bold text-[#0f5138] capitalize">
          {label}
        </span>
      </div>

      <span className="text-lg font-black text-[#189a73]">
        {value}
      </span>
    </div>
  );
}

function EmptyMessage({
  text,
}: {
  text: string;
}) {
  return (
    <div className="text-center text-gray-400 py-8">
      {text}
    </div>
  );
}

function getTypeColor(tipo: string) {
  const colors: Record<string, string> = {
    organico: '#189a73',
    inorganico: '#46c6a0',
    pet: '#7ed9b2',
  };

  return colors[tipo] || '#46c6a0';
}