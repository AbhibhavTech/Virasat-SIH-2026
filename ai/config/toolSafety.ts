/** Validate the registry's JSON-schema subset at the server boundary. */
export function validToolInput(value: unknown, schema: any, depth = 0): boolean {
  if (depth > 8 || !schema) return false;
  if (schema.enum && !schema.enum.includes(value)) return false;
  switch (String(schema.type).toLowerCase()) {
    case 'object': {
      if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
      const object = value as Record<string, unknown>;
      return Object.keys(object).length <= 30 &&
        (schema.required || []).every((key: string) => object[key] !== undefined) &&
        Object.entries(object).every(([key, item]) => schema.properties?.[key] && validToolInput(item, schema.properties[key], depth + 1));
    }
    case 'array': return Array.isArray(value) && value.length <= 30 && value.every(item => validToolInput(item, schema.items, depth + 1));
    case 'string': return typeof value === 'string' && value.length <= 2000;
    case 'integer': return typeof value === 'number' && Number.isSafeInteger(value);
    case 'number': return typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= 1e9;
    case 'boolean': return typeof value === 'boolean';
    default: return false;
  }
}

export const consequentialTools = new Set(['updateItinerary', 'saveCurrentTrip', 'initiateBookingHandoff']);
export const privateTools = new Set(['getUserProfile', 'getSavedTrips']);
