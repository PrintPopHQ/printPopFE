/**
 * Auth store — thin wrapper around localStorage for persisting the
 * authenticated user, access token, and a guest email captured at cart-time.
 */

const USER_KEY = "printpop_user";
const TOKEN_KEY = "printpop_access_token";
const GUEST_EMAIL_KEY = "printpop_guest_email";

export interface StoredUser {
  id: string;
  email: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  full_name?: string;
  phone?: string;
  profile_pic?: string;
}

// ─── User (after login) ───────────────────────────────────────────────────────

export function saveUser(user: StoredUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("auth_updated"));
}

export function getUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function removeUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("auth_updated"));
}

export function isLoggedIn(): boolean {
  return getUser() !== null;
}

// ─── Access token ─────────────────────────────────────────────────────────────

export function saveAccessToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function removeAccessToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

// ─── Guest email (captured at add-to-cart for first item) ────────────────────

export function saveGuestEmail(email: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_EMAIL_KEY, email);
}

export function getGuestEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(GUEST_EMAIL_KEY);
}
