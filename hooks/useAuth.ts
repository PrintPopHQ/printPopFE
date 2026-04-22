"use client";

import { useState, useEffect } from "react";
import { getUser, isLoggedIn, getAccessToken, StoredUser } from "@/lib/auth-store";

export function useAuth() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const updateAuth = () => {
      setUser(getUser());
      setSignedIn(isLoggedIn());
      setToken(getAccessToken());
      setIsLoaded(true);
    };

    // Initial check
    updateAuth();

    window.addEventListener("auth_updated", updateAuth);
    return () => {
      window.removeEventListener("auth_updated", updateAuth);
    };
  }, []);

  return { user, signedIn, token, isLoaded };
}
