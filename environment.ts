import dotenv from 'dotenv';
dotenv.config();

export const environment = {
    production: false,
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    geminiApiUrl: process.env.GEMINI_API_URL || '',
};