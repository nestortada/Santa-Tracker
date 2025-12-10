import { GoogleGenAI, Type } from "@google/genai";
import { Coordinates } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Geocodes a city name to latitude and longitude using Gemini Flash.
 */
export const geocodeLocation = async (city: string): Promise<Coordinates | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Return the latitude and longitude for ${city}. Return JSON only.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lat: { type: Type.NUMBER },
            lng: { type: Type.NUMBER },
          },
          required: ["lat", "lng"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as Coordinates;
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
};

/**
 * Generates a delivery confirmation image using Imagen.
 */
export const generateDeliveryImage = async (
  kidName: string,
  gift: string,
  city: string,
  country: string
): Promise<string | null> => {
  try {
    const prompt = `A magical, photorealistic 4k image of Santa Claus secretly delivering a ${gift} to a room for a child named ${kidName} in ${city}, ${country}. Warm Christmas lights, cozy atmosphere, cinematic lighting, highly detailed.`;
    
    // Using Imagen 3 (via 'imagen-4.0-generate-001' or similar available endpoint as per guidelines)
    // The guidelines specify 'imagen-4.0-generate-001' for high quality generation when requested.
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '16:9',
        }
    });

    const base64Data = response.generatedImages?.[0]?.image?.imageBytes;
    if (base64Data) {
        return `data:image/jpeg;base64,${base64Data}`;
    }
    return null;

  } catch (error) {
    console.error("Image generation failed:", error);
    // Fallback to a placeholder if generation fails to keep the UI intact
    return `https://picsum.photos/800/600?random=${Math.random()}`;
  }
};
