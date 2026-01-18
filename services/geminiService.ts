
import { GoogleGenAI } from "@google/genai";

export async function transformImage(
  base64Image: string,
  prompt: string
): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Strip metadata from base64 string if present
  const base64Data = base64Image.split(',')[1] || base64Image;
  const mimeTypeMatch = base64Image.match(/^data:(image\/[a-zA-Z]+);base64,/);
  const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/png';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    let transformedUrl = "";
    
    // Iterate through candidates and parts to find the image part
    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          transformedUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!transformedUrl) {
      throw new Error("No image data returned from the model.");
    }

    return transformedUrl;
  } catch (error: any) {
    console.error("Gemini Image Transformation Error:", error);
    throw new Error(error.message || "Failed to transform image.");
  }
}
