const { apiResponse } = require('../utils/helpers');

exports.healthCheck = (req, res) => {
  const data = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    services: ['whisper', 'deepseek']
  };
  return apiResponse(res, 200, data);
};