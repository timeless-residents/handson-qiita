const { GoogleGenerativeAI } = require('@google/generative-ai');

// Gemini API の設定
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// 生成設定
const generationConfig = {
    temperature: 0.7,      // より実践的な内容のため、やや低めに設定
    topP: 0.8,            // より信頼性の高い出力のため調整
    topK: 40,           
    maxOutputTokens: 8192,
};

module.exports = {
    genAI,
    generationConfig,
    GEMINI_API_KEY
};