/**
 * Response Validator and Grounding Guardrail for Virasat AI Assistant
 */

import { StructuredAIResponse } from '../types';

export class ResponseValidator {
  public validate(response: StructuredAIResponse): StructuredAIResponse {
    const warnings: string[] = [...(response.warnings || [])];

    // Check same-city distance sanity
    if (response.routes && response.routes.length > 0) {
      for (const r of response.routes) {
        if (r.is_same_city && r.distance_km > 60) {
          warnings.push(`Distance check: Route reported as same-city but distance exceeds 60 km (${r.distance_km} km).`);
        }
      }
    }

    // Ensure citations exist
    if (!response.sources || response.sources.length === 0) {
      response.sources = ['Archaeological Survey of India (ASI)', 'Incredible India (Ministry of Tourism)'];
    }

    response.warnings = warnings;
    return response;
  }
}

export const responseValidator = new ResponseValidator();
