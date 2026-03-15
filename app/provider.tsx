"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/configs/supaconfig"
import axios from "axios"

interface AuthContextType {
  user: any | null
}

export const AuthContext = createContext<AuthContextType | null>(null)

function Provider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {

    const CheckUser = async (user: any) => {
      try {
        await axios.post('/api/user', {
          userEmail: user?.email,
          userName: user?.user_metadata?.full_name || user?.email?.split('@')[0]
        });
      } catch (err) {
        console.error("Error checking/creating user:", err);
      }
    };

    // get current user
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      if (data.user) {
        CheckUser(data.user);
      }
    }

    getUser()

    // listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          CheckUser(session?.user);
        }
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }

  }, [])

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuthContext must be used within Provider")
  }

  return context
}

export default Provider