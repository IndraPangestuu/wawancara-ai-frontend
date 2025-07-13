const { HfInference } = require('@huggingface/inference');
const hf = new HfInference(process.env.HF_API_KEY);

module.exports.generateAnswer = async (question) => {
  try {
    const prompt = `Anda adalah asisten wawancara profesional. Berikan jawaban singkat (1-2 kalimat) untuk pertanyaan pewawancara berikut dalam Bahasa Indonesia:\n\nPertanyaan: "${question}"\nJawaban:`;
    
    const response = await hf.textGeneration({
      model: process.env.DEEPSEEK_MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
        do_sample: true,
      }
    });
    
    return {
      success: true,
      answer: response.generated_text
    };
  } catch (error) {
    console.error('Generation error:', error);
    return {
      success: false,
      error: error.message || 'Gagal menghasilkan jawaban'
    };
  }
};