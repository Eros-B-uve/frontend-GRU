import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart3, MapPinned, FileText, LogOut, Leaf } from 'lucide-react';
import {useEffect, useState} from 'react';

import logo from '../assets/logo.png';
import { ClipboardList } from 'lucide-react';

import api from '../api/axios';
type Profile = {
  id: number;
  email: string;
  cct: string;
  school: {
    cct: string;
    nombre: string;
  };
};
export default function MainLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => {
  const loadProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    }
  };

  loadProfile();
}, []);

  return (
    <main className="min-h-screen w-full bg-[#f4fff9] flex">
      <aside className="hidden lg:flex w-[280px] min-h-screen bg-white border-r border-[#d9efe6] flex-col px-5 py-6">
        <div className="flex items-center gap-3 mb-10">
          <img
            src={logo}
            alt="Logo GIRU"
            className="w-14 h-14 object-contain"
          />

          <div>
            <h1 className="text-2xl font-black text-[#0f5138] leading-none">
              GRU
            </h1>
            <p className="text-xs text-[#189a73] font-semibold mt-1">
              Gestión de Residuos Urbanos
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <SidebarLink
            to="/dashboard"
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Dashboard"
          />

          <SidebarLink
            to="/analysis"
            icon={<BarChart3 className="w-5 h-5" />}
            label="Análisis"
          />

          <SidebarLink
            to="/areas"
            icon={<MapPinned className="w-5 h-5" />}
            label="Áreas"
          />

          <SidebarLink
            to="/readings"
            icon={<ClipboardList className="w-5 h-5" />}
            label="Lecturas"
          />

          <SidebarLink
            to="/reports"
            icon={<FileText className="w-5 h-5" />}
            label="Reportes"
          />
        </nav>

        <div className="mt-auto">
          <div className="bg-[#ddfff1] rounded-3xl p-4 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#189a73] text-white flex items-center justify-center mb-3">
              <Leaf className="w-5 h-5" />
            </div>

            <p className="text-sm font-bold text-[#0f5138]">
              Monitoreo activo
            </p>

            <p className="text-xs text-[#5f756b] mt-1">
              Sistema conectado.
            </p>
          </div>
        </div>
      </aside>

      <section className="flex-1 min-h-screen flex flex-col">
        <header className="h-20 bg-white border-b border-[#d9efe6] flex items-center justify-between px-6 lg:px-10">
          <div>
            <h2 className="text-2xl font-black text-[#0f5138]">
              {profile?.school?.nombre || 'Cargando escuela...'}
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              CCT: {profile?.cct || '---'}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="h-11 px-5 rounded-2xl bg-[#fff3f3] text-[#b42318] font-bold flex items-center gap-2 hover:bg-[#ffe5e5] transition"
          >
          <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </header>

        <div className="flex-1 p-6 lg:p-10">
          <Outlet />
        </div>
      </section>
    </main>
  );
}

function SidebarLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        h-12 px-4 rounded-2xl flex items-center gap-3 font-bold transition
        ${
          isActive
            ? 'bg-[#189a73] text-white shadow-[0_10px_25px_rgba(24,154,115,0.25)]'
            : 'text-[#5f756b] hover:bg-[#ddfff1] hover:text-[#0f5138]'
        }
        `
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}