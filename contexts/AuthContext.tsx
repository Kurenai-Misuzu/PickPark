import { supabase } from "@/data/supabase";
import { User } from "@supabase/supabase-js";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<string | null>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    username: string
  ) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // LOGIN
  const login = async (
    email: string,
    password: string
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return error.message;
    }
    return null;
  };

  // REGISTER
  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    username: string
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return error.message;
    }
    const user = data.user;
    if (user) {
      const { error: profileError } = await supabase.from("User").insert([
        {
          user_id: user.id,
          username,
          first_name: firstName,
          last_name: lastName,
        },
      ]);
      setLoading(false);
      if (profileError) {
        setError(profileError.message);
        return profileError.message;
      }
    }
    return null;
  };

  // LOGOUT
  const logout = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signOut();
    if (error) setError(error.message);
    setLoading(false);
  };

  const value = { user, loading, error, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
