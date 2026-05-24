"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabaseAnon } from "@/lib/supabase/client";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: "customer" | "partner" | "contractor" | string;
  avatar?: string;
  rewards: number;
  joinedDate: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchProfile = async (session: any) => {
    if (!session?.user) {
      setUser(null);
      setIsLoggedIn(false);
      return;
    }

    try {
      const { data: customerData, error } = await supabaseAnon
        .from("customers")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (customerData && !error) {
        setUser({
          id: session.user.id,
          name: `${customerData.first_name} ${customerData.last_name}`,
          email: session.user.email || "",
          phone: customerData.phone || "",
          userType: (customerData.customer_type || "RESIDENTIAL").toLowerCase(),
          rewards: 0, // Placeholder
          joinedDate: customerData.created_at,
        });
        setIsLoggedIn(true);
      } else {
        // Fallback if customer profile hasn't been created yet
        setUser({
          id: session.user.id,
          name: session.user.email?.split("@")[0] || "User",
          email: session.user.email || "",
          phone: "",
          userType: "customer",
          rewards: 0,
          joinedDate: new Date().toISOString(),
        });
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.error("Failed to fetch customer profile:", err);
    }
  };

  useEffect(() => {
    // Initial fetch
    supabaseAnon.auth.getSession().then(({ data: { session } }) => {
      fetchProfile(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabaseAnon.auth.onAuthStateChange((_event, session) => {
      fetchProfile(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    const { data } = await supabaseAnon.auth.getSession();
    await fetchProfile(data.session);
  };

  const login = (userData: User) => {
    // Left for backwards compatibility if needed, but Supabase handles real login
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await supabaseAnon.auth.signOut();
    setUser(null);
    setIsLoggedIn(false);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, updateUser, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
