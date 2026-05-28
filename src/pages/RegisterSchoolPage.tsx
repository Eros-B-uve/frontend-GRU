import { useState } from 'react';
import {
  School,
  Building2,
  Hash,
  Recycle,
  BarChart3,
  FileText,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import api from '../api/axios';
import logo from '../assets/logo.png';

export default function RegisterSchoolPage() {
  const [nombre, setNombre] = useState('');
  const [cct, setCct] = useState('');
  const navigate = useNavigate();

  const handleRegisterSchool = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await api.post('/schools', {
        nombre,
        cct,
      });

      alert('Escuela registrada correctamente');
         navigate('/register');
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'No se pudo registrar la escuela';

      alert(Array.isArray(message) ? message.join('\n') : message);
    }
  };

  return (
    <main className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#ddfff1] via-[#c8f3e2] to-[#f4fff9] relative">
      <div className="absolute w-[520px] h-[520px] bg-[#46c6a0]/25 rounded-full blur-3xl -top-40 -left-32" />
      <div className="absolute w-[620px] h-[620px] bg-[#189a73]/20 rounded-full blur-3xl -bottom-56 -right-44" />
      <div className="absolute w-[320px] h-[320px] bg-[#7ed9b2]/30 rounded-full blur-3xl top-[42%] left-[42%]" />

      <section className="relative z-10 min-h-screen w-full flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-[1180px] grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Panel izquierdo */}
          <div className="hidden lg:flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-10">
              <img
                src={logo}
                alt="Logo GIRU"
                className="w-24 h-24 object-contain"
              />

              <div>
                <h1 className="text-5xl font-black text-[#0f5138] leading-none">
                  GRU
                </h1>
                <p className="text-[#189a73] font-semibold mt-2">
                  Gestión de Residuos Urbanos
                </p>
              </div>
            </div>

            <h2 className="text-5xl xl:text-6xl font-black text-[#0f5138] leading-tight max-w-[620px]">
              Registra una institución educativa
            </h2>

            <p className="mt-6 text-lg text-[#4b6359] max-w-[560px] leading-relaxed">
              Da de alta una escuela mediante su nombre oficial y su Clave de Centro
              de Trabajo para vincular usuarios, áreas, sensores y reportes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 max-w-[600px]">
              <FeatureCard
                icon={<School className="w-6 h-6" />}
                title="Identificación por CCT"
                text="Relación directa entre escuela y usuario."
              />

              <FeatureCard
                icon={<Recycle className="w-6 h-6" />}
                title="Gestión por escuela"
                text="Cada institución maneja sus propias áreas."
              />

              <FeatureCard
                icon={<BarChart3 className="w-6 h-6" />}
                title="Datos separados"
                text="Los análisis se filtran por institución."
              />

              <FeatureCard
                icon={<FileText className="w-6 h-6" />}
                title="Reportes institucionales"
                text="Información generada por periodo."
              />
            </div>
          </div>

          {/* Formulario */}
          <div className="flex justify-center lg:justify-end">
            <form
              onSubmit={handleRegisterSchool}
              className="
                w-full
                max-w-[460px]
                bg-white/90
                backdrop-blur-md
                border border-white/70
                rounded-[32px]
                shadow-[0_24px_70px_rgba(15,81,56,0.20)]
                px-8 sm:px-10
                py-10 sm:py-12
              "
            >
              <div className="flex flex-col items-center text-center mb-8">
                <img
                  src={logo}
                  alt="Logo GIRU"
                  className="w-28 h-28 object-contain mb-4 lg:hidden"
                />

                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#ddfff1] mb-4">
                  <Building2 className="w-7 h-7 text-[#189a73]" />
                </div>

                <p className="text-sm font-semibold text-[#46c6a0] uppercase tracking-[0.22em]">
                  Nueva escuela
                </p>

                <h2 className="text-3xl font-black text-[#0f5138] mt-2">
                  Registro de escuela
                </h2>

                <p className="text-sm text-gray-500 mt-3 max-w-[330px]">
                  Ingresa el nombre de la institución y su código CCT oficial.
                </p>
              </div>

              <div className="space-y-5">
                <InputField
                  label="Nombre de la escuela"
                  type="text"
                  placeholder="Ej. Instituto Tecnológico Superior de El Mante"
                  value={nombre}
                  onChange={setNombre}
                  icon={<School className="w-5 h-5 text-[#46c6a0] mr-3" />}
                />

                <InputField
                  label="Código CCT"
                  type="text"
                  placeholder="Ej. 28DCT0001A"
                  value={cct}
                  onChange={(value) => setCct(value.toUpperCase())}
                  icon={<Hash className="w-5 h-5 text-[#46c6a0] mr-3" />}
                />
              </div>

              <button
                type="submit"
                className="
                  w-full
                  h-14
                  mt-8
                  rounded-2xl
                  bg-gradient-to-r
                  from-[#189a73]
                  to-[#46c6a0]
                  text-white
                  text-lg
                  font-bold
                  shadow-[0_12px_25px_rgba(24,154,115,0.30)]
                  hover:brightness-105
                  active:scale-[0.99]
                  transition
                "
              >
                Registrar escuela
              </button>

              <div className="mt-7 text-center text-sm text-gray-500">
                <p>¿La escuela ya está registrada?</p>

                <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="font-bold text-[#189a73] hover:underline mt-1">
                        Crear usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function InputField({
  label,
  type,
  placeholder,
  value,
  onChange,
  icon,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-[#0f5138] mb-2">
        {label}
      </label>

      <div className="h-13 bg-[#f7fffb] border border-[#cdeee1] rounded-2xl flex items-center px-4 focus-within:border-[#46c6a0] focus-within:ring-4 focus-within:ring-[#46c6a0]/15 transition">
        {icon}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
        />
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white/55 backdrop-blur-md border border-white/70 rounded-3xl p-5 shadow-[0_12px_35px_rgba(15,81,56,0.10)]">
      <div className="w-12 h-12 rounded-2xl bg-[#189a73] text-white flex items-center justify-center mb-4">
        {icon}
      </div>

      <h3 className="font-black text-[#0f5138]">
        {title}
      </h3>

      <p className="text-sm text-[#5f756b] mt-1">
        {text}
      </p>
    </div>
  );
}