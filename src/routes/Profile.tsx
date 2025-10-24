import { useState, useEffect } from "react"
import { IUser } from "@/utils/types"
import { Field, Formik, Form } from "formik"
import * as Yup from "yup"
import { motion, AnimatePresence } from "framer-motion"

interface IProfileProps {
  user: IUser | null
}

const Profile: React.FunctionComponent<IProfileProps> = ({ user }) => {
  const [avatar, setAvatar] = useState<string | null>(null)
  const [tempAvatar, setTempAvatar] = useState<string | null>(null)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  useEffect(() => {
    const savedAvatar = sessionStorage.getItem("avatar")
    if (savedAvatar) setAvatar(savedAvatar)
  }, [])

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setTempAvatar(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSaveAvatar = () => {
    if (tempAvatar) {
      setAvatar(tempAvatar)
      sessionStorage.setItem("avatar", tempAvatar)
      setTempAvatar(null)
    }
  }

  const handleCancelAvatar = () => setTempAvatar(null)
  const handleDeleteAvatar = () => {
    setAvatar(null)
    setTempAvatar(null)
    sessionStorage.removeItem("avatar")
  }

  const passwordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Old password is required"),
    newPassword: Yup.string()
      .min(6, "Password should be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm password is required"),
  })

  const handleSubmit = (values: any) => {
    console.log("Changing password with:", values)
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Avatar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <div className="relative w-40 h-40 group">
            {tempAvatar || avatar ? (
              <img
                src={tempAvatar || avatar!}
                alt="avatar"
                className="w-40 h-40 rounded-full object-cover shadow-xl border-4 border-primary/20 transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center text-5xl font-bold shadow-xl">
                {user?.firstName?.charAt(0)}
              </div>
            )}
            {/* Overlay for actions */}
            {tempAvatar && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3 rounded-full">
                <button
                  className="btn btn-xs btn-success"
                  onClick={handleSaveAvatar}
                >
                  Save
                </button>
                <button
                  className="btn btn-xs btn-error"
                  onClick={handleCancelAvatar}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          {/* Avatar Upload */}
          <div className="mt-5 w-full">
            <input
              type="file"
              accept="image/*"
              id="avatarUpload"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <label
              htmlFor="avatarUpload"
              className="btn btn-outline btn-sm w-full"
            >
              Change Photo
            </label>
            {avatar && (
              <button
                className="btn btn-outline btn-warning btn-sm w-full mt-2"
                onClick={handleDeleteAvatar}
              >
                Delete Photo
              </button>
            )}
          </div>
        </div>
        {/* Right Column - Profile Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
              Profile Information
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mt-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="text-lg text-gray-900">
                  {user?.firstName} {user?.lastName}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-lg text-gray-900">{user?.emailAddress}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="text-lg text-gray-900">{user?.role}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Contact Number
                </dt>
                <dd className="text-lg text-gray-900">{user?.contactNumber}</dd>
              </div>
            </dl>
          </div>
          {/* Change Password */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <button
              className="btn btn-primary mb-4"
              onClick={() => setIsChangingPassword(!isChangingPassword)}
            >
              {isChangingPassword ? "Cancel" : "Change Password"}
            </button>
            <AnimatePresence>
              {isChangingPassword && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Formik
                    initialValues={{
                      oldPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    }}
                    validationSchema={passwordSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, touched }) => (
                      <Form className="bg-gray-50 p-6 rounded-xl shadow-inner">
                        <h3 className="text-xl font-semibold mb-4">
                          Update Password
                        </h3>
                        {/* Old Password */}
                        <div className="mb-4">
                          <label
                            htmlFor="oldPassword"
                            className="block font-medium text-gray-700"
                          >
                            Old Password
                          </label>
                          <Field
                            name="oldPassword"
                            type="password"
                            className="input input-bordered w-full mt-2"
                          />
                          {errors.oldPassword && touched.oldPassword && (
                            <p className="text-error text-sm mt-1">
                              {errors.oldPassword}
                            </p>
                          )}
                        </div>
                        {/* New Password */}
                        <div className="mb-4">
                          <label
                            htmlFor="newPassword"
                            className="block font-medium text-gray-700"
                          >
                            New Password
                          </label>
                          <Field
                            name="newPassword"
                            type="password"
                            className="input input-bordered w-full mt-2"
                          />
                          {errors.newPassword && touched.newPassword && (
                            <p className="text-error text-sm mt-1">
                              {errors.newPassword}
                            </p>
                          )}
                        </div>
                        {/* Confirm Password */}
                        <div className="mb-4">
                          <label
                            htmlFor="confirmPassword"
                            className="block font-medium text-gray-700"
                          >
                            Confirm Password
                          </label>
                          <Field
                            name="confirmPassword"
                            type="password"
                            className="input input-bordered w-full mt-2"
                          />
                          {errors.confirmPassword &&
                            touched.confirmPassword && (
                              <p className="text-error text-sm mt-1">
                                {errors.confirmPassword}
                              </p>
                            )}
                        </div>
                        <div className="flex justify-end">
                          <button type="submit" className="btn btn-primary">
                            Save Changes
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
