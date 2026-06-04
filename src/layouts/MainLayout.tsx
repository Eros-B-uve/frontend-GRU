import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart3, MapPinned, FileText, LogOut, Leaf, Menu, X } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <header className="h-20 bg-white border-b border-[#d9efe6] flex items-center justify-between px-4 sm:px-6 lg:px-10">
  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
    {/* Botón menú móvil */}
    <button
      type="button"
      onClick={() => setMobileMenuOpen(true)}
      className="lg:hidden w-11 h-11 rounded-2xl bg-[#ddfff1] text-[#189a73] flex items-center justify-center flex-shrink-0"
    >
      <Menu className="w-6 h-6" />
    </button>

    {/* Información de escuela */}
    <div className="min-w-0">
      <p className="text-xs sm:text-sm text-[#189a73] font-bold">
        Escuela activa
      </p>

      <h2 className="text-base sm:text-xl lg:text-2xl font-black text-[#0f5138] leading-tight truncate max-w-[170px] sm:max-w-[360px] lg:max-w-none">
        {profile?.school?.nombre || 'Cargando escuela...'}
      </h2>

      <p className="text-xs text-gray-500 mt-1">
        CCT: {profile?.cct || '---'}
      </p>
    </div>
  </div>

  {/* Botón cerrar sesión */}
  <button
    onClick={handleLogout}
    className="h-11 px-3 sm:px-5 rounded-2xl bg-[#fff3f3] text-[#b42318] font-bold flex items-center gap-2 hover:bg-[#ffe5e5] transition flex-shrink-0"
  >
    <LogOut className="w-4 h-4" />

    <span className="hidden sm:inline">
      Cerrar sesión
    </span>

    <span className="sm:hidden">
      Salir
    </span>
  </button>
</header>

        <div className="flex-1 p-6 lg:p-10">
          <Outlet />
        </div>
      </section>
      {mobileMenuOpen && (
  <div className="fixed inset-0 z-50 lg:hidden">
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => setMobileMenuOpen(false)}
    />

    <aside className="relative w-[82%] max-w-[320px] h-full bg-white border-r border-[#d9efe6] px-5 py-6 flex flex-col shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo GIRU"
            className="w-12 h-12 object-contain"
          />

          <div>
            <h1 className="text-2xl font-black text-[#0f5138] leading-none">
              GIRU
            </h1>

            <p className="text-xs text-[#189a73] font-semibold mt-1">
              Gestión de residuos
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-2">
        <MobileSidebarLink
          to="/dashboard"
          icon={<LayoutDashboard className="w-5 h-5" />}
          label="Dashboard"
          onClick={() => setMobileMenuOpen(false)}
        />

        <MobileSidebarLink
          to="/analysis"
          icon={<BarChart3 className="w-5 h-5" />}
          label="Análisis"
          onClick={() => setMobileMenuOpen(false)}
        />

        <MobileSidebarLink
          to="/areas"
          icon={<MapPinned className="w-5 h-5" />}
          label="Áreas"
          onClick={() => setMobileMenuOpen(false)}
        />

        <MobileSidebarLink
          to="/readings"
          icon={<ClipboardList className="w-5 h-5" />}
          label="Lecturas"
          onClick={() => setMobileMenuOpen(false)}
        />

        <MobileSidebarLink
          to="/reports"
          icon={<FileText className="w-5 h-5" />}
          label="Reportes"
          onClick={() => setMobileMenuOpen(false)}
        />
      </nav>

      <div className="mt-auto bg-[#ddfff1] rounded-3xl p-4">
        <div className="w-10 h-10 rounded-2xl bg-[#189a73] text-white flex items-center justify-center mb-3">
          <Leaf className="w-5 h-5" />
        </div>

        <p className="text-sm font-bold text-[#0f5138]">
          Monitoreo activo
        </p>

        <p className="text-xs text-[#5f756b] mt-1">
          Sistema conectado al backend GIRU.
        </p>
      </div>
    </aside>
  </div>
)}
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
function MobileSidebarLink({
  to,
  icon,
  label,
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
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