/**
 * Deterministic, grounded fallback provider for Virasat AI Assistant.
 * Synthesizes high quality, structured responses from verified datasets.
 */

import { AIProvider } from './aiProvider.interface';

export class FallbackProvider implements AIProvider {
  public isAvailable(): boolean {
    return true; // Always available offline
  }

  public getModelName(): string {
    return 'Virasat-Deterministic-Engine';
  }

  public async generateText(prompt: string, systemInstruction?: string): Promise<string | null> {
    // When called directly as text generator, returns null to let the domain engines format their structured responses
    return null;
  }
}
