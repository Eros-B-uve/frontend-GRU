import { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  MapPinned,
  X,
  Save,
} from 'lucide-react';

import api from '../api/axios';

type Container = {
  id: number;
  tipo: string;
  capacidad_max: number;
};

type Area = {
  id: number;
  nombre: string;
  color: string | null;
  responsable_nombre: string | null;
  tiene_contenedores: boolean;
  containers?: Container[];
};

type AreaFormData = {
  nombre: string;
  color: string;
  responsable_nombre: string;
};

const initialForm: AreaFormData = {
  nombre: '',
  color: '#46c6a0',
  responsable_nombre: '',
};

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [formData, setFormData] = useState<AreaFormData>(initialForm);

  const loadAreas = async () => {
    try {
      const response = await api.get('/areas');
      setAreas(response.data);
    } catch (error) {
      console.error('Error al cargar áreas:', error);
      alert('No se pudieron cargar las áreas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAreas();
  }, []);

  const openCreateModal = () => {
    setEditingArea(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (area: Area) => {
    setEditingArea(area);

    setFormData({
      nombre: area.nombre,
      color: area.color || '#46c6a0',
      responsable_nombre: area.responsable_nombre || '',
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingArea(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.nombre.trim()) {
      alert('El nombre del área es obligatorio');
      return;
    }

    try {
      if (editingArea) {
        await api.patch(`/areas/${editingArea.id}`, formData);
        alert('Área actualizada correctamente');
      } else {
        await api.post('/areas', formData);
        alert('Área creada correctamente');
      }

      closeModal();
      await loadAreas();
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'No se pudo guardar el área';

      alert(Array.isArray(message) ? message.join('\n') : message);
    }
  };

  const handleDelete = async (area: Area) => {
    const confirmDelete = confirm(
      `¿Seguro que deseas eliminar el área "${area.nombre}"?`,
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/areas/${area.id}`);
      alert('Área eliminada correctamente');
      await loadAreas();
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'No se pudo eliminar el área';

      alert(Array.isArray(message) ? message.join('\n') : message);
    }
  };

  if (loading) {
    return (
      <div className="text-[#0f5138] font-bold">
        Cargando áreas...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0f5138]">
            Áreas
          </h1>

          <p className="text-gray-500 mt-1">
            Administra las áreas donde se encuentran los contenedores.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="h-12 px-5 rounded-2xl bg-gradient-to-r from-[#189a73] to-[#46c6a0] text-white font-bold flex items-center gap-2 shadow-[0_10px_25px_rgba(24,154,115,0.25)] hover:brightness-105 transition"
        >
          <Plus className="w-5 h-5" />
          Nueva área
        </button>
      </section>

      {areas.length === 0 ? (
        <section className="bg-white border border-[#d9efe6] rounded-3xl p-10 text-center shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-[#ddfff1] text-[#189a73] flex items-center justify-center mx-auto mb-4">
            <MapPinned className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black text-[#0f5138]">
            No hay áreas registradas
          </h2>

          <p className="text-gray-500 mt-2">
            Crea tu primera área para generar automáticamente sus tres contenedores.
          </p>

          <button
            onClick={openCreateModal}
            className="mt-6 h-12 px-5 rounded-2xl bg-[#189a73] text-white font-bold"
          >
            Crear área
          </button>
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {areas.map((area) => (
            <article
              key={area.id}
              className="bg-white border border-[#d9efe6] rounded-3xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                    style={{
                      backgroundColor: area.color || '#46c6a0',
                    }}
                  >
                    <MapPinned className="w-6 h-6" />
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-[#0f5138]">
                      {area.nombre}
                    </h2>

                    <p className="text-sm text-gray-500">
                      ID: {area.id}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(area)}
                    className="w-10 h-10 rounded-xl bg-[#ddfff1] text-[#189a73] flex items-center justify-center hover:bg-[#c8f3e2] transition"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleDelete(area)}
                    className="w-10 h-10 rounded-xl bg-[#fff3f3] text-[#b42318] flex items-center justify-center hover:bg-[#ffe5e5] transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <InfoRow
                  label="Responsable"
                  value={area.responsable_nombre || 'Sin responsable'}
                />

                <InfoRow
                  label="Contenedores"
                  value={`${area.containers?.length || 0} registrados`}
                />

                <InfoRow
                  label="Estado"
                  value={area.tiene_contenedores ? 'Activa' : 'Inactiva'}
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {area.containers?.map((container) => (
                  <span
                    key={container.id}
                    className="px-3 py-1 rounded-full bg-[#f4fff9] border border-[#d9efe6] text-xs font-bold text-[#0f5138] capitalize"
                  >
                    {container.tipo}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm flex items-center justify-center px-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[480px] bg-white rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.25)] p-8"
          >
            <div className="flex items-start justify-between gap-4 mb-7">
              <div>
                <p className="text-sm font-bold text-[#46c6a0] uppercase tracking-[0.18em]">
                  {editingArea ? 'Editar área' : 'Nueva área'}
                </p>

                <h2 className="text-2xl font-black text-[#0f5138] mt-1">
                  {editingArea ? 'Actualizar información' : 'Registrar área'}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#0f5138] mb-2">
                  Nombre del área
                </label>

                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nombre: e.target.value,
                    })
                  }
                  placeholder="Ej. Biblioteca"
                  className="w-full h-12 rounded-2xl bg-[#f7fffb] border border-[#cdeee1] px-4 outline-none focus:border-[#46c6a0] focus:ring-4 focus:ring-[#46c6a0]/15"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0f5138] mb-2">
                  Responsable
                </label>

                <input
                  type="text"
                  value={formData.responsable_nombre}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      responsable_nombre: e.target.value,
                    })
                  }
                  placeholder="Ej. Juan Pérez"
                  className="w-full h-12 rounded-2xl bg-[#f7fffb] border border-[#cdeee1] px-4 outline-none focus:border-[#46c6a0] focus:ring-4 focus:ring-[#46c6a0]/15"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0f5138] mb-2">
                  Color identificador
                </label>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        color: e.target.value,
                      })
                    }
                    className="w-14 h-12 rounded-xl border border-[#cdeee1] bg-white"
                  />

                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        color: e.target.value,
                      })
                    }
                    className="flex-1 h-12 rounded-2xl bg-[#f7fffb] border border-[#cdeee1] px-4 outline-none focus:border-[#46c6a0] focus:ring-4 focus:ring-[#46c6a0]/15"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-14 mt-8 rounded-2xl bg-gradient-to-r from-[#189a73] to-[#46c6a0] text-white font-bold flex items-center justify-center gap-2 shadow-[0_12px_25px_rgba(24,154,115,0.30)] hover:brightness-105 transition"
            >
              <Save className="w-5 h-5" />
              {editingArea ? 'Guardar cambios' : 'Crear área'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-gray-500">
        {label}
      </span>

      <span className="font-bold text-[#0f5138] text-right">
        {value}
      </span>
    </div>
  );
}