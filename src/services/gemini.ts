import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateHistoryStory(prompt?: string) {
  const defaultPrompt = "Write a short, engaging story about ancient Indian history (Prachin Bharat ka Itihas) in Hindi. Make it feel like a narration. Start with a welcoming tone.";
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt || defaultPrompt,
    config: {
      systemInstruction: "You are a master historian and storyteller. Your stories are vivid, educational, and written in beautiful Hindi (Devanagari script).",
    },
  });

  return response.text || "Kahani load nahi ho saki. Kripya phir se koshish karein.";
}
