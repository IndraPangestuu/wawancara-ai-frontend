import React, { useState, useEffect } from 'react';
import Copilot from './components/Copilot';
import StealthOverlay from './components/StealthOverlay';
import { checkBackendStatus } from './services/api';

function App() {
  const [stealthMode, setStealthMode] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [notification, setNotification] = useState(null);

  // Periksa status backend saat komponen dimuat
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const isAlive = await checkBackendStatus();
        setBackendStatus(isAlive ? 'connected' : 'disconnected');
        
        if (!isAlive) {
          setNotification({
            type: 'error',
            message: 'Backend tidak terhubung! Pastikan server berjalan di port 5000.'
          });
        }
      } catch (error) {
        setBackendStatus('error');
        setNotification({
          type: 'error',
          message: 'Gagal menghubungi backend. Pastikan server berjalan dan CORS diizinkan.'
        });
      }
    };

    checkBackend();
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+H untuk toggle stealth mode
      if (e.ctrlKey && e.key === 'h') {
        setStealthMode(prev => !prev);
        e.preventDefault();
      }
      // Ctrl+V untuk toggle visibility overlay
      if (e.ctrlKey && e.key === 'v') {
        setIsOverlayVisible(prev => !prev);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-1">🔒 LockedInAI</h1>
              <p className="text-slate-600">
                AI Interview Copilot dengan Stealth Mode
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              backendStatus === 'connected' 
                ? 'bg-green-100 text-green-800' 
                : backendStatus === 'checking'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }`}>
              {backendStatus === 'connected' 
                ? 'Backend Terhubung' 
                : backendStatus === 'checking'
                  ? 'Memeriksa Backend...'
                  : 'Backend Terputus'}
            </div>
          </div>
        </header>

        {notification && (
          <div className={`mb-6 p-4 rounded-lg ${
            notification.type === 'error' 
              ? 'bg-red-50 border border-red-200' 
              : 'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex justify-between items-start">
              <p className={notification.type === 'error' ? 'text-red-700' : 'text-blue-700'}>
                {notification.message}
              </p>
              <button 
                onClick={closeNotification}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {isOverlayVisible && (
          <StealthOverlay 
            stealthMode={stealthMode} 
            onToggleStealth={() => setStealthMode(prev => !prev)}
            onClose={() => setIsOverlayVisible(false)}
          />
        )}

        <Copilot 
          stealthMode={stealthMode} 
          backendStatus={backendStatus}
        />
        
        <div className="mt-8 p-4 bg-white rounded-lg border border-slate-200">
          <h3 className="font-medium text-slate-800 mb-3">Panduan Penggunaan</h3>
          <ul className="text-sm text-slate-600 space-y-2">
            <li className="flex items-start">
              <span className="inline-block mr-2">•</span>
              <span>
                <span className="font-medium">Mode Stealth</span> (Ctrl+H): Menyembunyikan aplikasi saat wawancara
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block mr-2">•</span>
              <span>
                <span className="font-medium">Toggle Overlay</span> (Ctrl+V): Menampilkan/menyembunyikan window overlay
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block mr-2">•</span>
              <span>
                <span className="font-medium">Rekam Suara</span>: Klik ikon mikrofon dan mulai berbicara
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block mr-2">•</span>
              <span>
                <span className="font-medium">Catatan</span>: Pastikan backend berjalan di port 5000 untuk fitur lengkap
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;