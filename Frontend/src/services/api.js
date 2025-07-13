import axios from 'axios';

// Konfigurasi API base URL (sesuaikan dengan URL backend Anda)
const API_BASE_URL = 'http://localhost:5173/api';

// Fungsi untuk transkripsi audio
export const transcribeAudio = async (audioBlob) => {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    const response = await axios.post(`${API_BASE_URL}/transcribe`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.text;
  } catch (error) {
    console.error('Transcription error:', error.response?.data || error.message);
    throw new Error('Gagal melakukan transkripsi audio. Pastikan backend berjalan dan mikrofon diizinkan.');
  }
};

// Fungsi untuk menghasilkan jawaban AI
export const generateAnswer = async (question) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate-answer`, {
      question
    });

    return response.data.answer;
  } catch (error) {
    console.error('Generation error:', error.response?.data || error.message);
    throw new Error('Gagal menghasilkan jawaban. Periksa koneksi atau API key.');
  }
};

// Fungsi untuk memeriksa status backend
export const checkBackendStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data.status === 'ok';
  } catch (error) {
    console.error('Backend check failed:', error);
    return false;
  }
};