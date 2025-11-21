import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { AI_SYSTEM_INSTRUCTION } from '../constants';

// Helper to retrieve API Key from various environments (Node/Vite)
const getApiKey = (): string => {
  // Check process.env (Standard Node/Webpack)
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  // Check import.meta.env (Vite/GitHub Pages)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.API_KEY || '';
  }
  return '';
};

// Lazy initialization of the AI client
let aiClient: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
  if (!aiClient) {
    const apiKey = getApiKey();
    if (!apiKey) {
      console.error("Gemini API Key is missing. Please check your environment variables.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    const ai = getAiClient();
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: AI_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const chat = getChatSession();
    const result: GenerateContentResponse = await chat.sendMessage({
      message: message
    });
    
    return result.text || "I'm sorry, I didn't catch that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to communicate with the AI assistant.");
  }
};

export const generateProjectIdea = async (skills: string[]): Promise<string> => {
  try {
    const ai = getAiClient();
    const model = ai.models;
    const prompt = `Based on these skills: ${skills.join(', ')}, suggest one unique, beginner-friendly but impressive web app project idea. Format it with a Title and a 2-sentence description.`;
    
    const result = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return result.text || "Could not generate an idea at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating project idea.";
  }
};

export const summarizeBlogPost = async (content: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const model = ai.models;
    const prompt = `You are an executive assistant. Summarize the following blog post into 3 concise, strategic bullet points for a busy C-level executive. Format with bullet points (•). \n\nBLOG CONTENT:\n${content}`;
    
    const result = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return result.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating summary.";
  }
};

export const generateBlogPost = async (topic: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const model = ai.models;
    const prompt = `Write a professional, strategic blog post about "${topic}" for a Technology Director portfolio. 
    
    Requirements:
    - Tone: Thought-leadership, professional, insightful.
    - Format: HTML (use <p>, <h3>, <ul>, <li> tags). NO markdown code blocks.
    - Length: Approx 300-400 words.
    - Focus on business value and strategy, not just code.
    
    Just return the HTML body content.`;
    
    const result = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return result.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "<p>Error generating content. Please try again.</p>";
  }
};