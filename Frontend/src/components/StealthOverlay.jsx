import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaTimes, FaLightbulb, FaQuestionCircle } from 'react-icons/fa';

const StealthOverlay = ({ stealthMode, onToggleStealth, onClose }) => {
  const [history, setHistory] = useState([
    { question: "Ceritakan tentang diri Anda", answer: "Saya seorang pengembang perangkat lunak dengan pengalaman 3 tahun di bidang frontend development, khususnya dengan React dan Vue.js." },
    { question: "Apa kelemahan terbesar Anda?", answer: "Saya cenderung terlalu fokus pada detail, tetapi saya sedang belajar untuk menyeimbangkan antara kualitas dan kecepatan pengiriman." }
  ]);
  
  const [currentQuestion, setCurrentQuestion] = useState("Bagaimana Anda menangani tekanan deadline?");
  const [currentAnswer, setCurrentAnswer] = useState("Saya memprioritaskan tugas, membuat rencana yang jelas, dan berkomunikasi proaktif dengan tim jika diperlukan penyesuaian timeline.");

  useEffect(() => {
    // Simulasi perubahan pertanyaan
    const interval = setInterval(() => {
      if (history.length > 0) {
        const randomIndex = Math.floor(Math.random() * history.length);
        setCurrentQuestion(history[randomIndex].question);
        setCurrentAnswer(history[randomIndex].answer);
      }
    }, 15000);
    
    return () => clearInterval(interval);
  }, [history]);

  return (
    <div className={`overlay-window p-5 flex flex-col ${stealthMode ? 'stealth-mode' : ''}`}>
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
              <FaLightbulb className="text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">LockedInAI Copilot</h2>
            <p className="text-xs text-slate-500">Interview Assistant v0.1</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={onToggleStealth}
            className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            title={stealthMode ? "Show" : "Hide"}
          >
            {stealthMode ? <FaEyeSlash /> : <FaEye />}
          </button>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            title="Close"
          >
            <FaTimes />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className={`mb-4 p-4 rounded-lg transition-colors ${
          stealthMode 
            ? 'bg-blue-100 border border-blue-300' 
            : 'bg-yellow-50 border border-yellow-300'
        }`}>
          <div className="flex items-start">
            <div className={`mr-3 mt-1 flex-shrink-0 ${
              stealthMode ? 'text-blue-600' : 'text-yellow-600'
            }`}>
              <FaQuestionCircle size={18} />
            </div>
            <div>
              <p className={`font-medium ${
                stealthMode ? 'text-blue-800' : 'text-yellow-800'
              }`}>
                {stealthMode ? 'Mode Stealth Aktif' : 'Mode Normal'}
              </p>
              <p className={`text-sm ${
                stealthMode ? 'text-blue-700' : 'text-yellow-700'
              }`}>
                {stealthMode 
                  ? 'Aplikasi tersembunyi. Arahkan kursor untuk melihat.' 
                  : 'Aplikasi terlihat. Gunakan Ctrl+H untuk menyembunyikan.'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium text-slate-700 mb-2 flex items-center">
            <span className="bg-slate-200 rounded-full w-6 h-6 flex items-center justify-center text-slate-700 text-xs mr-2">Q</span>
            Pertanyaan Pewawancara
          </h3>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-slate-800 font-medium">{currentQuestion}</p>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-slate-700 mb-2 flex items-center">
            <span className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-blue-700 text-xs mr-2">A</span>
            Jawaban AI
          </h3>
          <div className="bg-white border border-blue-200 rounded-lg p-4">
            <p className="text-slate-800">{currentAnswer}</p>
          </div>
        </div>
      </div>
      
      <div className="pt-4 mt-auto border-t border-slate-200">
        <div className="flex justify-between items-center">
          <div className="text-xs text-slate-500">
            Status: {stealthMode ? (
              <span className="text-blue-600 font-medium">Tersembunyi</span>
            ) : (
              <span className="text-green-600 font-medium">Terlihat</span>
            )}
          </div>
          <div className="text-xs text-slate-500">
            <span className="font-medium">CPU:</span> 12% | <span className="font-medium">RAM:</span> 45MB
          </div>
        </div>
      </div>
    </div>
  );
};

export default StealthOverlay;