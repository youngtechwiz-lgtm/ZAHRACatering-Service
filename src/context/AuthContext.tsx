import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Profile } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check demo session from localStorage if Supabase is not connected
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        if (!isSupabaseConfigured) {
          const storedDemoAdmin = localStorage.getItem('zahra_demo_admin_auth');
          if (storedDemoAdmin === 'true') {
            setIsAdmin(true);
            setUser({
              id: 'demo-admin-id',
              email: 'admin@zahracatering.com',
              app_metadata: {},
              user_metadata: { full_name: 'Zahra Administrator (Demo)' },
              aud: 'authenticated',
              created_at: new Date().toISOString(),
            } as User);
            setProfile({
              id: 'demo-admin-id',
              email: 'admin@zahracatering.com',
              full_name: 'Zahra Administrator',
              avatar_url: null,
              role: 'admin',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          }
          if (isMounted) setIsLoading(false);
          return;
        }

        // Get initial session from Supabase
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          if (initialSession?.user) {
            await fetchProfile(initialSession.user.id);
          } else {
            setIsLoading(false);
          }
        }

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, newSession) => {
            if (!isMounted) return;
            setSession(newSession);
            setUser(newSession?.user ?? null);
            if (newSession?.user) {
              await fetchProfile(newSession.user.id);
            } else {
              setProfile(null);
              setIsAdmin(false);
              setIsLoading(false);
            }
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (isMounted) setIsLoading(false);
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        const prof = data as Profile;
        setProfile(prof);
        setIsAdmin(prof.role === 'admin');
      } else {
        // Fallback: If user is authenticated in Supabase, treat as admin for initial setup
        setIsAdmin(true);
      }
    } catch (err) {
      console.warn('Profile fetch warning:', err);
      setIsAdmin(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string): Promise<{ error: Error | null }> {
    setIsLoading(true);
    try {
      if (!isSupabaseConfigured) {
        // Demo mode credentials check
        if (email.toLowerCase().includes('admin') || password === 'admin123' || password.length >= 6) {
          localStorage.setItem('zahra_demo_admin_auth', 'true');
          setIsAdmin(true);
          setUser({
            id: 'demo-admin-id',
            email,
            app_metadata: {},
            user_metadata: { full_name: 'Zahra Administrator' },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          } as User);
          setProfile({
            id: 'demo-admin-id',
            email,
            full_name: 'Zahra Administrator',
            avatar_url: null,
            role: 'admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
          setIsLoading(false);
          return { error: null };
        } else {
          setIsLoading(false);
          return { error: new Error('Invalid demo credentials. Use admin@zahracatering.com and admin123') };
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        return { error };
      }

      if (data.user) {
        await fetchProfile(data.user.id);
      }

      return { error: null };
    } catch (err) {
      setIsLoading(false);
      return { error: err as Error };
    }
  }

  async function logout(): Promise<void> {
    setIsLoading(true);
    localStorage.removeItem('zahra_demo_admin_auth');
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
    setIsLoading(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAdmin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
