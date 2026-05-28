import { useEffect, useState } from 'react';

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCcw,
  Search,
} from 'lucide-react';

import api from '../api/axios';

type ReadingItem = {
  id: number;
  tipo: string;
  areaId: number;
  area: string;
  conteo: number;
  fecha: string;
};

type HistoryResponse = {
  data: ReadingItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export default function ReadingsPage() {
  const [readings, setReadings] = useState<ReadingItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [type, setType] = useState('');

  const [loading, setLoading] = useState(true);

  const loadReadings = async (selectedPage = page) => {
    setLoading(true);

    try {
      const response = await api.get<HistoryResponse>('/readings/history', {
        params: {
          page: selectedPage,
          limit,
          start: start || undefined,
          end: end || undefined,
          type: type || undefined,
        },
      });

      setReadings(response.data.data);
      setTotal(response.data.total);
      setTotalPages(response.data.totalPages || 1);
      setPage(response.data.page);
    } catch (error) {
      console.error('Error al cargar lecturas:', error);
      alert('No se pudieron cargar las lecturas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReadings(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    if (start && end && start > end) {
      alert('La fecha inicial no puede ser mayor que la fecha final');
      return;
    }

    loadReadings(1);
  };

  const clearFilters = () => {
    setStart('');
    setEnd('');
    setType('');

    setTimeout(() => {
      loadReadings(1);
    }, 0);
  };

  const nextPage = () => {
    if (page < totalPages) {
      loadReadings(page + 1);
    }
  };

  const previousPage = () => {
    if (page > 1) {
      loadReadings(page - 1);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-black text-[#0f5138]">
          Historial de lecturas
        </h1>

        <p className="text-gray-500 mt-1">
          Consulta todas las lecturas registradas por los sensores.
        </p>
      </section>

      <section className="bg-white rounded-3xl border border-[#d9efe6] p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-[#ddfff1] text-[#189a73] flex items-center justify-center">
            <Filter className="w-5 h-5" />
          </div>

          <div>
            <h2 className="text-xl font-black text-[#0f5138]">
              Filtros
            </h2>

            <p className="text-sm text-gray-500">
              Puedes buscar por fecha y tipo de residuo.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto_auto] gap-4 items-end"
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

          <div>
            <label className="block text-sm font-bold text-[#0f5138] mb-2">
              Tipo de residuo
            </label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full h-12 rounded-2xl bg-[#f7fffb] border border-[#cdeee1] px-4 outline-none focus:border-[#46c6a0] focus:ring-4 focus:ring-[#46c6a0]/15 text-sm text-gray-700"
            >
              <option value="">Todos</option>
              <option value="organico">Orgánico</option>
              <option value="inorganico">Inorgánico</option>
              <option value="pet">PET</option>
            </select>
          </div>

          <button
            type="submit"
            className="h-12 px-5 rounded-2xl bg-gradient-to-r from-[#189a73] to-[#46c6a0] text-white font-bold flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(24,154,115,0.25)] hover:brightness-105 transition"
          >
            <Search className="w-5 h-5" />
            Buscar
          </button>

          <button
            type="button"
            onClick={clearFilters}
            className="h-12 px-5 rounded-2xl bg-[#f4fff9] text-[#189a73] font-bold flex items-center justify-center gap-2 hover:bg-[#ddfff1] transition"
          >
            <RefreshCcw className="w-5 h-5" />
            Limpiar
          </button>
        </form>
      </section>

      <section className="bg-white rounded-3xl border border-[#d9efe6] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl font-black text-[#0f5138]">
              Lecturas registradas
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Total encontrado: {total}
            </p>
          </div>

          <button
            onClick={() => loadReadings(page)}
            className="h-11 px-4 rounded-2xl bg-[#ddfff1] text-[#189a73] font-bold flex items-center gap-2 hover:bg-[#c8f3e2] transition"
          >
            <RefreshCcw className="w-4 h-4" />
            Actualizar
          </button>
        </div>

        {loading ? (
          <div className="text-[#0f5138] font-bold py-8">
            Cargando lecturas...
          </div>
        ) : readings.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No hay lecturas registradas con esos filtros.
          </div>
        ) : (
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
                {readings.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#edf7f3] text-sm text-gray-600"
                  >
                    <td className="py-3 font-bold text-[#0f5138]">
                      #{item.id}
                    </td>

                    <td className="py-3">
                      <span className="px-3 py-1 rounded-full bg-[#f4fff9] border border-[#d9efe6] font-bold text-[#0f5138] capitalize">
                        {item.tipo}
                      </span>
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
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
          <p className="text-sm text-gray-500">
            Página {page} de {totalPages}
          </p>

          <div className="flex gap-3">
            <button
              onClick={previousPage}
              disabled={page <= 1}
              className="h-11 px-4 rounded-2xl bg-[#f4fff9] text-[#189a73] font-bold flex items-center gap-2 disabled:opacity-40 hover:bg-[#ddfff1] transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>

            <button
              onClick={nextPage}
              disabled={page >= totalPages}
              className="h-11 px-4 rounded-2xl bg-[#189a73] text-white font-bold flex items-center gap-2 disabled:opacity-40 hover:brightness-105 transition"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
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