/**
 * Authentication Helper for mapping Firebase Auth error codes to user-friendly messages
 * and managing detected/cached states of authentication providers.
 */

export type AuthProviderType = "password" | "google" | "anonymous";

// Cached state of provider availability to enable "pre-flight" checks
const providerStatusCache: Record<AuthProviderType, boolean> = {
  password: true, // assume enabled until proven otherwise via auth/operation-not-allowed
  google: true,
  anonymous: true
};

/**
 * Marks a provider as disabled in the current session
 */
export function disableAuthProvider(provider: AuthProviderType) {
  providerStatusCache[provider] = false;
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[AuthHelper] Auth provider '${provider}' detected as disabled in Firebase Console.`);
  }
}

/**
 * Checks if a provider is currently marked as enabled
 */
export function isAuthProviderEnabled(provider: AuthProviderType): boolean {
  return providerStatusCache[provider];
}

/**
 * Logs authentication errors in development mode but hides technical details from end users
 */
export function logAuthErrorInDev(error: any) {
  if (process.env.NODE_ENV !== "production") {
    console.error("[AuthHelper Dev Log] Detailed Authentication Error:", {
      code: error?.code,
      message: error?.message,
      stack: error?.stack,
      raw: error
    });
  }
}

/**
 * Map raw Firebase Auth errors to beautifully-styled, friendly user messages
 */
export function getFriendlyAuthErrorMessage(error: any, provider: AuthProviderType): string {
  const code = error?.code || "";
  
  // Track disabled providers dynamically
  if (code === "auth/operation-not-allowed") {
    disableAuthProvider(provider);
    if (provider === "password") {
      return "Sign-in is currently unavailable. Please contact the administrator or enable Email/Password authentication in Firebase.";
    } else if (provider === "google") {
      return "Google Sign-In is currently unavailable. Please contact the administrator or enable Google Sign-In in Firebase.";
    } else {
      return "Authentication is currently unavailable. Please enable the required sign-in method in Firebase Authentication.";
    }
  }

  switch (code) {
    case "auth/user-not-found":
    case "auth/invalid-credential":
      return "We couldn't find an account with this email address or password. Please double-check your spelling or sign up.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again or reset your password if you forgot it.";
    case "auth/email-already-in-use":
      return "An account with this email address already exists. Try signing in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address (e.g. name@example.com).";
    case "auth/too-many-requests":
      return "Too many unsuccessful attempts. Access to this account has been temporarily disabled. Please try again later.";
    case "auth/network-request-failed":
      return "A network connection error occurred. Please check your internet connection and try again.";
    default:
      // Fallback for general errors
      return error?.message || "An unexpected error occurred during authentication. Please try again.";
  }
}
