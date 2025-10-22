// import { useEffect, useState } from "react"
// import { useTranslation } from "react-i18next"
// import ThemeToggle from "@/components/ThemeToggle"

// import { getUserDetails } from "@/utils/AppConfig"
// import { IUser } from "@/utils/types"

// const Settings: React.FC = () => {
//   const { t } = useTranslation()
//   const [theme, setTheme] = useState<string>(() =>
//     typeof window !== "undefined"
//       ? localStorage.getItem("theme") || "light"
//       : "light",
//   )
//   const [user, setUser] = useState<IUser | null>(null)

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const userDetails = await getUserDetails("si@email.com")
//         setUser(userDetails || null)
//       } catch (error) {
//         console.error("Failed to fetch user details:", error)
//         setUser(null)
//       }
//     }
//     fetchUserDetails()
//   }, [])

//   return (
//     <div className="flex flex-col p-6 space-y-6">
//       <div className="text-2xl font-semibold mb-4">{t("settings.title")}</div>

//       {/* Theme Selection */}
//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <h2 className="text-xl font-medium mb-2">{t("settings.themeTitle")}</h2>
//         <p className="text-gray-600 mb-4">{t("settings.themeDescription")}</p>
//         <ThemeToggle />
//       </div>

//       {/* Language Switcher */}
//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <h2 className="text-xl font-medium mb-2">{t("settings.language")}</h2>
//       </div>
//     </div>
//   )
// }

// export default Settings

// import { useEffect, useState } from "react"
// import { useTranslation } from "react-i18next"
// import ThemeToggle from "@/components/ThemeToggle"
// import Table from "@/components/Table"
// import Profile from "@/routes/Profile"
// import { SAMPLE_TABLE_DATA } from "@/utils/data"
// import { getUserDetails } from "@/utils/AppConfig"
// import { IUser } from "@/utils/types"
// const Settings: React.FC = () => {
//   const { t, i18n } = useTranslation() // ✅ useTranslation hook

//   const [theme, setTheme] = useState<string>(() => {
//     if (typeof window !== "undefined") {
//       return localStorage.getItem("theme") || "light"
//     }
//     return "light"
//   })

//   const [user, setUser] = useState<IUser | null>(null)

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const userDetails = await getUserDetails("si@email.com") // adjust dynamically
//         setUser(userDetails || null)
//       } catch (error) {
//         console.error("Failed to fetch user details:", error)
//         setUser(null)
//       }
//     }

//     fetchUserDetails()
//   }, [])

//   // ✅ change language handler
//   const changeLanguage = (lng: string) => {
//     i18n.changeLanguage(lng)
//   }

//   return (
//     <div className="flex flex-col p-6 space-y-6">
//       <div className="text-2xl font-semibold mb-4">{t("settings.title")}</div>

//       {/* Theme Selection */}
//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <h2 className="text-xl font-medium mb-2">{t("settings.themeTitle")}</h2>
//         <p className="text-gray-600 mb-4">{t("settings.themeDescription")}</p>
//         <ThemeToggle />
//       </div>

//       {/* Language Switcher */}
//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <h2 className="text-xl font-medium mb-2">{t("settings.language")}</h2>
//         <div className="flex gap-2">
//           <button
//             onClick={() => changeLanguage("en")}
//             className="px-3 py-1 border rounded"
//           >
//             English
//           </button>
//           <button
//             onClick={() => changeLanguage("hi")}
//             className="px-3 py-1 border rounded"
//           >
//             हिन्दी
//           </button>
//           <button
//             onClick={() => changeLanguage("ar")}
//             className="px-3 py-1 border rounded"
//           >
//             عربي
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Settings

import { useEffect, useState } from "react"
import ThemeToggle from "@/components/ThemeToggle"
import Table from "@/components/Table"
import Profile from "@/routes/Profile"
import { SAMPLE_TABLE_DATA } from "@/utils/data"
import { getUserDetails } from "@/utils/AppConfig"
import { IUser } from "@/utils/types"
interface ISettingProps {
  user: IUser | null
}
const Settings: React.FC = () => {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light"
    }
    return "light"
  })

  const [user, setUser] = useState<IUser | null>(null)

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await getUserDetails("si@email.com") // adjust dynamically
        setUser(userDetails || null)
      } catch (error) {
        console.error("Failed to fetch user details:", error)
        setUser(null)
      }
    }

    fetchUserDetails()
  }, [])

  return (
    <div className="flex flex-col p-6 space-y-6">
      <div className="text-2xl font-semibold mb-4">Settings</div>

      {/* Theme Selection */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-2">Theme Setting</h2>
        <p className="text-gray-600 mb-4">
          Choose between light and dark mode for your website.
        </p>
        <ThemeToggle />
      </div>

      {/* Profile */}
      {/* <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-medium mb-2">Profile</h2> */}
      {/* {user ? <Profile user={user} /> : <p>Loading...</p>} */}
      {/* <dd className="text-lg text-gray-900">
          {user?.firstName} {user?.lastName}
        </dd>
      </div> */}

      {/* Sample Table */}
      {/* <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-medium mb-2">Sample Table</h2>
        <Table data={SAMPLE_TABLE_DATA} />
      </div> */}
    </div>
  )
}

export default Settings

// import { useEffect, useState } from "react"
// import ThemeToggle from "@/components/ThemeToggle"
// import { getUserDetails, saveUserDetails } from "@/utils/AppConfig"
// import { IUser } from "@/utils/types"

// const Settings: React.FC = () => {
//   const [theme, setTheme] = useState<string>("light")
//   const [user, setUser] = useState<IUser | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     // Theme setup
//     const storedTheme = localStorage.getItem("theme") || "light"
//     setTheme(storedTheme)

//     // User fetch
//     const fetchUserDetails = async () => {
//       try {
//         const email = localStorage.getItem("currentUserEmail") || "si@email.com"
//         const userDetails = await getUserDetails(email)
//         if (userDetails) {
//           setUser(userDetails)
//         } else {
//           setError("No user found.")
//         }
//       } catch (err) {
//         console.error("Failed to fetch user details:", err)
//         setError("Failed to load user.")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchUserDetails()
//   }, [])

//   const handleUpdateProfile = () => {
//     if (user) {
//       saveUserDetails(user)
//       alert("Profile updated successfully!")
//     }
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("currentUserEmail")
//     setUser(null)
//     alert("Logged out!")
//     // You could also redirect to login page
//   }

//   return (
//     <div className="flex flex-col p-6 space-y-6">
//       <div className="text-2xl font-semibold mb-4">Settings</div>

//       {/* Theme Selection */}
//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <h2 className="text-xl font-medium mb-2">Theme Setting</h2>
//         <p className="text-gray-600 mb-4">
//           Choose between light and dark mode for your website.
//         </p>
//         <ThemeToggle />
//       </div>

//       {/* Profile */}
//       <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
//         <h2 className="text-xl font-medium mb-4">Profile</h2>

//         {loading ? (
//           <p>Loading profile...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : user ? (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-semibold">First Name</label>
//               <input
//                 type="text"
//                 value={user.firstName}
//                 onChange={(e) =>
//                   setUser({ ...user, firstName: e.target.value })
//                 }
//                 className="border rounded p-2 w-full"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold">Last Name</label>
//               <input
//                 type="text"
//                 value={user.lastName}
//                 onChange={(e) => setUser({ ...user, lastName: e.target.value })}
//                 className="border rounded p-2 w-full"
//               />
//             </div>

//             <button
//               onClick={handleUpdateProfile}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               Save Changes
//             </button>

//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//             >
//               Log Out
//             </button>
//           </div>
//         ) : (
//           <p>No profile available.</p>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Settings

// import { useEffect, useState } from "react"
// import ThemeToggle from "@/components/ThemeToggle"
// import Table from "@/components/Table"
// import Profile from "@/routes/Profile"
// import { SAMPLE_TABLE_DATA } from "@/utils/data"
// import { getUserDetails, updateUserDetails } from "@/utils/AppConfig"
// import { IUser } from "@/utils/types"

// const Settings: React.FC = () => {
//   const [theme, setTheme] = useState<string>(() => {
//     if (typeof window !== "undefined") {
//       return localStorage.getItem("theme") || "light"
//     }
//     return "light"
//   })

//   const [user, setUser] = useState<IUser | null>(null)

//   // useEffect(() => {
//   //   // Fetch user details on component mount
//   //   const userDetails = getUserDetails("si@email.com"); // Adjust the email as needed
//   //   setUser(userDetails || null);
//   // }, []);
//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const userDetails = await getUserDetails("si@email.com") // async call
//         setUser(userDetails || null)
//       } catch (error) {
//         console.error("Failed to fetch user details:", error)
//         setUser(null)
//       }
//     }

//     fetchUserDetails()
//   }, [])

//   // const handleSubmit = (event: React.FormEvent) => {
//   //   event.preventDefault()

//   //   if (user) {
//   //     // Update user details
//   //     updateUserDetails(user)

//   //     // Optionally, you might want to refresh the user details here
//   //     const updatedUserDetails = getUserDetails(user.email)
//   //     setUser(updatedUserDetails || null)

//   //     alert("User details updated successfully!")
//   //   }
//   // }
//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault()

//     if (user) {
//       await updateUserDetails(user)
//       const updatedUserDetails = await getUserDetails(user.email)
//       setUser(updatedUserDetails || null)
//       alert("User details updated successfully!")
//     }
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setUser((prev) => (prev ? { ...prev, [name]: value } : null))
//   }

//   return (
//     <div className="flex flex-col p-6 space-y-6">
//       <div className="text-2xl font-semibold mb-4">Settings</div>
//       {/* Theme Selection */}
//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <h2 className="text-xl font-medium mb-2">Theme Setting</h2>
//         <p className="text-gray-600 mb-4">
//           Choose between light and dark mode for your website.
//         </p>
//         <ThemeToggle />
//       </div>
//       User Profile Form
//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <h2 className="text-xl font-medium mb-2">Profile Update</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label
//               htmlFor="firstName"
//               className="block text-sm font-medium text-gray-700"
//             >
//               First Name
//             </label>
//             <input
//               id="firstName"
//               name="firstName"
//               type="text"
//               value={user?.firstName || ""}
//               onChange={handleChange}
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="lastName"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Last Name
//             </label>
//             <input
//               id="lastName"
//               name="lastName"
//               type="text"
//               value={user?.lastName || ""}
//               onChange={handleChange}
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Email
//             </label>
//             <input
//               id="email"
//               name="email"
//               type="email"
//               value={user?.email || ""}
//               disabled
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Password
//             </label>
//             <input
//               id="password"
//               name="password"
//               type="password"
//               placeholder="********"
//               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//             />
//           </div>
//           <button type="submit" className="btn btn-primary">
//             Save Changes
//           </button>
//         </form>
//       </div>
//       {/* Profile */}
//       <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
//         <h2 className="text-xl font-medium mb-2">Profile Overview</h2>
//         {user ? <Profile user={user} /> : <p>Loading...</p>}
//       </div>
//       {/* Sample Table */}
//       <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
//         <h2 className="text-xl font-medium mb-2">Sample Table</h2>
//         <Table data={SAMPLE_TABLE_DATA} />
//       </div>
//     </div>
//   )
// }

// export default Settings
