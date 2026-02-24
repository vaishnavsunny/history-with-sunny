import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateHistoryStory(prompt?: string, style: string = 'educational', length: string = 'medium', language: string = 'hi'): Promise<{ story: string; imageUrl?: string }> {
  const defaultPrompt = "Write a short, engaging story about ancient Indian history (Prachin Bharat ka Itihas) in Hindi. Make it feel like a narration. Start with a welcoming tone.";
  let systemInstruction = `You are a master historian and storyteller. Your stories are vivid, educational, and written in beautiful ${language === 'hi' ? 'Hindi (Devanagari script)' : 'English'}.`;

  switch (style) {
    case 'adventurous':
      systemInstruction += " The story should be thrilling and full of adventure.";
      break;
    case 'mysterious':
      systemInstruction += " The story should be enigmatic and full of suspense.";
      break;
    case 'poetic':
      systemInstruction += " The story should be lyrical and evocative, with a poetic flair.";
      break;
    case 'educational':
    default:
      systemInstruction += " The story should be highly informative and engaging for learning.";
      break;
  }

  switch (length) {
    case 'short':
      systemInstruction += " Keep the story concise, around 100-150 words.";
      break;
    case 'long':
      systemInstruction += " Make the story detailed and comprehensive, around 400-500 words.";
      break;
    case 'medium':
    default:
      systemInstruction += " Keep the story at a moderate length, around 200-300 words.";
      break;
  }

  const fullPrompt = `Generate a historical story based on the following prompt: "${prompt || defaultPrompt}". Also, provide a detailed description for an image that would accompany this story. The image description should be in English and be suitable for an image generation model.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-image-preview", // Use image-enabled model
    contents: [{ parts: [{ text: fullPrompt }] }],
    config: {
      systemInstruction: systemInstruction,
      imageConfig: {
        aspectRatio: "16:9", // Landscape image
        imageSize: "1K",
      },
    },
  });

  let storyText = "Kahani load nahi ho saki. Kripya phir se koshish karein.";
  let imageUrl: string | undefined = undefined;

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      storyText = part.text;
    } else if (part.inlineData) {
      imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  return { story: storyText, imageUrl };
}
