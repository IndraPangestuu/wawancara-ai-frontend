const { transcribeAudio } = require('../services/whisperService');
const { generateAnswer } = require('../services/deepseekService');
const { processAudioBuffer } = require('../services/fileService');
const { apiResponse, handleServiceError } = require('../utils/helpers');

// Transkripsi audio
exports.transcribe = async (req, res) => {
  try {
    if (!req.file) {
      return apiResponse(res, 400, null, 'File audio tidak ditemukan');
    }
    
    // Proses file audio
    const audioResult = processAudioBuffer(req.file.buffer, process.env.MAX_AUDIO_SIZE);
    if (!audioResult.success) {
      return apiResponse(res, 400, null, audioResult.error);
    }
    
    // Transkripsi audio
    const transcriptionResult = await transcribeAudio(audioResult.buffer);
    if (!transcriptionResult.success) {
      return apiResponse(res, 500, null, transcriptionResult.error);
    }
    
    return apiResponse(res, 200, { text: transcriptionResult.transcription });
  } catch (error) {
    return handleServiceError(res, error);
  }
};

// Generate jawaban AI
exports.generateAnswer = async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question || question.trim().length < 5) {
      return apiResponse(res, 400, null, 'Pertanyaan tidak valid');
    }
    
    // Generate jawaban
    const generationResult = await generateAnswer(question);
    if (!generationResult.success) {
      return apiResponse(res, 500, null, generationResult.error);
    }
    
    return apiResponse(res, 200, { answer: generationResult.answer });
  } catch (error) {
    return handleServiceError(res, error);
  }
};