import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { isSupabaseConfigured } from '../lib/supabase';
import logoImg from '../assets/logo.png';
import { IoLockClosedOutline, IoMailOutline, IoAlertCircle, IoArrowBack } from 'react-icons/io5';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // If already authenticated admin, redirect straight to dashboard
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: loginError } = await login(email, password);
      if (loginError) {
        setError(loginError.message || 'Invalid email or password.');
      } else {
        navigate('/admin', { replace: true });
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('admin@zahracatering.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative selection:bg-[#D4AF37] selection:text-black">
      {/* Back to Home Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 text-xs text-neutral-400 hover:text-[#D4AF37] inline-flex items-center gap-1.5 transition-colors"
      >
        <IoArrowBack />
        <span>Return to Storefront</span>
      </Link>

      <div className="w-full max-w-md space-y-8 bg-[#161616] p-8 sm:p-10 rounded-3xl border border-[#D4AF37]/30 shadow-2xl relative">
        {/* Logo and Brand Header */}
        <div className="text-center">
          <img
            src={logoImg}
            alt="ZAHRA Catering Service"
            className="w-16 h-16 mx-auto rounded-full object-cover ring-2 ring-[#D4AF37] mb-3"
          />
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
            Private Admin Portal
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            ZAHRA Catering Service Management
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <IoAlertCircle className="text-base shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!isSupabaseConfigured && (
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-600/40 text-amber-200 text-xs space-y-1">
            <p className="font-semibold">Development Demo Mode</p>
            <p className="text-[11px] text-amber-300/80">
              Supabase credentials not yet supplied in `.env`. You can click below to test with demo admin credentials.
            </p>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="mt-1 text-[11px] font-bold text-[#D4AF37] underline hover:text-[#FFF3B0]"
            >
              Fill Demo Admin Credentials
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <IoMailOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-base" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@zahracatering.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0D0D0D] border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <IoLockClosedOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-base" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0D0D0D] border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={loading}
          >
            Sign In to Dashboard
          </Button>
        </form>

        <p className="text-center text-[11px] text-neutral-500 pt-2">
          Authorized personnel only. Public visitors do not require accounts.
        </p>
      </div>
    </div>
  );
};
