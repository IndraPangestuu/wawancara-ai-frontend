module.exports = {
  model: process.env.WHISPER_MODEL || 'Xenova/whisper-small',
  task: 'transcribe',
  language: 'indonesian',
  chunkLength: 30,
  strideLength: 5,
};