"use client";

import { supabase } from "@/configs/supaconfig";
import React from "react";

export default function Authentication({ children }: { children: React.ReactNode }) {

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div onClick={loginWithGoogle} className="cursor-pointer inline-block w-full sm:w-fit">
      {children}
    </div>
  );
}