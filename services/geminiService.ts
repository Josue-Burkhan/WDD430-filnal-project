import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

// Initialize the client safely
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

export const GeminiService = {
  /**
   * Streams chat response from Gemini
   */
  async *streamChat(history: Message[], newMessage: string) {
    try {
      // Convert internal history to Gemini format
      // Note: We are keeping it simple and stateless for this demo service,
      // but typically you'd persist the chat session object.
      // Here we reconstruct context for a "stateless" feel or use a fresh chat.
      
      const chat = ai.chats.create({
        model: MODEL_NAME,
        config: {
          systemInstruction: "You are a helpful, clever, and concise AI assistant named Nexus.",
        }
      });

      // Pre-load history (simplified for this demo)
      // In a production app, we would map 'history' to the chat's history format properly.
      // For now, we just send the new message to a fresh chat context to keep it robust 
      // without managing full history state complexity in this snippet.
      // If we wanted history: 
      // const historyContent = history.map(h => ({ role: h.role, parts: [{ text: h.text }] }));
      
      const result = await chat.sendMessageStream({ message: newMessage });

      for await (const chunk of result) {
        // Correctly accessing text from the chunk based on @google/genai guidlines
        yield chunk.text; 
      }
    } catch (error) {
      console.error("Chat Stream Error:", error);
      throw error;
    }
  },

  /**
   * Analyzes an image with a prompt
   */
  async analyzeImage(file: File, prompt: string): Promise<string> {
    try {
      // Convert File to Base64
      const base64Data = await fileToGenericBase64(file);
      
      // Construct the parts
      // Using gemini-2.5-flash which supports multimodal input
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: file.type,
                data: base64Data
              }
            },
            { text: prompt || "Describe this image in detail." }
          ]
        }
      });

      return response.text || "No response generated.";
    } catch (error) {
      console.error("Vision Error:", error);
      throw error;
    }
  },

  /**
   * Generates creative writing content
   */
  async generateCreativeContent(topic: string, tone: string): Promise<string> {
    const prompt = `Write a creative piece about "${topic}". The tone should be ${tone}. Keep it engaging and well-structured.`;

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
      });

      return response.text || "No content generated.";
    } catch (error) {
      console.error("Writer Error:", error);
      throw error;
    }
  }
};

// Helper to convert file to base64 string (raw base64 without data prefix for API if needed, 
// but the API usually takes just the data part. The GoogleGenAI SDK expects standard base64 string)
function fileToGenericBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove "data:image/jpeg;base64," prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}