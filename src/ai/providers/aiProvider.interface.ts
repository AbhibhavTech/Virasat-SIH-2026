/**
 * Base AI Provider interface for Virasat AI Assistant
 */

export interface AIProvider {
  generateText(prompt: string, systemInstruction?: string): Promise<string | null>;
  isAvailable(): boolean;
  getModelName(): string;
}
