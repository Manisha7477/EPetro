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

// import { useState, useEffect } from "react"
// import { IUser } from "@/utils/types"
// import { Field, Formik, Form } from "formik"
// import * as Yup from "yup"
// import { motion, AnimatePresence } from "framer-motion"

// interface IProfileProps {
//   user: IUser | null
// }

// const Profile: React.FunctionComponent<IProfileProps> = ({ user }) => {
//   const [avatar, setAvatar] = useState<string | null>(null)
//   const [tempAvatar, setTempAvatar] = useState<string | null>(null)
//   const [isChangingPassword, setIsChangingPassword] = useState(false)

//   useEffect(() => {
//     const savedAvatar = sessionStorage.getItem("avatar")
//     if (savedAvatar) setAvatar(savedAvatar)
//   }, [])

//   const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onloadend = () => setTempAvatar(reader.result as string)
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleSaveAvatar = () => {
//     if (tempAvatar) {
//       setAvatar(tempAvatar)
//       sessionStorage.setItem("avatar", tempAvatar)
//       sendAvatarToBackend(tempAvatar)
//       setTempAvatar(null)
//     }
//   }

//   const handleCancelAvatar = () => setTempAvatar(null)

//   const handleDeleteAvatar = () => {
//     setAvatar(null)
//     setTempAvatar(null)
//     sessionStorage.removeItem("avatar")
//     removeAvatarFromBackend()
//   }

//   const sendAvatarToBackend = (base64String: string) => {
//     console.log("Sending avatar to backend:", base64String)
//   }

//   const removeAvatarFromBackend = () => {
//     console.log("Removing avatar from backend")
//   }

//   const passwordSchema = Yup.object().shape({
//     oldPassword: Yup.string().required("Old password is required"),
//     newPassword: Yup.string()
//       .min(6, "Password should be at least 6 characters")
//       .required("New password is required"),
//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref("newPassword")], "Passwords must match")
//       .required("Confirm password is required"),
//   })

//   const handleSubmit = (values: any) => {
//     console.log("Changing password with:", values)
//   }

//   return (
//     <div className="max-w-6xl mx-auto mt-10">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white shadow-xl rounded-2xl p-6">
//         {/* Left Column - Avatar */}
//         <div className="flex flex-col items-center">
//           <div className="relative w-40 h-40">
//             {tempAvatar || avatar ? (
//               <img
//                 src={tempAvatar || avatar!}
//                 alt="avatar"
//                 className="w-40 h-40 rounded-full object-cover shadow-lg"
//               />
//             ) : (
//               <div className="w-40 h-40 rounded-full bg-primary text-white flex items-center justify-center text-5xl font-bold shadow-lg">
//                 {user?.firstName?.charAt(0)}
//               </div>
//             )}

//             {/* Overlay for actions */}
//             {tempAvatar && (
//               <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-3 rounded-full">
//                 <button
//                   className="btn btn-xs btn-success"
//                   onClick={handleSaveAvatar}
//                 >
//                   Save
//                 </button>
//                 <button
//                   className="btn btn-xs btn-error"
//                   onClick={handleCancelAvatar}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Avatar Upload */}
//           <div className="mt-5 w-full text-center">
//             <input
//               type="file"
//               accept="image/*"
//               id="avatarUpload"
//               onChange={handleAvatarChange}
//               className="hidden"
//             />
//             <label
//               htmlFor="avatarUpload"
//               className="btn btn-outline btn-sm w-full"
//             >
//               Change Photo
//             </label>
//             {avatar && (
//               <button
//                 className="btn btn-outline btn-warning btn-sm w-full mt-2"
//                 onClick={handleDeleteAvatar}
//               >
//                 Delete Photo
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Right Column - User Info */}
//         <div className="md:col-span-2">
//           <h2 className="text-3xl font-semibold mb-6 text-gray-800">
//             Profile Information
//           </h2>
//           <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
//             <div>
//               <dt className="font-medium text-gray-600">Name</dt>
//               <dd className="text-lg text-gray-900">
//                 {user?.firstName} {user?.lastName}
//               </dd>
//             </div>
//             <div>
//               <dt className="font-medium text-gray-600">Email</dt>
//               <dd className="text-lg text-gray-900">{user?.emailAddress}</dd>
//             </div>
//             <div>
//               <dt className="font-medium text-gray-600">Role</dt>
//               <dd className="text-lg text-gray-900">{user?.role}</dd>
//             </div>

//             <div>
//               <dt className="font-medium text-gray-600">Contact Number</dt>
//               <dd className="text-lg text-gray-900">{user?.contactNumber}</dd>
//             </div>
//           </dl>

//           {/* Change Password */}
//           <div className="mt-8">
//             <button
//               className="btn btn-primary"
//               onClick={() => setIsChangingPassword(!isChangingPassword)}
//             >
//               {isChangingPassword ? "Cancel" : "Change Password"}
//             </button>

//             <AnimatePresence>
//               {isChangingPassword && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className="mt-6"
//                 >
//                   <Formik
//                     initialValues={{
//                       oldPassword: "",
//                       newPassword: "",
//                       confirmPassword: "",
//                     }}
//                     validationSchema={passwordSchema}
//                     onSubmit={handleSubmit}
//                   >
//                     {({ errors, touched }) => (
//                       <Form className="bg-gray-50 p-6 rounded-xl shadow-inner">
//                         <h3 className="text-xl font-semibold mb-4">
//                           Change Password
//                         </h3>

//                         {/* Old Password */}
//                         <div className="mb-4">
//                           <label
//                             htmlFor="oldPassword"
//                             className="block font-medium text-gray-700"
//                           >
//                             Old Password
//                           </label>
//                           <Field
//                             name="oldPassword"
//                             type="password"
//                             className="input input-bordered w-full mt-2"
//                           />
//                           {errors.oldPassword && touched.oldPassword && (
//                             <p className="text-error text-sm mt-1">
//                               {errors.oldPassword}
//                             </p>
//                           )}
//                         </div>

//                         {/* New Password */}
//                         <div className="mb-4">
//                           <label
//                             htmlFor="newPassword"
//                             className="block font-medium text-gray-700"
//                           >
//                             New Password
//                           </label>
//                           <Field
//                             name="newPassword"
//                             type="password"
//                             className="input input-bordered w-full mt-2"
//                           />
//                           {errors.newPassword && touched.newPassword && (
//                             <p className="text-error text-sm mt-1">
//                               {errors.newPassword}
//                             </p>
//                           )}
//                         </div>

//                         {/* Confirm Password */}
//                         <div className="mb-4">
//                           <label
//                             htmlFor="confirmPassword"
//                             className="block font-medium text-gray-700"
//                           >
//                             Confirm Password
//                           </label>
//                           <Field
//                             name="confirmPassword"
//                             type="password"
//                             className="input input-bordered w-full mt-2"
//                           />
//                           {errors.confirmPassword &&
//                             touched.confirmPassword && (
//                               <p className="text-error text-sm mt-1">
//                                 {errors.confirmPassword}
//                               </p>
//                             )}
//                         </div>

//                         <div className="flex justify-end">
//                           <button type="submit" className="btn btn-primary">
//                             Update Password
//                           </button>
//                         </div>
//                       </Form>
//                     )}
//                   </Formik>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Profile

// import { useState, useEffect } from "react"
// import { IUser } from "@/utils/types"
// import { Field, Formik, Form } from "formik"
// import * as Yup from "yup"

// interface IProfileProps {
//   user: IUser | null
// }

// const Profile: React.FunctionComponent<IProfileProps> = ({ user }) => {
//   const [avatar, setAvatar] = useState<string | null>(null)
//   const [tempAvatar, setTempAvatar] = useState<string | null>(null) // Temporary avatar for preview before save
//   const [isChangingPassword, setIsChangingPassword] = useState(false)

//   // Retrieve saved avatar from session storage
//   useEffect(() => {
//     const savedAvatar = sessionStorage.getItem("avatar")
//     if (savedAvatar) {
//       setAvatar(savedAvatar)
//     }
//   }, [])

//   // Handle file upload for the avatar
//   const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         const base64String = reader.result as string
//         setTempAvatar(base64String) // Temporary avatar for preview
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   // Handle avatar save
//   const handleSaveAvatar = () => {
//     if (tempAvatar) {
//       setAvatar(tempAvatar)
//       sessionStorage.setItem("avatar", tempAvatar) // Save to session storage
//       sendAvatarToBackend(tempAvatar) // Send to backend
//       setTempAvatar(null)
//     }
//   }

//   // Handle avatar reset (cancel changes)
//   const handleCancelAvatar = () => {
//     setTempAvatar(null)
//   }

//   // Handle avatar delete (remove photo)
//   const handleDeleteAvatar = () => {
//     setAvatar(null)
//     setTempAvatar(null)
//     sessionStorage.removeItem("avatar") // Clear from session storage
//     removeAvatarFromBackend() // Send delete request to backend
//   }

//   const sendAvatarToBackend = (base64String: string) => {
//     // Add your API request logic here, e.g., using axios
//     console.log("Sending avatar to backend:", base64String)
//     // Example:
//     // axios.post('/api/upload-avatar', { avatar: base64String, userId: user.id });
//   }

//   const removeAvatarFromBackend = () => {
//     // Logic for removing avatar from the backend
//     console.log("Removing avatar from backend")
//     // Example:
//     // axios.post('/api/remove-avatar', { userId: user.id });
//   }

//   // Form validation schema for changing password
//   const passwordSchema = Yup.object().shape({
//     oldPassword: Yup.string().required("Old password is required"),
//     newPassword: Yup.string()
//       .min(6, "Password should be at least 6 characters")
//       .required("New password is required"),
//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref("newPassword")], "Passwords must match")
//       .required("Confirm password is required"),
//   })

//   const handleSubmit = (values: any) => {
//     console.log("Changing password with:", values)
//     // Add logic for sending change password request using token
//   }

//   return (
//     <div className="w-[80vw]">
//       <div className="flex gap-12 p-4 bg-white shadow-lg rounded-lg">
//         <div className="flex-shrink-0">
//           {/* Display uploaded avatar or default avatar */}
//           <div className="avatar placeholder">
//             <div className="w-32 h-32 rounded-full bg-primary text-white flex items-center justify-center">
//               {tempAvatar ? (
//                 <img
//                   src={tempAvatar}
//                   alt="avatar"
//                   className="w-full h-full object-cover rounded-full"
//                 />
//               ) : avatar ? (
//                 <img
//                   src={avatar}
//                   alt="avatar"
//                   className="w-full h-full object-cover rounded-full"
//                 />
//               ) : (
//                 <span className="text-4xl font-bold">
//                   {user?.firstName.charAt(0)}
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Avatar upload button */}
//           <div className="mt-4">
//             <label className="block text-sm font-semibold mb-1">
//               Upload Avatar
//             </label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleAvatarChange}
//               className="file-input file-input-bordered w-full max-w-xs"
//             />
//           </div>

//           {/* Save, Cancel, and Delete buttons */}
//           <div className="mt-4 flex gap-2">
//             {tempAvatar && (
//               <>
//                 <button className="btn btn-success" onClick={handleSaveAvatar}>
//                   Save
//                 </button>
//                 <button className="btn btn-error" onClick={handleCancelAvatar}>
//                   Cancel
//                 </button>
//               </>
//             )}
//             {avatar && (
//               <button className="btn btn-warning" onClick={handleDeleteAvatar}>
//                 Delete Photo
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="flex-grow">
//           <h2 className="text-3xl font-semibold mb-4">
//             {user?.firstName} {user?.lastName}
//           </h2>
//           <div className="text-lg">
//             <div className="mb-4">
//               <span className="font-semibold">Email: </span>
//               {user?.email}
//             </div>
//             <div className="mb-4">
//               <span className="font-semibold">Role: </span>
//               {user?.role}
//             </div>
//             <div className="mb-4">
//               <button
//                 className="btn btn-primary"
//                 onClick={() => setIsChangingPassword(!isChangingPassword)}
//               >
//                 {isChangingPassword ? "Cancel" : "Change Password"}
//               </button>
//             </div>
//           </div>

//           {isChangingPassword && (
//             <Formik
//               initialValues={{
//                 oldPassword: "",
//                 newPassword: "",
//                 confirmPassword: "",
//               }}
//               validationSchema={passwordSchema}
//               onSubmit={handleSubmit}
//             >
//               {({ errors, touched }) => (
//                 <Form className="bg-gray-100 p-4 rounded-lg shadow-inner">
//                   <h3 className="text-xl font-semibold mb-4">
//                     Change Password
//                   </h3>
//                   <div className="mb-4">
//                     <label
//                       className="block font-semibold"
//                       htmlFor="oldPassword"
//                     >
//                       Old Password
//                     </label>
//                     <Field
//                       name="oldPassword"
//                       type="password"
//                       className="input input-bordered w-full mt-2"
//                     />
//                     {errors.oldPassword && touched.oldPassword && (
//                       <div className="text-error">{errors.oldPassword}</div>
//                     )}
//                   </div>

//                   <div className="mb-4">
//                     <label
//                       className="block font-semibold"
//                       htmlFor="newPassword"
//                     >
//                       New Password
//                     </label>
//                     <Field
//                       name="newPassword"
//                       type="password"
//                       className="input input-bordered w-full mt-2"
//                     />
//                     {errors.newPassword && touched.newPassword && (
//                       <div className="text-error">{errors.newPassword}</div>
//                     )}
//                   </div>

//                   <div className="mb-4">
//                     <label
//                       className="block font-semibold"
//                       htmlFor="confirmPassword"
//                     >
//                       Confirm New Password
//                     </label>
//                     <Field
//                       name="confirmPassword"
//                       type="password"
//                       className="input input-bordered w-full mt-2"
//                     />
//                     {errors.confirmPassword && touched.confirmPassword && (
//                       <div className="text-error">{errors.confirmPassword}</div>
//                     )}
//                   </div>

//                   <div className="flex justify-end">
//                     <button type="submit" className="btn btn-primary">
//                       Update Password
//                     </button>
//                   </div>
//                 </Form>
//               )}
//             </Formik>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Profile
