/**
 * Gemini Provider for Virasat AI Assistant using Google GenAI SDK
 */

import { GoogleGenAI } from '@google/genai';
import { AIProvider } from './aiProvider.interface';

export class GeminiProvider implements AIProvider {
  private client: GoogleGenAI | null = null;
  private primaryModel = 'gemini-2.5-flash';
  private fallbackModels = ['gemini-2.0-flash', 'gemini-1.5-flash'];
  private lastUsedModel = 'gemini-2.5-flash';

  constructor() {
    this.initClient();
  }

  private initClient(): void {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (apiKey) {
      this.client = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'virasat-ai-assistant/2.0' } },
      });
    }
  }

  public isAvailable(): boolean {
    return Boolean(this.client || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
  }

  public getModelName(): string {
    return this.lastUsedModel;
  }

  public async generateText(prompt: string, systemInstruction?: string): Promise<string | null> {
    if (!this.client) {
      this.initClient();
    }
    if (!this.client) {
      return null;
    }

    const candidateModels = [this.primaryModel, ...this.fallbackModels];

    for (const model of candidateModels) {
      try {
        const timeoutPromise = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout (8s)')), 8000)
        );

        const apiPromise = this.client.models.generateContent({
          model,
          contents: prompt,
          config: systemInstruction ? { systemInstruction } : undefined,
        });

        const response: any = await Promise.race([apiPromise, timeoutPromise]);
        if (response && response.text) {
          this.lastUsedModel = model;
          return response.text;
        }
      } catch (err) {
        // Silently try next fallback model
      }
    }

    return null;
  }
}
