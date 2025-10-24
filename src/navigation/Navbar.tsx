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
      bg-gradient-to-l from-[#1E6FBF] from-10% to-transparent
      h-16 md:h-16 lg:h-18
      px-4
      shadow-inner shadow-[#010810] shadow-[inset_0_6px_16px_rgba(0,0,0,0.25)]"
    >
      {/* Left - Logos */}
      <div className="w-fit flex justify-center items-center gap-4">
        <button
          className="btn btn-square btn-xs btn-outline border-black text-black hover:bg-black hover:text-white transition"
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
          {/* <img
            src="/assets/images/HSA-Logo.svg"
            className="h-10 sm:h-10 cursor-pointer"
            alt="ems"
          />
          <div className="border-l-2 border-[#cce703] h-10"></div> */}
          <img
            src="/assets/images/companylogo.png"
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
