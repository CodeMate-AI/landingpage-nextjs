"use client";

const TOKEN_KEY = "codemate_admin_token";
let isRedirectingToLogin = false;

// Retrieves the stored admin Bearer token from localStorage
export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

// Stores the admin Bearer token in localStorage
export function setAdminToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
}

// Clears the admin Bearer token from localStorage
export function clearAdminToken(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

// Validates that the destination URL is relative or same-origin to prevent leaking tokens to third-party endpoints
function isInternalOrAdminApiUrl(input: string | URL | Request): boolean {
  if (typeof input === "string") {
    if (input.startsWith("/")) return true;
    try {
      const url = new URL(input);
      if (typeof window !== "undefined" && url.origin === window.location.origin) {
        return true;
      }
    } catch {
      return false;
    }
  } else if (input instanceof URL) {
    if (typeof window !== "undefined" && input.origin === window.location.origin) {
      return true;
    }
  } else if (input instanceof Request) {
    try {
      const url = new URL(input.url);
      if (typeof window !== "undefined" && url.origin === window.location.origin) {
        return true;
      }
    } catch {
      return false;
    }
  }
  return false;
}

// Custom authenticated fetch wrapper for admin API endpoints
export async function adminFetch(
  input: string | URL | Request,
  init?: RequestInit
): Promise<Response> {
  const token = getAdminToken();
  const headers = new Headers(init?.headers || {});

  // 1. Inject Authorization header ONLY if target is internal/same-origin, token exists, and not already set
  if (token && !headers.has("Authorization") && isInternalOrAdminApiUrl(input)) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // 2. Set JSON content-type if body is a plain string/object and not FormData
  const isFormData = init?.body instanceof FormData;
  if (!isFormData && !headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  // 3. Handle 401 Unauthorized: clear credentials and debounced redirect to login
  // Note: 403 Forbidden is treated as permission rejection without clearing session
  if (response.status === 401) {
    clearAdminToken();
    if (typeof window !== "undefined" && !isRedirectingToLogin) {
      isRedirectingToLogin = true;
      // Delay navigation slightly to let ongoing callers handle the rejection
      setTimeout(() => {
        if (window.location.pathname !== "/admin/login") {
          window.location.href = "/admin/login";
        }
        isRedirectingToLogin = false;
      }, 100);
    }
  }

  return response;
}
