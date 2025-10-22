// //NEW CODE
import { BrowserRouter } from "react-router-dom"
import AppRouter from "@/routes/AppRouter"
import Navbar from "@/navigation/Navbar"
import { AppConfig, UserNavigation } from "@/utils/AppConfig"
import SideBarMenu from "@/navigation/SideBarMenu"
import { IUser } from "@/utils/types"
import { useState } from "react"
import MergedSidebar from "@/navigation/MergedSidebar"

interface IAuthenticatedProps {
  user: IUser
  meta: React.ReactNode
}

const NAVBAR_HEIGHT = 64 // Example height in pixels; adjust if needed

const Authenticated: React.FunctionComponent<IAuthenticatedProps> = ({
  user,
  meta,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleClickMenu = () => {
    setIsOpen(!isOpen)
  }
  return (
    <BrowserRouter>
      {meta}
      <div className="flex flex-col min-h-screen w-full text-base-content">
        {/* Fixed Navbar */}
        <div
          className="fixed top-0 left-0 right-0 z-50"
          style={{ height: NAVBAR_HEIGHT }}
        >
          <Navbar
            user={user}
            siteName={AppConfig.siteName}
            userNavigation={UserNavigation}
            handleMenuStatus={handleClickMenu}
            isOpenMenu={isOpen}
          />
        </div>

        {/* Main content with padding to avoid scrolling under Navbar */}
        <div className="flex w-full" style={{ paddingTop: NAVBAR_HEIGHT }}>
          {/* Sidebar with full viewport height except navbar */}
          <div
            className={`bg-base-100 z-40 fixed sm:border-r-1 h-[calc(100vh-${NAVBAR_HEIGHT}px)] transition-all duration-300`}
          >
            <MergedSidebar
              user={user}
              userNavigation={UserNavigation}
              isOpenMenu={isOpen}
              handleMenuStatus={handleClickMenu}
            />
          </div>

          {/* Routes content */}
          <main
            className={`flex-1 min-h-screen overflow-x-auto scrollbar-hide transition-all duration-300 ${
              isOpen ? "ml-52" : "ml-14"
            } p-1`}
          >
            <AppRouter isOpenMenu={isOpen} />
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default Authenticated
