import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import nookies from "nookies"
import { useUserStore } from "../store/user"
import useDependentStore from "@/store/dependents"
import api from "@/api/axiosInstance"

const SignOut: React.FC = () => {
  const router = useRouter()
  const { clearDependents } = useDependentStore()
  const [message, setMessage] = useState("")

  // Zustand actions
  const logout = useUserStore((state) => state.logout)
  const setUserId = useUserStore((state) => state.setUserId)

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const cookies = nookies.get(null)
        const refreshToken = cookies.refreshToken

        if (refreshToken) {
          const encodedToken = encodeURIComponent(refreshToken)
          const response = await api.post(
            `User/Logout?refreshToken=${encodedToken}`,
          )
          console.log("Logout Response:", response.data)
          setMessage(response.data) // Show message like "Logged Out Successfully."
        }
      } catch (error) {
        console.error("Logout API error:", error)
      } finally {
        // Clear Zustand state
        logout()
        setUserId(null)

        // Clear dependent state
        clearDependents()

        // Destroy cookies
        nookies.destroy(null, "token", { path: "/" })
        nookies.destroy(null, "refreshToken", { path: "/" })
        nookies.destroy(null, "userId", { path: "/" })
        // Wait a moment, then redirect
        setTimeout(() => {
          router.replace("/signin")
        }, 500) // Adjust delay as needed
      }
    }

    handleLogout()
  }, [logout, setUserId, clearDependents, router])

  return (
    <div className="flex items-center justify-center min-h-screen text-lg font-medium text-gray-700">
      {message && <p>{message}</p>}
    </div>
  )
}

export default SignOut
