import React, { useState, useEffect } from 'react';
import VoiceRecorder from './VoiceRecorder';
import { generateAnswer } from '../services/api';
import { FaKeyboard, FaMicrophone } from 'react-icons/fa';

const Copilot = ({ stealthMode, backendStatus }) => {
  const [inputMode, setInputMode] = useState('text');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  // Reset state saat backend status berubah
  useEffect(() => {
    if (backendStatus !== 'connected') {
      setQuestion('');
      setAnswer('');
      setTranscript('');
      setError('');
      setIsProcessing(false);
    }
  }, [backendStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || backendStatus !== 'connected') return;
    
    setIsProcessing(true);
    setAnswer('');
    setError('');
    
    try {
      const response = await generateAnswer(question);
      setAnswer(response);
    } catch (err) {
      setError(err.message || 'Gagal menghasilkan jawaban. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAudioResult = async (text) => {
    setTranscript(text);
    setQuestion(text);
    
    if (text.includes('?') && backendStatus === 'connected') {
      setIsProcessing(true);
      setAnswer('');
      setError('');
      
      try {
        const response = await generateAnswer(text);
        setAnswer(response);
      } catch (err) {
        setError(err.message || 'Gagal menghasilkan jawaban dari audio.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 mb-6 transition-all duration-300 ${
      stealthMode ? 'border-2 border-blue-400' : ''
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800">AI Interview Copilot</h2>
        <div className="flex items-center">
          <span className={`mr-3 inline-block h-3 w-3 rounded-full ${
            backendStatus === 'connected' 
              ? 'bg-green-500' 
              : backendStatus === 'checking'
                ? 'bg-yellow-500'
                : 'bg-red-500'
          }`}></span>
          <span className="text-sm text-slate-500">
            {backendStatus === 'connected' 
              ? 'Siap digunakan' 
              : backendStatus === 'checking'
                ? 'Memeriksa...'
                : 'Tidak terhubung'}
          </span>
        </div>
      </div>

      <div className="flex space-x-3 mb-5">
        <button
          className={`flex items-center px-4 py-2 rounded-lg transition-all ${
            inputMode === 'text'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
          onClick={() => setInputMode('text')}
          disabled={backendStatus !== 'connected'}
        >
          <FaKeyboard className="mr-2" />
          Text Input
        </button>
        <button
          className={`flex items-center px-4 py-2 rounded-lg transition-all ${
            inputMode === 'audio'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
          onClick={() => setInputMode('audio')}
          disabled={backendStatus !== 'connected'}
        >
          <FaMicrophone className="mr-2" />
          Voice Input
        </button>
      </div>

      {backendStatus !== 'connected' ? (
        <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 text-center">
          <div className="text-slate-500 mb-4">
            {backendStatus === 'checking' 
              ? 'Memeriksa koneksi ke backend...' 
              : 'Backend tidak terhubung. Fitur tidak tersedia.'}
          </div>
          <div className="text-sm text-slate-400">
            Pastikan server backend berjalan di port 5000
          </div>
        </div>
      ) : inputMode === 'text' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Masukkan pertanyaan wawancara..."
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            rows={4}
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={isProcessing || !question.trim()}
            className={`w-full py-3 rounded-lg font-medium transition-all ${
              isProcessing || !question.trim()
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Memproses...
              </div>
            ) : 'Generate Jawaban'}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <VoiceRecorder 
            onResult={handleAudioResult} 
            backendStatus={backendStatus}
          />
          {transcript && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-slate-700">
                <span className="font-medium text-slate-800">Transkrip:</span> {transcript}
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {answer && (
        <div className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
          <h3 className="font-medium text-blue-800 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Jawaban Rekomendasi
          </h3>
          <p className="text-slate-700 whitespace-pre-line bg-white p-4 rounded border border-blue-100">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

export default Copilot;