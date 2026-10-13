import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const hasKey = Boolean(process.env.GEMINI_API_KEY);
console.log('GEMINI_API_KEY present:', hasKey, 'length:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0);

if (!hasKey) {
  console.log('No GEMINI_API_KEY found in process.env, server/.env, or .env');
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const modelsToTest = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

for (const model of modelsToTest) {
  console.log(`\n================ Testing Model: ${model} ================`);
  try {
    const prompt = `Search Google for live and verified tourism information about the festival "Diwali" (Ayodhya, Uttar Pradesh, India).
Strictly extract only information verified by search grounding sources. Do not guess dates.
Return JSON with upcoming_dates, best_locations, duration, key_rituals, travel_tips.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    console.log('Call Succeeded!');
    const candidate = response?.candidates?.[0];
    console.log('Candidate finishReason:', candidate?.finishReason);
    const groundingMetadata = candidate?.groundingMetadata;
    console.log('groundingMetadata exists:', Boolean(groundingMetadata));
    if (groundingMetadata) {
      console.log('webSearchQueries:', groundingMetadata.webSearchQueries);
      console.log('searchEntryPoint:', JSON.stringify(groundingMetadata.searchEntryPoint));
      console.log('groundingChunks count:', groundingMetadata.groundingChunks?.length || 0);
      if (groundingMetadata.groundingChunks) {
        console.log('First 2 chunks:', JSON.stringify(groundingMetadata.groundingChunks.slice(0, 2), null, 2));
      }
    }
    const text = candidate?.content?.parts?.[0]?.text;
    console.log('Text preview (first 200 chars):', text ? text.slice(0, 200) : 'NO TEXT');
    break; // Found working model
  } catch (err) {
    console.log('Call Failed!');
    console.log('Error status:', err?.status);
    console.log('Error message:', err?.message);
    if (err?.errorDetails) {
      console.log('Error details:', JSON.stringify(err.errorDetails, null, 2));
    }
  }
}
