/**
 * Utility to verify if the application is running in a secure context (HTTPS)
 * or local development environment (localhost / 127.0.0.1 / [::1]).
 *
 * Web standards strictly restrict the MediaDevices API (navigator.mediaDevices.getUserMedia)
 * and SpeechRecognition to secure origins (HTTPS or localhost) for user privacy.
 */
export function isSecureContext(): boolean {
  if (typeof window === 'undefined') return true;

  // Modern browsers provide window.isSecureContext
  if (typeof window.isSecureContext === 'boolean') {
    return window.isSecureContext;
  }

  // Fallback origin checking
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;

  const isLocal =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    hostname.endsWith('.localhost');

  return protocol === 'https:' || isLocal;
}

export function isLocalhost(): boolean {
  if (typeof window === 'undefined') return true;
  const hostname = window.location.hostname;
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    hostname.endsWith('.localhost')
  );
}

export function isHttps(): boolean {
  if (typeof window === 'undefined') return true;
  return window.location.protocol === 'https:';
}

export const INSECURE_MEDIA_ALERT_TITLE = 'HTTPS or Localhost Required for Microphone';

export const INSECURE_MEDIA_ERROR_MESSAGE =
  'Microphone access requires a secure connection (HTTPS) or a local development environment (localhost). The browser disables the MediaDevices and SpeechRecognition APIs in insecure HTTP environments.';
