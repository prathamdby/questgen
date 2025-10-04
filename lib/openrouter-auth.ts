// OpenRouter OAuth PKCE utilities
import {
  getCodeVerifier,
  setCodeVerifier,
  clearCodeVerifier,
  getApiKey,
  setApiKey,
  clearAuthData,
  isAuthenticated as isAuthenticatedStorage,
} from "./storage";

/**
 * Generates a random code verifier for PKCE
 */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
}

/**
 * Creates SHA-256 code challenge from verifier
 */
export async function createCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64URLEncode(new Uint8Array(hash));
}

/**
 * Base64 URL encoding helper
 */
function base64URLEncode(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...buffer));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Initiates OpenRouter OAuth flow
 */
export async function initiateOpenRouterAuth() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await createCodeChallenge(codeVerifier);

  // Store verifier in session storage for later use
  setCodeVerifier(codeVerifier);

  // Construct OAuth URL
  const callbackUrl =
    process.env.NODE_ENV === "production"
      ? `${window.location.origin}/auth/openrouter/callback`
      : "http://localhost:3000/auth/openrouter/callback";

  const authUrl = `https://openrouter.ai/auth?callback_url=${encodeURIComponent(
    callbackUrl,
  )}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  // Redirect to OpenRouter
  window.location.href = authUrl;
}

/**
 * Exchanges authorization code for API key
 */
export async function exchangeCodeForKey(
  code: string,
): Promise<{ key: string } | { error: string }> {
  const codeVerifier = getCodeVerifier();

  if (!codeVerifier) {
    return {
      error: "No code verifier found. Please restart the sign-in flow.",
    };
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/auth/keys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        code_verifier: codeVerifier,
        code_challenge_method: "S256",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error:
          errorData.error?.message ||
          `Authentication failed: ${response.status}`,
      };
    }

    const data = await response.json();

    // Clean up verifier
    clearCodeVerifier();

    // Store API key
    setApiKey(data.key);

    return { key: data.key };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Gets stored API key
 */
export function getStoredApiKey(): string | null {
  return getApiKey();
}

/**
 * Clears stored API key (sign out)
 */
export function clearStoredApiKey(): void {
  clearAuthData();
}

/**
 * Checks if user is authenticated
 */
export function isAuthenticated(): boolean {
  return isAuthenticatedStorage();
}
