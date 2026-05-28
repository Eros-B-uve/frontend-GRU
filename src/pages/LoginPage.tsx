import { useState } from 'react';
import { Mail, LockKeyhole, Leaf, BarChart3, FileText, Recycle } from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import api from '../api/axios';
import logo from '../assets/logo.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);

      navigate('/dashboard');
    } catch (error) {
      alert('Correo o contraseña incorrectos, o cuenta sin confirmar');
    }
  };

  return (
    <main className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#ddfff1] via-[#c8f3e2] to-[#f4fff9] relative">
      {/* Formas decorativas */}
      <div className="absolute w-[520px] h-[520px] bg-[#46c6a0]/25 rounded-full blur-3xl -top-40 -left-32" />
      <div className="absolute w-[620px] h-[620px] bg-[#189a73]/20 rounded-full blur-3xl -bottom-56 -right-44" />
      <div className="absolute w-[320px] h-[320px] bg-[#7ed9b2]/30 rounded-full blur-3xl top-[42%] left-[42%]" />

      {/* Contenido principal */}
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
              Monitoreo inteligente de residuos escolares
            </h2>

            <p className="mt-6 text-lg text-[#4b6359] max-w-[560px] leading-relaxed">
              Administra áreas, registra residuos mediante sensores y genera reportes
              para mejorar la gestión sostenible dentro de instituciones educativas.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 max-w-[600px]">
              <FeatureCard
                icon={<Recycle className="w-6 h-6" />}
                title="Registro por tipo"
                text="Orgánico, inorgánico y PET."
              />

              <FeatureCard
                icon={<BarChart3 className="w-6 h-6" />}
                title="Análisis visual"
                text="Dashboard con gráficas dinámicas."
              />

              <FeatureCard
                icon={<FileText className="w-6 h-6" />}
                title="Reportes PDF"
                text="Información filtrada por periodo."
              />

              <FeatureCard
                icon={<Leaf className="w-6 h-6" />}
                title="Enfoque sostenible"
                text="Apoya la gestión ambiental escolar."
              />
            </div>
          </div>

          {/* Panel derecho */}
          <div className="flex justify-center lg:justify-end">
            <form
              onSubmit={handleLogin}
              className="
                w-full
                max-w-[440px]
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
                  <Leaf className="w-7 h-7 text-[#189a73]" />
                </div>

                <p className="text-sm font-semibold text-[#46c6a0] uppercase tracking-[0.22em]">
                  Bienvenido
                </p>

                <h2 className="text-3xl font-black text-[#0f5138] mt-2">
                  Iniciar sesión
                </h2>

                <p className="text-sm text-gray-500 mt-3 max-w-[310px]">
                  Accede a tu panel para consultar el monitoreo de residuos de tu institución.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-[#0f5138] mb-2">
                    Correo electrónico
                  </label>

                  <div className="h-13 bg-[#f7fffb] border border-[#cdeee1] rounded-2xl flex items-center px-4 focus-within:border-[#46c6a0] focus-within:ring-4 focus-within:ring-[#46c6a0]/15 transition">
                    <Mail className="w-5 h-5 text-[#46c6a0] mr-3" />

                    <input
                      type="email"
                      placeholder="tu_correo@dominio.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0f5138] mb-2">
                    Contraseña
                  </label>

                  <div className="h-13 bg-[#f7fffb] border border-[#cdeee1] rounded-2xl flex items-center px-4 focus-within:border-[#46c6a0] focus-within:ring-4 focus-within:ring-[#46c6a0]/15 transition">
                    <LockKeyhole className="w-5 h-5 text-[#46c6a0] mr-3" />

                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-3">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-[#189a73] hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
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
                Iniciar sesión
              </button>

              <div className="mt-7 text-center text-sm text-gray-500">
                <p>¿No tienes cuenta?</p>

                <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="font-bold text-[#189a73] hover:underline mt-1">
                    Regístrate
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
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