/**
 * Text, currency, and markdown formatting utilities for Virasat AI Assistant
 */

export function formatINR(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRangeINR(min: number, max: number): string {
  if (min === max) return formatINR(min);
  return `${formatINR(min)} – ${formatINR(max)}`;
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${Math.round(km * 10) / 10} km`;
}

export function cleanText(input: string): string {
  if (!input) return '';
  return input
    .replace(/\s+/g, ' ')
    .replace(/[\r\n]+/g, '\n')
    .trim();
}

/**
 * Generate standard grounding citation strings
 */
export function createCitation(title: string, source: string, url?: string): string {
  if (url) {
    return `[${title}](${url}) (${source})`;
  }
  return `${title} (${source})`;
}
