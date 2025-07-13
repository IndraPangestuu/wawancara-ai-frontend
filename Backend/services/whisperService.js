const { pipeline } = require('@xenova/transformers');
const { decode } = require('audio-decode');
const whisperConfig = require('../config/whisperConfig');

class WhisperSingleton {
  static instance = null;

  static async getInstance() {
    if (this.instance === null) {
      this.instance = await pipeline(
        'automatic-speech-recognition',
        whisperConfig.model
      );
    }
    return this.instance;
  }
}

module.exports.transcribeAudio = async (audioBuffer) => {
  try {
    const transcriber = await WhisperSingleton.getInstance();
    
    // Decode audio buffer
    const audioData = await decode(audioBuffer);
    
    // Ambil channel pertama (mono)
    const leftChannel = audioData.channelData[0];
    
    // Transkripsi audio
    const result = await transcriber(leftChannel, {
      chunk_length_s: whisperConfig.chunkLength,
      stride_length_s: whisperConfig.strideLength,
      language: whisperConfig.language,
      task: whisperConfig.task,
    });
    
    return {
      success: true,
      transcription: result.text
    };
  } catch (error) {
    console.error('Transcription error:', error);
    return {
      success: false,
      error: error.message || 'Gagal melakukan transkripsi audio'
    };
  }
};