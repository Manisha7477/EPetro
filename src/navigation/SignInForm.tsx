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
    setLoginErrorMessage("") 

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
      <div className="bg-white rounded-lg shadow-2xl px-[3%] py-6 w-[30vw]">
          <div className="w-[30vw] flex justify-center items-center mb-6 -ml-5">
        <img
          src="/assets/images/companylogo.png"
          className="h-[12vh] cursor-pointer self-end"
          alt="ems"
        />
      </div>
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
              <div className="mb-4">
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
              <div className="flex flex-col sm:flex-row justify-between items-center gap-1">
                <button
                  type="submit"
                  className="btn btn-warning w-full sm:w-1/2"
                  disabled={isSubmitting || loading}
                >
                  {loading ? "Logging In..." : "Log In"}
                </button>
                <div className="flex flex-col items-center gap-2">
                  {/* <button
                    type="button"
                    className="text-[#0800a7] underline underline-offset-2 font-medium text-sm"
                    onClick={() => router.push("/user-register")}
                    disabled={isSubmitting || loading}
                  >
                    New User Register?
                  </button> */}
                  <button
                    type="button"
                    className="text-[#0800a7] underline underline-offset-2 font-medium text-sm"
                    // onClick={() => router.push("/forgot-password")}
                    disabled={isSubmitting || loading}
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
  )
}

export default SignInForm
