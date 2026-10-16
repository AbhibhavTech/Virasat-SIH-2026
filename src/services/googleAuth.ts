import appletConfig from '../../firebase-applet-config.json';

export interface GoogleUserProfile {
  email: string;
  name: string;
  picture?: string;
  sub: string;
}

export const GOOGLE_CLIENT_ID =
  (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
  (import.meta as any).env?.VITE_FIREBASE_OAUTH_CLIENT_ID ||
  appletConfig.oAuthClientId ||
  '477345081769-kigt2pvsiupe8e3diasom7bm1bhgk1pd.apps.googleusercontent.com';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (notification?: (notification: any) => void) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          disableAutoSelect: () => void;
          cancel: () => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            prompt?: string;
            callback: (response: any) => void;
            error_callback?: (error: any) => void;
          }) => {
            requestAccessToken: (overrideConfig?: any) => void;
          };
          initCodeClient?: (config: any) => any;
          hasGrantedAllScopes?: (tokenResponse: any, ...scopes: string[]) => boolean;
        };
      };
    };
  }
}

/**
 * Dynamically loads the official Google Identity Services script
 */
export function loadGoogleIdentityScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return resolve();

    if (window.google?.accounts) {
      return resolve();
    }

    const existingScript = document.getElementById('google-gsi-client');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', (err) => reject(err));
      // In case it already loaded
      if (window.google?.accounts) resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(new Error('Failed to load Google Identity Services script. Check your internet connection or ad-blocker.'));
    document.head.appendChild(script);
  });
}

/**
 * Decode JWT token payload from Google ID Token
 */
export function parseGoogleJwt(token: string): GoogleUserProfile {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const data = JSON.parse(jsonPayload);
    return {
      email: data.email,
      name: data.name || data.email.split('@')[0],
      picture: data.picture,
      sub: data.sub,
    };
  } catch (err) {
    throw new Error('Failed to parse Google authentication token.');
  }
}

/**
 * Trigger Real Google OAuth 2.0 Popup from accounts.google.com
 * Opens Google's authentic account chooser window
 */
export async function signInWithRealGoogle(): Promise<GoogleUserProfile> {
  await loadGoogleIdentityScript();

  if (!window.google?.accounts?.oauth2) {
    throw new Error('Google Identity Services library is not ready. Please try again.');
  }

  return new Promise<GoogleUserProfile>((resolve, reject) => {
    try {
      const client = window.google!.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'openid email profile',
        prompt: 'select_account',
        callback: async (tokenResponse) => {
          if (!tokenResponse) {
            return reject(new Error('Google sign-in was cancelled.'));
          }
          if (tokenResponse.error) {
            return reject(new Error(tokenResponse.error_description || tokenResponse.error));
          }
          if (!tokenResponse.access_token) {
            return reject(new Error('No access token received from Google.'));
          }

          try {
            // Fetch verified user profile directly from Google
            const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            });

            if (!userinfoRes.ok) {
              throw new Error(`Google profile fetch failed with status ${userinfoRes.status}`);
            }

            const profile = await userinfoRes.json();
            resolve({
              email: profile.email,
              name: profile.name || profile.email.split('@')[0],
              picture: profile.picture,
              sub: profile.sub,
            });
          } catch (err: any) {
            reject(new Error(err?.message || 'Could not retrieve user info from Google.'));
          }
        },
        error_callback: (error) => {
          console.warn('Google Identity error callback:', error);
          if (error?.type === 'popup_closed') {
            reject(new Error('Google popup was closed before completing sign-in.'));
          } else {
            reject(new Error(error?.message || 'Google authentication error.'));
          }
        },
      });

      // Launch the real Google account chooser popup window
      client.requestAccessToken();
    } catch (err: any) {
      reject(err);
    }
  });
}

/**
 * Initialize Google One Tap with official Google Identity Services
 */
export async function initOfficialGoogleOneTap(
  onSuccess: (profile: GoogleUserProfile) => void,
  onError?: (err: any) => void
): Promise<void> {
  try {
    await loadGoogleIdentityScript();
    if (!window.google?.accounts?.id) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (res: { credential?: string }) => {
        if (res?.credential) {
          try {
            const profile = parseGoogleJwt(res.credential);
            onSuccess(profile);
          } catch (e) {
            onError?.(e);
          }
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    window.google.accounts.id.prompt((notification: any) => {
      if (notification?.isNotDisplayed?.()) {
        console.info('Google One Tap not displayed:', notification.getNotDisplayedReason?.());
      } else if (notification?.isSkippedMoment?.()) {
        console.info('Google One Tap skipped:', notification.getSkippedReason?.());
      } else if (notification?.isDismissedMoment?.()) {
        console.info('Google One Tap dismissed:', notification.getDismissedReason?.());
      }
    });
  } catch (err) {
    console.warn('Could not initialize Google One Tap:', err);
    onError?.(err);
  }
}
