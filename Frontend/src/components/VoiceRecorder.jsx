import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaStop, FaExclamationTriangle } from 'react-icons/fa';
import { transcribeAudio } from '../services/api';

const VoiceRecorder = ({ onResult, backendStatus }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const setupRecorder = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Browser tidak mendukung rekaman audio');
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            noiseSuppression: true,
            echoCancellation: true
          } 
        });
        
        const options = { mimeType: 'audio/webm;codecs=opus' };
        mediaRecorderRef.current = new MediaRecorder(stream, options);
        
        mediaRecorderRef.current.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };
        
        mediaRecorderRef.current.onstop = async () => {
          if (backendStatus !== 'connected') {
            setError('Backend tidak terhubung. Transkripsi tidak tersedia.');
            return;
          }
          
          setIsTranscribing(true);
          setError('');
          
          try {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const transcription = await transcribeAudio(audioBlob);
            onResult(transcription);
          } catch (err) {
            setError(err.message || 'Gagal melakukan transkripsi audio');
          } finally {
            setIsTranscribing(false);
            audioChunksRef.current = [];
          }
        };
        
        mediaRecorderRef.current.onerror = (event) => {
          console.error('Recording error:', event.error);
          setError(`Error rekaman: ${event.error.name}`);
        };
        
      } catch (err) {
        console.error('Error accessing microphone:', err);
        setError(`Akses mikrofon gagal: ${err.message}`);
      }
    };

    if (backendStatus === 'connected') {
      setupRecorder();
    }

    return () => {
      if (mediaRecorderRef.current?.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onResult, backendStatus]);

  const startRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError('');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  if (backendStatus !== 'connected') {
    return (
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-slate-500">
        Mode rekaman suara tidak tersedia saat backend terputus
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-blue-600 hover:bg-blue-700'
          } ${isTranscribing ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isTranscribing}
        >
          {isRecording ? <FaStop size={24} /> : <FaMicrophone size={24} />}
        </button>
        
        {isRecording && (
          <div className="absolute -top-2 -right-2 flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500"></span>
          </div>
        )}
      </div>
      
      <p className="mt-3 text-slate-600 text-center font-medium">
        {isRecording 
          ? 'Merekam... Klik untuk berhenti' 
          : isTranscribing
            ? 'Mentranskripsi audio...' 
            : 'Klik mikrofon untuk mulai merekam'}
      </p>
      
      {isTranscribing && (
        <div className="mt-4 w-full bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <p className="text-blue-700 font-medium">Mengirim audio ke server...</p>
          </div>
          <p className="text-blue-600 text-sm mt-2 text-center">
            Proses ini mungkin memakan waktu 10-30 detik
          </p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 w-full bg-red-50 p-3 rounded-lg border border-red-200">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-xs text-slate-500 text-center">
        Pastikan mikrofon diizinkan dan koneksi internet stabil
      </div>
    </div>
  );
};

export default VoiceRecorder;