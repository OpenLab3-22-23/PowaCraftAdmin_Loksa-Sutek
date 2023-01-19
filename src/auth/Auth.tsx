import { AuthError, AuthResponse, Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

interface AuthObject {
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<{ error: AuthError | null }>;
  session: Session | null;
}

const AuthContext = createContext<AuthObject>(null);

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  const auth: AuthObject = {
    signUp: (email, password) => supabase.auth.signUp({ email, password }),
    signIn: (email, password) =>
      supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
    session,
  };

  return (
    <AuthContext.Provider value={auth}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthObject => {
  return useContext(AuthContext);
};
