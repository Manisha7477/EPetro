import axios from "axios"

import Router from "next/router"
import nookies from "nookies"

//  Step 1: Define public routes
const PUBLIC_ROUTES = ["/signin", "/forgot-password", "/reset-password" , "/user-register"]

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

// ✅ Step 2: Updated redirect function
const redirectToSignIn = () => {
  if (typeof window !== "undefined") {
    // Use window.location.pathname, fallback empty string
    const path = window.location?.pathname || ""

    // Skip redirect if current page is public
    if (PUBLIC_ROUTES.includes(path)) return
    setTimeout(() => {
      Router.replace("/signin")
    }, 500)
  }
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

//  Set Authorization from cookie at creation time (optional, for SSR)
const { token } = nookies.get(null)
if (token) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

//  Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const { token } = nookies.get(null)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

//  Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error?.response?.status
    const isLoginRequest = originalRequest?.url?.includes("/User/UserLogin")
    const refreshToken = nookies.get(null)?.refreshToken

    // Skip all logic if current route is public
    // if (
    //   typeof window !== "undefined" &&
    //   PUBLIC_ROUTES.includes(window.location.pathname)
    // ) {
    //   return Promise.reject(error)
    // }
    if (typeof window !== "undefined") {
      const path = window.location?.pathname || ""
      if (PUBLIC_ROUTES.includes(path)) {
        return Promise.reject(error)
      }
    }
    console.log("Interceptor caught error", {
      url: originalRequest?.url,
      status,
      retry: originalRequest._retry,
    })

    //  Skip refresh on login API
    if (status === 401 && !isLoginRequest) {
      if (!originalRequest._retry && refreshToken) {
        originalRequest._retry = true

        //  Queue requests if already refreshing
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`
                resolve(axiosInstance(originalRequest))
              },
              reject: (err: any) => reject(err),
            })
          })
        }

        isRefreshing = true

        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/User/refresh-token`,
            { refreshToken },
          )

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            res.data

          // Save new tokens
          nookies.set(null, "token", newAccessToken, {
            path: "/",
            maxAge: 60 * 15,
          })
          nookies.set(null, "refreshToken", newRefreshToken, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          })

          //  Retry all queued requests
          processQueue(null, newAccessToken)

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return axiosInstance(originalRequest)
        } catch (refreshError: any) {
          console.error("Refresh token failed:", refreshError?.response?.status)

          processQueue(refreshError, null)

          nookies.destroy(null, "token")
          nookies.destroy(null, "refreshToken")
          nookies.destroy(null, "userId")

          redirectToSignIn()
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      } else {
        //  Refresh already failed or no refreshToken available
        console.warn(" No valid refresh token or retry failed. Logging out.")
        nookies.destroy(null, "token")
        nookies.destroy(null, "refreshToken")
        nookies.destroy(null, "userId")

        redirectToSignIn()
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
