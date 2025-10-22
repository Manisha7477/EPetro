import { useState } from "react"
import nookies from "nookies"
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik"
import { useRouter } from "next/router"
import * as Yup from "yup"

import Loading from "@/navigation/Loading"
import api from "../api/axiosInstance"
import { useUserStore } from "../store/user"

const SignInForm: React.FunctionComponent = () => {
  const router = useRouter()
  const [loginErrorMessage, setLoginErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const onSignIn = async (signInValues: FormikValues) => {
    setLoading(true)
    setLoginErrorMessage("") // Reset old error

    try {
      const response = await api.post("/User/UserLogin", {
        userName: signInValues.email,
        password: signInValues.password,
      })

      const { accessToken, refreshToken, userId } = response.data

      // Set tokens
      nookies.set(null, "token", accessToken, {
        path: "/",
        maxAge: 60 * 15, // 15 minutes
      })
      nookies.set(null, "refreshToken", refreshToken, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
      nookies.set(null, "userId", userId.toString(), {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })

      // Update global store
      useUserStore.getState().login(accessToken, refreshToken)

      // Wait briefly to ensure cookies are set
      await new Promise((res) => setTimeout(res, 50))

      router.push("/")
    } catch (error: any) {
      setLoginErrorMessage(
        error?.response?.data?.message || "Invalid email or password.",
      )
    } finally {
      // Slight delay to prevent UI flicker
      setTimeout(() => setLoading(false), 200)
    }
  }

  return (
    <div className="">
      {/* Logo Section */}
      <div className="w-[30vw] pl-5 flex justify-center items-center gap-2 mb-3">
        <img
          src="/assets/images/HSA-Logo.svg"
          className="h-[10vh] cursor-pointer"
          alt="ems"
        />
        <div className="border-l-4 mx-3 p-1 h-16 rounded-sm border-[#FFCB05]"></div>
        <img
          src="/assets/images/Elitia-EMS.svg"
          className="h-[12vh] cursor-pointer self-end"
          alt="ems"
        />
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-lg shadow-2xl px-[6%] py-8 w-full">
        {loading && <Loading color="text-base-100" />}
        {loginErrorMessage && (
          <div className="text-error text-sm text-left mb-4">
            {loginErrorMessage}
          </div>
        )}

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={Yup.object({
            email: Yup.string()
              .required("Username or Email is required.")
              .test(
                "is-valid-username-or-email",
                "Enter a valid Username or Email Id.",
                (value) => {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                  const usernameRegex = /^[a-zA-Z0-9_]+$/
                  return emailRegex.test(value!) || usernameRegex.test(value!)
                },
              ),
            password: Yup.string().required("Password is required."),
          })}
          onSubmit={(values, { setSubmitting }) => {
            onSignIn(values)
            setSubmitting(false)
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Email Field */}
              <div className="mb-6">
                <label className="block text-gray-700 text-md font-bold mb-1">
                  Email ID
                </label>
                <Field
                  // autoFocus
                  type="text"
                  name="email"
                  placeholder="Enter Email ID"
                  className="px-3 w-full py-2 border-2 text-sm font-semibold border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0800a7]"
                  disabled={isSubmitting || loading}
                />
                <div className="text-error text-sm mt-1">
                  <ErrorMessage name="email" />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <label className="block text-gray-700 text-md font-bold mb-1">
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  className="px-3 w-full py-2 border-2 text-sm font-semibold border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0800a7]"
                  disabled={isSubmitting || loading}
                />
                <div className="text-error text-sm mt-1">
                  <ErrorMessage name="password" />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <button
                  type="submit"
                  className="btn btn-warning w-full sm:w-1/2"
                  disabled={isSubmitting || loading}
                >
                  {loading ? "Logging In..." : "Log In"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost text-[#0800a7] w-full sm:w-1/2"
                  // onClick={() => alert("Redirect to Forgot Password page")}
                  onClick={() => router.push("/forgot-password")}
                  // onClick={() => router.push("/reset-password")}
                  disabled={isSubmitting || loading}
                >
                  Forgot Password?
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default SignInForm

// import { useState } from "react"
// import nookies from "nookies"
// import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik"
// import { useRouter } from "next/router"
// import * as Yup from "yup"

// import Loading from "@/navigation/Loading"
// import api from "../api/axiosInstance"
// import { useUserStore } from "../store/user"
// interface ISignInFormProps {}

// export const SignInForm: React.FunctionComponent<ISignInFormProps> = ({}) => {
//   const router = useRouter()
//   const [loginErrorMessage, setLoginErrorMessage] = useState("")
//   const [loading, setLoading] = useState(false)

//   const onSignIn = async (signInValues: FormikValues) => {
//     setLoading(true)
//     console.log(
//       "Email=" + signInValues.email + " and pass " + signInValues.password,
//     )
//     try {
//       console.log("Before coming")
//       const response = await api.post("/User/UserLogin", {
//         userName: signInValues.email,
//         password: signInValues.password,
//       })
//       const { accessToken, refreshToken, userId } = response.data

//       nookies.set(null, "token", accessToken, {
//         path: "/",
//         maxAge: 60 * 15, // 15 minutes
//       })

//       // Set refresh token for ~7 days
//       nookies.set(null, "refreshToken", refreshToken, {
//         path: "/",
//         maxAge: 60 * 60 * 24 * 7, // 7 days
//       })

//       // Optional: userId
//       nookies.set(null, "userId", userId.toString(), {
//         path: "/",
//         maxAge: 60 * 60 * 24 * 7, // Same as refreshToken
//       })

//       useUserStore.getState().login(accessToken, refreshToken)

//       router.push("/")
//     } catch (error: any) {
//       setLoginErrorMessage(
//         error?.response?.data?.message || "Invalid email or password.",
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   // return (
//   //   <div className="w-80 items-center justify-center">
//   //     {loading && <Loading color="text-base-100" />}
//   //     {loginErrorMessage && (
//   //       <div className="text-error text-sm text-left">{loginErrorMessage}</div>
//   //     )}
//   //     <Formik
//   //       initialValues={formFieldValues}
//   //       onSubmit={(values, { setSubmitting }) => {
//   //         onSignIn(values)
//   //         setSubmitting(false)
//   //       }}
//   //     >
//   //       {({ isSubmitting }) => (
//   //         <Form>
//   //           <div className="relative">
//   //             <div className="form-control">
//   //               <Field
//   //                 type="email"
//   //                 name="email"
//   //                 placeholder="Email Id"
//   //                 className="input input-sm input-bordered w-full"
//   //               />
//   //               <div className="text-error text-sm text-left">
//   //                 <ErrorMessage name="email" />
//   //               </div>
//   //             </div>
//   //             <div className="form-control">
//   //               <Field
//   //                 type="password"
//   //                 name="password"
//   //                 placeholder="Password"
//   //                 className="input input-sm input-bordered w-full"
//   //               />
//   //               <div className="text-error text-sm text-left">
//   //                 <ErrorMessage name="password" />
//   //               </div>
//   //             </div>
//   //             <div className="flex flex-col sm:flex-row gap-2 my-2">
//   //               <div className="w-full text-left">
//   //                 <button
//   //                   type="submit"
//   //                   className="btn btn-sm btn-warning w-full"
//   //                   disabled={isSubmitting}
//   //                 >
//   //                   Log In
//   //                 </button>
//   //               </div>
//   //               <div className="flex-shrink-0">
//   //                 <button
//   //                   type="button"
//   //                   className="btn btn-sm btn-warning w-full"
//   //                   disabled={isSubmitting}
//   //                 >
//   //                   Forget Password
//   //                 </button>
//   //               </div>
//   //             </div>
//   //           </div>
//   //         </Form>
//   //       )}
//   //     </Formik>
//   //   </div>
//   // )
//   return (
//     <div className="">
//       {/* Logo Section */}
//       <div className="w-[30vw] pl-5 flex justify-center items-center gap-2 mb-3">
//         <img
//           src="/assets/images/HSA-Logo.svg"
//           className="h-[10vh] cursor-pointer"
//           alt="ems"
//         />
//         <div className="border-l-4 mx-3 p-1 h-16 rounded-sm border-[#FFCB05]"></div>
//         <img
//           src="/assets/images/Elitia-EMS.svg"
//           className="h-[12vh] cursor-pointer self-end"
//           alt="ems"
//         />
//       </div>
//       {/* Form Container */}
//       <div className="bg-white rounded-lg shadow-2xl px-[6%] py-8 w-full">
//         {loading && <Loading color="text-base-100" />}
//         {loginErrorMessage && (
//           <div className="text-error text-sm text-left mb-4">
//             {loginErrorMessage}
//           </div>
//         )}
//         <Formik
//           initialValues={{ email: "", password: "" }}
//           validationSchema={Yup.object({
//             email: Yup.string()
//               .required("Username or Email is required.")
//               .test(
//                 "is-valid-username-or-email",
//                 "Enter a valid Username or Email Id.",
//                 (value) => {
//                   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//                   const usernameRegex = /^[a-zA-Z0-9_]+$/
//                   return emailRegex.test(value!) || usernameRegex.test(value!)
//                 },
//               ),
//             password: Yup.string().required("Password is required."),
//           })}
//           onSubmit={(values, { setSubmitting }) => {
//             onSignIn(values)
//             setSubmitting(false)
//           }}
//         >
//           {({ isSubmitting }) => (
//             <Form>
//               {/* Email Field */}
//               <div className="mb-6">
//                 <label className="block text-gray-700 text-md font-bold mb-1">
//                   Email ID
//                 </label>
//                 <Field
//                   type="text"
//                   name="email"
//                   placeholder="Enter Email ID"
//                   className="px-3 w-full py-2 border-2 text-sm font-semibold border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0800a7]"
//                   disabled={isSubmitting}
//                 />
//                 <div className="text-error text-sm mt-1">
//                   <ErrorMessage name="email" />
//                 </div>
//               </div>
//               {/* Password Field */}
//               <div className="mb-6">
//                 <label className="block text-gray-700 text-md font-bold mb-1">
//                   Password
//                 </label>
//                 <Field
//                   type="password"
//                   name="password"
//                   placeholder="Enter Password"
//                   className="px-3 w-full py-2 border-2 text-sm font-semibold border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0800a7]"
//                   disabled={isSubmitting}
//                 />
//                 <div className="text-error text-sm mt-1">
//                   <ErrorMessage name="password" />
//                 </div>
//               </div>
//               {/* Buttons */}
//               <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
//                 <button
//                   type="submit"
//                   className="btn btn-warning w-full sm:w-1/2"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? "Logging In..." : "Log In"}
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-ghost text-[#0800a7] w-full sm:w-1/2"
//                   onClick={() => alert("Redirect to Forgot Password page")}
//                   disabled={isSubmitting}
//                 >
//                   Forgot Password?
//                 </button>
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   )
// }

// export default SignInForm

// import { useEffect, useState } from "react"
// import nookies from "nookies"
// import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik"
// import { useRouter } from "next/router"
// import Loading from "@/navigation/Loading"
// import axios from "axios"
// import * as Yup from "yup"
// interface ISignInFormProps {}
// type IFormField = {
//   username: string
//   password: string
// }
// export const SignInForm: React.FunctionComponent<ISignInFormProps> = ({}) => {
//   const router = useRouter()
//   const [loginErrorMessage, setLoginErrorMessage] = useState("")
//   const [loading, setLoading] = useState(false)
//   let token = nookies.get(null).accessToken || ""
//   const [currentTime, setCurrentTime] = useState(() => {
//     const savedTime = localStorage.getItem("currentTime")
//     return savedTime ? parseInt(savedTime, 10) : 0
//   })
//   const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
//   const [userLoginTimeInSeconds, setUserLoginTimeInSeconds] = useState(0)
//   const [timeDiff, setTimeDiff] = useState(0)
//   const [validityInSec, setValidityInSec] = useState(0)
//   const [refreshTokenValidityInSec, setRefreshTokenValidityInSec] = useState(0)
//   const [redirected, setRedirected] = useState(false)
//   const [sessionExpired, setSessionExpired] = useState(false)
//   const formFieldValues: IFormField = {
//     username: "",
//     password: "",
//   }
//   // Refresh token when access token expires and refresh token is still valid
//   // This effect runs every second to update the current time and check token validity
//   useEffect(() => {
//     const updateCurrentTime = async () => {
//       console.log("Coming inside updateCurrentTime in signin form")
//       const date = new Date()
//       const totalSeconds = Math.floor(date.getTime() / 1000)
//       setCurrentTime(totalSeconds)
//       localStorage.setItem("currentTime", totalSeconds.toString())
//       if (userLoginTimeInSeconds > 0 && validityInSec > 0) {
//         const timeDiff = totalSeconds - userLoginTimeInSeconds
//         setTimeDiff(timeDiff)
//         const refreshToken = nookies.get(null).refreshToken || ""
//         if (
//           timeDiff >= validityInSec &&
//           timeDiff <= refreshTokenValidityInSec
//         ) {
//           try {
//             const response = await axios.post(
//               `${process.env.NEXT_PUBLIC_API_URL}/User/RefreshToken`,
//               { refreshToken },
//             )

//             const data = response.data
//             if (data && data.accessToken && data.refreshToken) {
//               const newAccessTokenExpiry = Math.floor(
//                 new Date(data.accessTokenExpTime).getTime() / 1000,
//               )
//               const newRefreshTokenExpiry = Math.floor(
//                 new Date(data.refreshTokenExpTime).getTime() / 1000,
//               )
//               const nowInSeconds = Math.floor(Date.now() / 1000)

//               const newAccessTokenValidity = newAccessTokenExpiry - nowInSeconds
//               const newRefreshTokenValidity =
//                 newRefreshTokenExpiry - nowInSeconds

//               // Update states
//               setUserLoginTimeInSeconds(nowInSeconds)
//               setValidityInSec(newAccessTokenValidity)
//               setRefreshTokenValidityInSec(newRefreshTokenValidity)
//               setTimeDiff(0)

//               // Update cookies
//               nookies.set(null, "accessToken", data.accessToken, { path: "/" })
//               nookies.set(null, "refreshToken", data.refreshToken, {
//                 path: "/",
//               })
//             } else {
//               throw new Error("Invalid refresh response")
//             }
//           } catch (error) {
//             console.error("Refresh token failed:", error)
//             setSessionExpired(true)
//             handleLogout()
//           }
//         }

//         if (timeDiff > refreshTokenValidityInSec && !redirected) {
//           // Both tokens expired
//           setSessionExpired(true)
//           handleLogout()
//         }
//       }
//     }
//     console.log("Coming inside line 98 , in signin form")
//     const interval = setInterval(updateCurrentTime, 1000)
//     setIntervalId(interval)

//     return () => {
//       if (interval) clearInterval(interval)
//     }
//   }, [
//     userLoginTimeInSeconds,
//     validityInSec,
//     refreshTokenValidityInSec,
//     redirected,
//   ])

//   const handleLogout = () => {
//     nookies.destroy(null, "accessToken")
//     nookies.destroy(null, "refreshToken")
//     nookies.destroy(null, "userId")
//     nookies.destroy(null, "userEmail")
//     nookies.destroy(null, "userName")
//     nookies.destroy(null, "menuDetails")
//     localStorage.clear()
//     setRedirected(true)
//     router.push("/signin")
//   }

//   // ---Signin Function---
//   const onSignIn = async (signInValues: FormikValues) => {
//     setLoading(true)
//     const { email, password } = signInValues
//     if (email && password) {
//       try {
//         const response = await axios.post(
//           `${process.env.NEXT_PUBLIC_API_URL}/User/UserLogin`,
//           {
//             userName: email,
//             password: password,
//           },
//         )
//         const data = response.data
//         if (data && data.accessToken && data.refreshToken) {
//           const accessTokenExpiry = Math.floor(
//             new Date(data.accessTokenExpTime).getTime() / 1000,
//           )
//           const refreshTokenExpiry = Math.floor(
//             new Date(data.refreshTokenExpTime).getTime() / 1000,
//           )
//           const currentTimeInSeconds = Math.floor(Date.now() / 1000)

//           // Calculate validity durations in seconds
//           const accessTokenValidity = accessTokenExpiry - currentTimeInSeconds
//           const refreshTokenValidity = refreshTokenExpiry - currentTimeInSeconds

//           // Save tokens and session details
//           setUserLoginTimeInSeconds(currentTimeInSeconds)
//           setValidityInSec(accessTokenValidity)
//           setRefreshTokenValidityInSec(refreshTokenValidity)

//           console.log("currentTimeInSeconds:", currentTimeInSeconds)
//           console.log("Access Token Validity: ", accessTokenValidity)
//           console.log("Refresh Token Validity: ", refreshTokenValidity)

//           localStorage.setItem("currentTime", currentTimeInSeconds.toString())
//           localStorage.setItem(
//             "menuDetails",
//             JSON.stringify(data.menuSubMenuDetails),
//           ) // ✅ storing menuSubMenuDetails
//           nookies.set(null, "accessToken", data.accessToken, { path: "/" })
//           nookies.set(null, "refreshToken", data.refreshToken, { path: "/" })
//           nookies.set(null, "userId", String(data.userId), { path: "/" })
//           nookies.set(null, "userEmail", data.emailAddress, { path: "/" })
//           nookies.set(null, "userName", `${data.firstName} ${data.lastName}`, {
//             path: "/",
//           })
//           nookies.set(
//             null,
//             "menuDetails",
//             JSON.stringify(data.menuSubMenuDetails),
//             { path: "/" },
//           )
//           // Redirect to home page
//           router.push("/")
//         } else {
//           setLoginErrorMessage(
//             "Invalid response from server. Please try again.",
//           )
//         }
//       } catch (error) {
//         setLoginErrorMessage(
//           "Error occurred while logging in. Please try again later.",
//         )
//       }
//     } else {
//       setLoginErrorMessage("Both Email and Password are required.")
//     }
//     setLoading(false)
//   }
//   return (
//     <div className="">
//       {/* Logo Section */}
//       <div className="w-[30vw] pl-5 flex justify-center items-center gap-2 mb-3">
//         <img
//           src="/assets/images/HSA-Logo.svg"
//           className="h-[10vh] cursor-pointer"
//           alt="ems"
//         />
//         <div className="border-l-4 mx-3 p-1 h-16 rounded-sm border-[#FFCB05]"></div>
//         <img
//           src="/assets/images/Elitia-EMS.svg"
//           className="h-[12vh] cursor-pointer self-end"
//           alt="ems"
//         />
//       </div>
//       {/* Form Container */}
//       <div className="bg-white rounded-lg shadow-2xl px-[6%] py-8 w-full">
//         {loading && <Loading color="text-base-100" />}
//         {loginErrorMessage && (
//           <div className="text-error text-sm text-left mb-4">
//             {loginErrorMessage}
//           </div>
//         )}
//         <Formik
//           initialValues={{ email: "", password: "" }}
//           validationSchema={Yup.object({
//             email: Yup.string()
//               .required("Username or Email is required.")
//               .test(
//                 "is-valid-username-or-email",
//                 "Enter a valid Username or Email Id.",
//                 (value) => {
//                   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//                   const usernameRegex = /^[a-zA-Z0-9_]+$/
//                   return emailRegex.test(value!) || usernameRegex.test(value!)
//                 },
//               ),
//             password: Yup.string().required("Password is required."),
//           })}
//           onSubmit={(values, { setSubmitting }) => {
//             onSignIn(values)
//             setSubmitting(false)
//           }}
//         >
//           {({ isSubmitting }) => (
//             <Form>
//               {/* Email Field */}
//               <div className="mb-6">
//                 <label className="block text-gray-700 text-md font-bold mb-1">
//                   Email ID
//                 </label>
//                 <Field
//                   type="text"
//                   name="email"
//                   placeholder="Enter Email ID"
//                   className="px-3 w-full py-2 border-2 text-sm font-semibold border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0800a7]"
//                   disabled={isSubmitting}
//                 />
//                 <div className="text-error text-sm mt-1">
//                   <ErrorMessage name="email" />
//                 </div>
//               </div>
//               {/* Password Field */}
//               <div className="mb-6">
//                 <label className="block text-gray-700 text-md font-bold mb-1">
//                   Password
//                 </label>
//                 <Field
//                   type="password"
//                   name="password"
//                   placeholder="Enter Password"
//                   className="px-3 w-full py-2 border-2 text-sm font-semibold border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0800a7]"
//                   disabled={isSubmitting}
//                 />
//                 <div className="text-error text-sm mt-1">
//                   <ErrorMessage name="password" />
//                 </div>
//               </div>
//               {/* Buttons */}
//               <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
//                 <button
//                   type="submit"
//                   className="btn btn-warning w-full sm:w-1/2"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? "Logging In..." : "Log In"}
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-ghost text-[#0800a7] w-full sm:w-1/2"
//                   onClick={() => alert("Redirect to Forgot Password page")}
//                   disabled={isSubmitting}
//                 >
//                   Forgot Password?
//                 </button>
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   )
// }
// export default SignInForm
