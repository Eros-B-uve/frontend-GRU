import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Leaf, ArrowLeft } from 'lucide-react';

import api from '../api/axios';
import logo from '../assets/logo.png';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.trim()) {
      alert('Ingresa tu correo electrónico');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', {
        email,
      });

      alert(response.data.message || 'Revisa tu correo electrónico');
      navigate('/login');
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'No se pudo enviar el correo';

      alert(Array.isArray(message) ? message.join('\n') : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#ddfff1] via-[#c8f3e2] to-[#f4fff9] relative">
      <div className="absolute w-[520px] h-[520px] bg-[#46c6a0]/25 rounded-full blur-3xl -top-40 -left-32" />
      <div className="absolute w-[620px] h-[620px] bg-[#189a73]/20 rounded-full blur-3xl -bottom-56 -right-44" />

      <section className="relative z-10 min-h-screen w-full flex items-center justify-center px-6 py-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[450px] bg-white/90 backdrop-blur-md border border-white/70 rounded-[32px] shadow-[0_24px_70px_rgba(15,81,56,0.20)] px-8 sm:px-10 py-10 sm:py-12"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <img
              src={logo}
              alt="Logo GIRU"
              className="w-28 h-28 object-contain mb-4"
            />

            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#ddfff1] mb-4">
              <Leaf className="w-7 h-7 text-[#189a73]" />
            </div>

            <p className="text-sm font-semibold text-[#46c6a0] uppercase tracking-[0.22em]">
              Recuperación
            </p>

            <h1 className="text-3xl font-black text-[#0f5138] mt-2">
              Olvidé mi contraseña
            </h1>

            <p className="text-sm text-gray-500 mt-3 max-w-[330px]">
              Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.
            </p>
          </div>

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

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 mt-8 rounded-2xl bg-gradient-to-r from-[#189a73] to-[#46c6a0] text-white text-lg font-bold shadow-[0_12px_25px_rgba(24,154,115,0.30)] hover:brightness-105 active:scale-[0.99] transition disabled:opacity-60"
          >
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full mt-5 text-sm font-bold text-[#189a73] hover:underline flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio de sesión
          </button>
        </form>
      </section>
    </main>
  );
}