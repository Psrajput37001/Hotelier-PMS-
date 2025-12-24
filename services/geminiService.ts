
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";

// Always initialize with API key from environment
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiModels = {
  chat: 'gemini-3-flash-preview',
  vision: 'gemini-3-flash-preview',
  image: 'gemini-2.5-flash-image',
  audio: 'gemini-2.5-flash-native-audio-preview-09-2025'
};

export const chatWithGrounding = async (prompt: string, location?: { latitude: number; longitude: number }) => {
  const ai = getAI();
  const tools: any[] = [{ googleSearch: {} }];
  
  if (location) {
    tools.push({ googleMaps: {} });
  }

  const response = await ai.models.generateContent({
    // Maps grounding requires gemini-2.5 series models
    model: location ? 'gemini-2.5-flash' : geminiModels.chat,
    contents: prompt,
    config: {
      tools,
      toolConfig: location ? {
        retrievalConfig: {
          latLng: location
        }
      } : undefined
    }
  });

  return response;
};

export const analyzeImage = async (prompt: string, base64Image: string, mimeType: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: geminiModels.vision,
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType } },
        { text: prompt }
      ]
    }
  });
  // response.text is a property, not a method
  return response.text;
};

export const generateImage = async (prompt: string, aspectRatio: "1:1" | "4:3" | "16:9" = "1:1") => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: geminiModels.image,
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio,
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  return null;
};

// Implement manual base64 decoding for PCM audio chunks
export const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// Implement manual base64 encoding for PCM audio chunks
export const encodeBase64 = (bytes: Uint8Array) => {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
