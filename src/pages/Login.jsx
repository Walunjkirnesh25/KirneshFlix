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
      setError("That combination does not match our records.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen min-h-[100svh] items-center justify-center overflow-hidden px-5 pt-20">
      <div className="absolute inset-0">
        <SmartImage src={ambient.hero} alt="" palette={ambient.palette} className="h-full w-full" imgClassName="scale-110 blur-2xl opacity-40" priority />
        <div className="absolute inset-0 bg-dusk-950/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_10%,_rgba(255,209,102,0.08),_transparent)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-strong rounded-[32px] p-8 shadow-glass">
          <div className="mb-7 flex flex-col items-center">
            <Wordmark size="lg" />
            <p className="mt-3 text-center text-[13px] font-semibold text-parchment-300">Studio access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="kirnesh@kirneshflix.app" required />
            <Field id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />

            {error && (
              <div className="rounded-2xl border border-coral/30 bg-coral/10 px-4 py-3 text-[13px] font-semibold text-coral">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-pill btn-primary w-full justify-center py-3 text-[15px] disabled:opacity-60">
              {loading ? 'Signing in…' : 'Continue'}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-[12px] font-semibold text-parchment-400">
            <Link to="/" className="hover:text-lantern-300 transition-colors">← Back to stories</Link>
            <span>Restricted to Kirnesh.</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Field = ({ id, label, ...rest }) => (
  <label htmlFor={id} className="block">
    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.24em] text-parchment-300">{label}</span>
    <input
      id={id}
      {...rest}
      className="w-full rounded-2xl border border-lantern-300/10 bg-lantern-300/5 px-4 py-3 text-[15px] font-semibold text-parchment-50 placeholder-parchment-400 transition focus:border-lantern-300/40 focus:outline-none"
    />
  </label>
);

export default Login;
