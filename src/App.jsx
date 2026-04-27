import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TrekGallery from './pages/TrekGallery';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import CursorGlow from './components/CursorGlow';
import { AuthProvider } from './context/AuthContext';

// Show splash only on the first visit per browser session.
const hasSeen = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('kf_seen');

function App() {
  const [showSplash, setShowSplash] = useState(!hasSeen);

  const handleSplashDone = () => {
    sessionStorage.setItem('kf_seen', '1');
    setShowSplash(false);
  };

  return (
    <AuthProvider>
      <Router>
        {showSplash && <SplashScreen onComplete={handleSplashDone} />}
        <CursorGlow />
        <div className="relative min-h-screen min-h-[100svh] text-parchment-50">
          <Navbar />
          <main className="relative z-[2]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/trek/:id" element={<TrekGallery />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
