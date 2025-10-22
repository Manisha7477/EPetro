// // MergedSideBar
import React from "react"
import { Link, useLocation } from "react-router-dom"
import { HiMenu, HiX } from "react-icons/hi"
import SideBarMenu from "@/navigation/SideBarMenu"
import { IUser, INavigationItem } from "@/utils/types"

interface IMergedSidebarProps {
  user: IUser
  userNavigation: INavigationItem[]
  isOpenMenu: boolean
  handleMenuStatus: () => void
}

const MergedSidebar: React.FC<IMergedSidebarProps> = ({
  user,
  userNavigation,
  isOpenMenu,
  handleMenuStatus,
}) => {
  const { pathname } = useLocation()

  const userFirstLetterMatch = user.firstName
    ? user.firstName.match(/\b(\w)/g)
    : []
  const userFirstLetter = userFirstLetterMatch?.join("") || ""

  // Function to render user navigation menu items (account links)
  const renderUserNavigation = () =>
    userNavigation.map((menuItem) => (
      <li key={menuItem.name}>
        <Link
          to={menuItem.href}
          className="flex justify-between items-center hover:bg-gray-100 px-2 py-1 rounded-md transition"
        >
          {menuItem.name}
          <span className="badge badge-primary">New</span>
        </Link>
      </li>
    ))

  return (
    <aside
      className={`flex flex-col h-screen transition-all bg-base-100 shadow-md border-r border-gray-200 ${
        isOpenMenu ? "w-52" : "w-13"
      }`}
    >
      {/* Scrollable menu area */}
      <nav className="flex-1  scrollbar-hide min-h-0">
        <SideBarMenu user={user} isOpenMenu={isOpenMenu} />
      </nav>
    </aside>
  )
}

export default MergedSidebar
