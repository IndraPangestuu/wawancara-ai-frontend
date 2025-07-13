const { validateAudioSize } = require('../utils/helpers');

// Ekstrak audio dari buffer
exports.processAudioBuffer = (fileBuffer, maxSizeMB = 5) => {
  try {
    // Validasi ukuran file
    validateAudioSize(fileBuffer, maxSizeMB);
    
    return {
      success: true,
      buffer: fileBuffer
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};