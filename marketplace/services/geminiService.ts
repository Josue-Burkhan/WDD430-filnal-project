import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in env");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Error: API Key not configured.";

  try {
    const prompt = `Write a soulful, artisanal, and attractive product description (max 2 sentences) for a handmade product named "${productName}" in the category "${category}". Highlight its unique, handcrafted nature.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "Error connecting to AI.";
  }
};