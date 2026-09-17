import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "../api";

interface IdentityContextValue {
  identity: User | null;
  setIdentity: (user: User | null) => void;
}

const IdentityContext = createContext<IdentityContextValue | undefined>(undefined);

const STORAGE_KEY = "haven.identity";

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentityState] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (identity) localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage failures
    }
  }, [identity]);

  return (
    <IdentityContext.Provider value={{ identity, setIdentity: setIdentityState }}>
      {children}
    </IdentityContext.Provider>
  );
}

export function useIdentity() {
  const ctx = useContext(IdentityContext);
  if (!ctx) throw new Error("useIdentity must be used within an IdentityProvider");
  return ctx;
}
