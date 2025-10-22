import { createContext, useContext, useEffect, useState } from "react"
import { GetServerSidePropsContext } from "next"
import { useRouter } from "next/router"
import nookies from "nookies"
import { useUserStore } from "../store/user"
import { IUser } from "@/utils/types"
// import { userDatabase } from "@/utils/AppConfig"
import api from "../api/axiosInstance"

const AuthContext = createContext<{ user: IUser | null; loading: boolean }>({
  user: null,
  loading: true,
})

export function AuthProvider(
  { children }: any,
  ctx: GetServerSidePropsContext,
) {
  // const {user : newUser } = useUserStore();
  // const {userId} = useUserStore();
  const router = useRouter()
  const [user, setUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const setUserStore = useUserStore((state) => state.setUser)

  // const token = nookies.get(ctx).token || ""
  const token = nookies.get(null).token
  const userId = nookies.get(null).userId

  const userAuthDetails = async () => {
    // console.log("Checking token "+token)

    if (token) {
      try {
        console.log("Checking userId " + userId)
        // const res = await api.get('/User/GetAllUserDetails_Id');
        const res = await api.get("/User/GetAllUserDetails_Id", {
          params: { userId: userId },
        })
        console.log("Response data coming is " + res.data)
        // console.log("response coming in auth.tsx is  "+JSON.stringify(res,null,2))
        const user = res.data[0]
        // console.log("data coming in auth.tsx "+JSON.stringify(res,null,2))
        console.log("user coming is " + user)
        console.log("user coming is " + JSON.stringify(user, null, 2))
        setUserStore(user)
        setUser(user)
      } catch (error) {
        console.error("Failed to fetch user:", error)
        setUserStore(null)
        setUser(null)
        nookies.destroy(null, "token")
        nookies.destroy(null, "refreshToken")
        router.push("/signin")
      }
    } else {
      setUserStore(null)
      setUser(null)
      nookies.destroy(null, "token")
      nookies.destroy(null, "refreshToken")
      router.push("/signin")
    }

    setLoading(false)
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).nookies = nookies
    }
    userAuthDetails()
  }, [token])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
