/**
 * Auth store — thin wrapper around localStorage for persisting the
 * authenticated user and a guest email captured at cart-time.
 */

const USER_KEY = "printpop_user";
const GUEST_EMAIL_KEY = "printpop_guest_email";

export interface StoredUser {
  id: string;
  email: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// ─── User (after login) ───────────────────────────────────────────────────────

export function saveUser(user: StoredUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
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
}

export function isLoggedIn(): boolean {
  return getUser() !== null;
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
