
import { GoogleGenAI } from "@google/genai";

/**
 * Chat with Gemini using Search and Maps grounding.
 */
export const chatWithGrounding = async (prompt: string, location?: { latitude: number; longitude: number }) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const tools: any[] = [{ googleSearch: {} }];
  let toolConfig: any = undefined;

  if (location) {
    tools.push({ googleMaps: {} });
    toolConfig = {
      retrievalConfig: {
        latLng: location
      }
    };
  }

  // Maps grounding is only supported in Gemini 2.5 series models.
  const model = location ? 'gemini-2.5-flash-preview' : 'gemini-3-flash-preview';

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      tools,
      toolConfig
    }
  });

  return response;
};

/**
 * Generate images using gemini-2.5-flash-image.
 */
export const generateImage = async (prompt: string, aspectRatio: "1:1" | "4:3" | "16:9") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: { aspectRatio }
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

/**
 * Decode base64 string to Uint8Array.
 */
export const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

/**
 * Encode Uint8Array to base64 string.
 */
export const encodeBase64 = (bytes: Uint8Array) => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

/**
 * Decode raw PCM audio bytes into an AudioBuffer.
 */
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
