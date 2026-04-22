import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Wordmark from './Wordmark';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-[background,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? 'bg-ink-900/70 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 sm:px-8">
        <Link to="/" aria-label="Kirneshflix — home" className="flex items-center">
          <Wordmark size="md" />
        </Link>

        <div className="hidden sm:flex items-center gap-7">
          <NavItem to="/">Stories</NavItem>
          <NavItem to="/#collections">Collections</NavItem>
          <NavItem to="/#journal">Journal</NavItem>
        </div>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <Link
                to="/dashboard"
                className="text-[13px] text-frost-200 hover:text-frost-50 transition-colors"
              >
                Studio
              </Link>
              <button
                onClick={handleLogout}
                className="btn-pill btn-ghost text-[13px] py-1.5 px-3"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-pill btn-ghost text-[13px] py-1.5 px-3">
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </motion.header>
  );
};

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `text-[13px] tracking-tight transition-colors ${
        isActive ? 'text-frost-50' : 'text-frost-300 hover:text-frost-50'
      }`
    }
  >
    {children}
  </NavLink>
);

export default Navbar;
