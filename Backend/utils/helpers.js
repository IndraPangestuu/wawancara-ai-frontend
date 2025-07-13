// Validasi ukuran file audio
exports.validateAudioSize = (fileBuffer, maxSizeMB) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (fileBuffer.length > maxSizeBytes) {
    throw new Error(`Ukuran audio melebihi batas ${maxSizeMB}MB`);
  }
  return true;
};

// Format respons API
exports.apiResponse = (res, status, data, message = '') => {
  const response = {
    success: status >= 200 && status < 300,
    message,
    data
  };
  return res.status(status).json(response);
};

// Penanganan error
exports.handleServiceError = (res, error) => {
  console.error('Service Error:', error.message);
  return this.apiResponse(res, 500, null, error.message || 'Terjadi kesalahan pada server');
};