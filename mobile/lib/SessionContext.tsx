import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabase/supabase';

type Context = { session: Session | null; loading: boolean; user: any };
const AuthContext = createContext<Context>({ session: null, loading: true, user: null });

export function SessionContextProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fetchIdRef = useRef<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      if (initialSession?.user) fetchUser(initialSession.user.id);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        setUser(null);
        fetchUser(newSession.user.id);
      } else {
        fetchIdRef.current = null;
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function fetchUser(id: string) {
    fetchIdRef.current = id;
    const { data } = await supabase.from('users').select('*').eq('id', id).single();
    if (fetchIdRef.current === id) setUser(data ?? null);
  }

  return (
    <AuthContext.Provider value={{ session, loading, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSession() {
  return useContext(AuthContext);
}
