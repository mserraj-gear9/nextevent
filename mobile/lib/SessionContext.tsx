import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabase/supabase';

type Context = { session: Session | null; loading: boolean; user: any };
const AuthContext = createContext<Context>({ session: null, loading: true, user: null });

export function SessionContextProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchUser(session.user.id);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) fetchUser(session.user.id);
      else setUser(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function fetchUser(id: string) {
    const { data } = await supabase.from('users').select('*').eq('id', id).single();
    setUser(data);
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
