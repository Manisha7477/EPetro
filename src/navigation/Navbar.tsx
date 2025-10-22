//NEW CODE
//NEW CODE
import { INavigationItem, IUser } from "@/utils/types"
import { Link } from "react-router-dom"
import { HiMenu, HiX, HiBell } from "react-icons/hi"
import { motion } from "framer-motion"
interface INavbarProps {
  user: IUser
  siteName: string
  userNavigation: INavigationItem[]
  handleMenuStatus: Function
  isOpenMenu: boolean
}

const Navbar: React.FunctionComponent<INavbarProps> = ({
  user,
  siteName,
  userNavigation,
  handleMenuStatus,
  isOpenMenu,
}) => {
  // const userFirstLetterMatch = user.firstName.match(/\b(\w)/g)
  const userFirstLetterMatch = user.firstName
    ? user.firstName.match(/\b(\w)/g)
    : []
  const userFirstLetter = userFirstLetterMatch?.join("")

  const handleClickMenu = () => {
    handleMenuStatus()
  }
  const userNavigateRender = () =>
    userNavigation.map((menuItem) => {
      return (
        <li key={menuItem.name}>
          {/* <Link to={menuItem.href} className=
          "justify-between"
          >
            {menuItem.name}
            <span className="badge badge-primary">New</span>
          </Link> */}
          <Link
            to={menuItem.href}
            className="flex justify-between items-center hover:bg-gray-100 px-2 py-1 rounded-md transition"
          >
            {menuItem.name}
            <span className="badge badge-primary">New</span>
          </Link>
        </li>
      )
    })

  const notificationItems = [
    "Notification 1",
    "Notification 2",
    "Notification 3",
  ]
  return (
    <motion.div
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 w-full z-50
      flex justify-between items-center
      bg-[#1E6FBF]
      h-16 md:h-16 lg:h-18
      px-4
      shadow-inner shadow-[#010810] shadow-[inset_0_6px_16px_rgba(0,0,0,0.25)]"
    >
      {/* Left - Logos */}
      <div className="w-fit flex justify-center items-center gap-4">
        <button
          className="btn btn-square btn-xs btn-outline text-neutral-100"
          onClick={handleClickMenu}
        >
          {!isOpenMenu ? (
            <HiMenu className="w-3 h-3" />
          ) : (
            <HiX className="w-3 h-3" />
          )}
        </button>

        <Link to="/" className="flex items-center gap-3">
          {/* Keep original logos, no round shape */}
          <img
            src="/assets/images/HSA-Logo.svg"
            className="h-10 sm:h-10 cursor-pointer"
            alt="ems"
          />
          <div className="border-l-2 border-[#cce703] h-10"></div>
          <img
            src="/assets/images/Elitia-EMS.svg"
            className="h-10 sm:h-12 cursor-pointer hover:scale-105 transition"
            alt="ems"
          />
        </Link>
      </div>

      {/* Right side */}
      <div className="flex justify-between items-center gap-x-2">
        {/* Notifications */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle hover:bg-white/10"
          >
            <div className="indicator">
              <HiBell className="w-6 h-6 text-warning" />
              <span className="badge badge-xs indicator-item">
                {notificationItems.length}
              </span>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-xs dropdown-content bg-base-100 rounded-box w-52 top-8 border-gray-100"
          >
            <h3 className="font-semibold text-gray-700 px-2 mb-2">
              Notifications
            </h3>
            {notificationItems.map((item, idx) => (
              <li key={idx}>
                <a className="text-sm text-gray-700 hover:bg-gray-100 rounded-md transition px-2 py-1">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* User Profile */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            className="flex items-center cursor-pointer hover:bg-white/10 px-2 py-1 rounded-lg transition"
          >
            <div className="avatar placeholder">
              <div className="bg-primary-focus text-base-100 rounded-full w-10 h-10 flex items-center justify-center">
                {user.photoUrl ? (
                  <img
                    className="rounded-full w-full h-full border border-white shadow-md"
                    src={user.photoUrl}
                    alt="User"
                  />
                ) : (
                  <span className="text-lg font-semibold">
                    {userFirstLetter}
                  </span>
                )}
              </div>
            </div>
            <div className="ml-2 text-white text-sm font-medium">{`${user.firstName} ${user.lastName}`}</div>
          </div>

          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-3 shadow-xl menu menu-sm dropdown-content bg-white rounded-xl w-56 top-8"
          >
            <h3 className="text-gray-700 font-semibold mb-2 px-2">Account</h3>
            {userNavigateRender()}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

export default Navbar




//25-09-25
// import { INavigationItem, IUser } from "@/utils/types"
// import { Link } from "react-router-dom"
// import { HiMenu, HiX, HiBell } from "react-icons/hi"
// import { motion } from "framer-motion"
// interface INavbarProps {
//   user: IUser
//   siteName: string
//   userNavigation: INavigationItem[]
//   handleMenuStatus: Function
//   isOpenMenu: boolean
// }

// const Navbar: React.FunctionComponent<INavbarProps> = ({
//   user,
//   siteName,
//   userNavigation,
//   handleMenuStatus,
//   isOpenMenu,
// }) => {
//   // const userFirstLetterMatch = user.firstName.match(/\b(\w)/g)
//   const userFirstLetterMatch = user.firstName
//     ? user.firstName.match(/\b(\w)/g)
//     : []
//   const userFirstLetter = userFirstLetterMatch?.join("")

//   const handleClickMenu = () => {
//     handleMenuStatus()
//   }
//   const userNavigateRender = () =>
//     userNavigation.map((menuItem) => {
//       return (
//         <li key={menuItem.name}>
//           {/* <Link to={menuItem.href} className=
//           "justify-between"
//           >
//             {menuItem.name}
//             <span className="badge badge-primary">New</span>
//           </Link> */}
//           <Link
//             to={menuItem.href}
//             className="flex justify-between items-center hover:bg-gray-100 px-2 py-1 rounded-md transition"
//           >
//             {menuItem.name}
//             <span className="badge badge-primary">New</span>
//           </Link>
//         </li>
//       )
//     })

//   const notificationItems = [
//     "Notification 1",
//     "Notification 2",
//     "Notification 3",
//   ]

//   // return (
//   //   <div
//   //     className="navbar fixed w-full z-50 shadow-md flex justify-between bg-[#0A91AB]
//   // h-16 sm:h-16 md:h-18 lg:h-20 px-4 sm:px-8"
//   //   >
//   //     <div className="w-fit flex justify-center items-center gap-4">
//   //       <div className="flex-none">
//   //         <button
//   //           className=" btn btn-square btn-sm btn-outline text-neutral-100"
//   //           onClick={handleClickMenu}
//   //         >
//   //           {!isOpenMenu ? (
//   //             <HiMenu className="w-4 h-4" />
//   //           ) : (
//   //             <HiX className="w-4 h-4" />
//   //           )}
//   //         </button>
//   //       </div>

//   //       <Link to="/">
//   //         {/* Wrap the first image with Link */}
//   //         <img
//   //           src="/assets/images/HSA-Logo.svg"
//   //           className="h-10 sm:h-12 cursor-pointer"
//   //           alt="ems"
//   //         />
//   //       </Link>
//   //       <div className="border-l-4 p-1 h-10 border-[#9fac0c]"></div>
//   //       <Link to="/">
//   //         {" "}
//   //         {/* Wrap the second image with Link */}
//   //         <img
//   //           src="/assets/images/Elitia-EMS.svg"
//   //           className="h-10 sm:h-12 cursor-pointer"
//   //           alt="ems"
//   //         />
//   //       </Link>
//   //     </div>
//   //     {/* Right side */}
//   //     <div className="flex justify-between items-center gap-x-2">
//   //       {/* Notifications */}
//   //       <div className="dropdown dropdown-end">
//   //         <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
//   //           <div className="indicator">
//   //             <HiBell className="w-6 h-6 text-warning" />
//   //             <span className="badge badge-sm indicator-item">
//   //               {notificationItems.length}
//   //             </span>
//   //           </div>
//   //         </div>
//   //         <ul
//   //           tabIndex={0}
//   //           className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 top-8"
//   //         >
//   //           {notificationItems.map((item) => {
//   //             return (
//   //               <li key={item}>
//   //                 <a>{item}</a>
//   //               </li>
//   //             )
//   //           })}
//   //         </ul>
//   //       </div>

//   //       <div className="dropdown dropdown-end">
//   //         <div tabIndex={0} className="flex items-center cursor-pointer">
//   //           <div className="avatar placeholder">
//   //             <div className="bg-primary-focus text-base-100 rounded-full w-8 sm:w-10">
//   //               {user.photoUrl ? (
//   //                 <img
//   //                   className="rounded-full w-full h-full"
//   //                   src={user.photoUrl}
//   //                   alt="User"
//   //                 />
//   //               ) : (
//   //                 <span className="text-xl">{userFirstLetter}</span>
//   //               )}
//   //             </div>
//   //           </div>
//   //           <div className="ml-2 pt-0.5 text-neutral-100 text-sm">{`${user.firstName} ${user.lastName}`}</div>
//   //         </div>

//   //         <ul
//   //           tabIndex={0}
//   //           className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 top-6"
//   //         >
//   //           {userNavigateRender()}
//   //         </ul>
//   //       </div>
//   //     </div>
//   //   </div>
//   // )
//   return (
//     <motion.div
//       initial={{ y: -70, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.4 }}
//       className="navbar fixed w-full z-50 shadow-md flex justify-between bg-gradient-to-r from-[#0A91AB] to-[#087b90]
//       h-16 sm:h-16 md:h-18 lg:h-20 px-4 sm:px-8"
//     >
//       {/* Left - Logos */}
//       <div className="w-fit flex justify-center items-center gap-4">
//         <button
//           className="btn btn-square btn-sm btn-outline text-white hover:bg-white hover:text-[#0A91AB] transition"
//           onClick={handleClickMenu}
//         >
//           {!isOpenMenu ? (
//             <HiMenu className="w-5 h-5" />
//           ) : (
//             <HiX className="w-5 h-5" />
//           )}
//         </button>

//         <Link to="/" className="flex items-center gap-3">
//           {/* Keep original logos, no round shape */}
//           <img
//             src="/assets/images/HSA-Logo.svg"
//             className="h-10 sm:h-12 cursor-pointer hover:scale-105 transition"
//             alt="ems"
//           />
//           <div className="border-l-2 border-[#cce703] h-10"></div>
//           <img
//             src="/assets/images/Elitia-EMS.svg"
//             className="h-10 sm:h-12 cursor-pointer hover:scale-105 transition"
//             alt="ems"
//           />
//         </Link>
//       </div>

//       {/* Right side */}
//       <div className="flex justify-between items-center gap-x-3">
//         {/* Notifications */}
//         <div className="dropdown dropdown-end">
//           <div
//             tabIndex={0}
//             role="button"
//             className="btn btn-ghost btn-circle hover:bg-white/10"
//           >
//             <div className="indicator">
//               <HiBell className="w-6 h-6 text-yellow-400" />
//               <span className="badge badge-sm indicator-item">
//                 {notificationItems.length}
//               </span>
//             </div>
//           </div>
//           <ul
//             tabIndex={0}
//             className="mt-3 z-[1] p-3 shadow-lg menu menu-sm dropdown-content bg-white rounded-xl w-60 top-8"
//           >
//             <h3 className="font-semibold text-gray-700 px-2 mb-2">
//               Notifications
//             </h3>
//             {notificationItems.map((item, idx) => (
//               <li key={idx}>
//                 <a className="text-sm text-gray-700 hover:bg-gray-100 rounded-md transition px-2 py-1">
//                   {item}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* User Profile */}
//         <div className="dropdown dropdown-end">
//           <div
//             tabIndex={0}
//             className="flex items-center cursor-pointer hover:bg-white/10 px-2 py-1 rounded-lg transition"
//           >
//             <div className="avatar placeholder">
//               <div className="bg-primary-focus text-base-100 rounded-full w-10 h-10 flex items-center justify-center">
//                 {user.photoUrl ? (
//                   <img
//                     className="rounded-full w-full h-full border border-white shadow-md"
//                     src={user.photoUrl}
//                     alt="User"
//                   />
//                 ) : (
//                   <span className="text-lg font-semibold">
//                     {userFirstLetter}
//                   </span>
//                 )}
//               </div>
//             </div>
//             <div className="ml-2 text-white text-sm font-medium">{`${user.firstName} ${user.lastName}`}</div>
//           </div>

//           <ul
//             tabIndex={0}
//             className="mt-3 z-[1] p-3 shadow-xl menu menu-sm dropdown-content bg-white rounded-xl w-56 top-8"
//           >
//             <h3 className="text-gray-700 font-semibold mb-2 px-2">Account</h3>
//             {userNavigateRender()}
//           </ul>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// export default Navbar
