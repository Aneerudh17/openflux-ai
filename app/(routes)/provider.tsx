"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/configs/supaconfig"

import { SidebarProvider } from "@/components/ui/sidebar"
import AppHeader from "../_components/AppHeader"
import { AppSidebar } from "../_components/AppSidebar"

function DashboardProvider({
  children,
}: {
  children: React.ReactNode
}) {

  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.replace("/")
      } else {
        setLoading(false)
      }
    }

    checkUser()

  }, [router])


  if (loading) return null


  return (
    <SidebarProvider>

      <AppSidebar />

      <main className="w-full">
        <AppHeader />

        <div className="p-10">
          {children}
        </div>

      </main>

    </SidebarProvider>
  )
}

export default DashboardProvider