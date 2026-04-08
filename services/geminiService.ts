import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key is missing. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeContent = async (text: string, contextType: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "API Key not configured.";

  try {
    const prompt = `
      You are an internal tech communications assistant for a forward-thinking tech company.
      Analyze the following ${contextType} content and provide a concise, bullet-point summary 
      highlighting the key takeaways for employees. 
      Also, suggest one actionable insight or thought-provoking question related to our company's potential growth in this area.
      
      Content: "${text}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster simple summary
      }
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to analyze content. Please try again later.";
  }
};

export const askAIChat = async (query: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "API Key not configured.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
         systemInstruction: "You are 'NexusAI', a helpful assistant embedded in the company's internal news hub. Keep answers professional, concise, and tech-focused.",
      }
    });
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Chat Error:", error);
    return "Sorry, I encountered an error processing your request.";
  }
}
