const { apiResponse } = require('../utils/helpers');

module.exports = (err, req, res, next) => {
  console.error('Global Error Handler:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan internal pada server';
  
  return apiResponse(res, statusCode, null, message);
};