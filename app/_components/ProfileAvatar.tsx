"use client"

import { supabase } from "@/configs/supaconfig"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Button } from "@/components/ui/button"

function ProfileAvatar() {

  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => { //useeffect runs after every render, treated more like an side effects of use state, infinite loop if used wrong
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user) // updating varible memory and re-rendering component ( line 18 )
    }

    getUser()
  }, [])

  const onButtonPress = async () => {
    await supabase.auth.signOut()
    router.replace("/")
  }

  return (
    <div>
      <Popover>
        <PopoverTrigger>
          {user?.user_metadata?.avatar_url && (
            <img
              src={user.user_metadata.avatar_url}
              alt="profile"
              className="w-[35px] h-[35px] rounded-full"
            />
          )}
        </PopoverTrigger>

        <PopoverContent className="w-[120px]">
          <Button variant="ghost" onClick={onButtonPress}>
            Logout
          </Button>
        </PopoverContent>

      </Popover>
    </div>
  )
}

export default ProfileAvatar