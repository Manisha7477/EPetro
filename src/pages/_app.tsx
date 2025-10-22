import { AppProps } from "next/app"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { AuthProvider } from "@/contexts/auth"
import "../styles/globals.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [render, setRender] = useState(false)
  const PUBLIC_ROUTES = ["/signin", "/forgot-password", "/reset-password"]

  useEffect(() => setRender(true), [])

  if (!render) return null

  const isPublicRoute = PUBLIC_ROUTES.includes(router.pathname)

  return (
    <div className="min-h-screen h-full">
      {!isPublicRoute ? (
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      ) : (
        <Component {...pageProps} />
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}
export default MyApp