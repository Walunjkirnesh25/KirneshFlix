import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SmartImage from '../components/SmartImage';
import Wordmark from '../components/Wordmark';
import { sampleTreks } from '../data/treks';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const ambient = sampleTreks.find(t => t.featured) || sampleTreks[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('That combination doesn’t match our records.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen min-h-[100svh] items-center justify-center overflow-hidden px-5 pt-20">
      {/* Ambient backdrop — a still frame, blurred */}
      <div className="absolute inset-0">
        <SmartImage
          src={ambient.hero}
          alt=""
          palette={ambient.palette}
          className="h-full w-full"
          imgClassName="scale-110 blur-2xl opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-ink-900/70" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-strong rounded-[28px] p-8 shadow-glass">
          <div className="mb-7 flex flex-col items-center">
            <Wordmark size="lg" />
            <p className="mt-3 text-center text-[13px] text-frost-300">
              Studio access
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kirnesh@kirneshflix.app"
              required
            />
            <Field
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <div className="rounded-xl border border-ember/30 bg-ember/10 px-4 py-3 text-[13px] text-ember">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-pill btn-primary w-full justify-center py-3 text-[14px] disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Continue'}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-[12px] text-frost-400">
            <Link to="/" className="hover:text-frost-200 transition">← Back to stories</Link>
            <span>Restricted to Kirnesh.</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Field = ({ id, label, ...rest }) => (
  <label htmlFor={id} className="block">
    <span className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-frost-300">
      {label}
    </span>
    <input
      id={id}
      {...rest}
      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[15px] text-frost-50 placeholder-frost-400 transition focus:border-alpine-500/60 focus:bg-white/10 focus:outline-none"
    />
  </label>
);

export default Login;
