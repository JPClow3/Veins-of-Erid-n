import { GoogleGenAI } from "@google/genai";

// Centralized AI client instance to be shared across the application.
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
