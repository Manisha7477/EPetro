import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { classNames } from "@/utils/dom"
import { Link, useLocation } from "react-router-dom"
import { HiOutlineTable } from "react-icons/hi"
import { IMenu, ISubMenu, IUser } from "@/utils/types"
import { useAuth } from "@/contexts/auth"

import api from "../api/axiosInstance"
import { LuUsers } from "react-icons/lu"
import { LuUserCog } from "react-icons/lu"
import { RiDashboard2Fill } from "react-icons/ri" //plantperformance
import { FaHome } from "react-icons/fa" //dashboards
import { MdAccessAlarms } from "react-icons/md" //alarms
import { IoSettingsOutline } from "react-icons/io5" //settings
import { RiUserSharedLine } from "react-icons/ri" // User Mapping
import { LuUserCheck } from "react-icons/lu"
import { GrDocumentPerformance } from "react-icons/gr"
import { GiFactory } from "react-icons/gi"
import { MdShareLocation } from "react-icons/md" // Area operational nexus
import { BsBarChartSteps } from "react-icons/bs"
import { TbCubePlus } from "react-icons/tb"
import { TbDashboard } from "react-icons/tb" //dashboard home
import { BiSolidPackage } from "react-icons/bi"
import { HiBellAlert } from "react-icons/hi2"
import { MdOutlineElectricMeter } from "react-icons/md"
import { FaChevronDown, FaChevronUp } from "react-icons/fa6"
import { BiAlarmExclamation } from "react-icons/bi"

const iconMap = {
  LuUsers,
  LuUserCog,
  LuUserCheck,
  GrDocumentPerformance,
  GiFactory,
  TbCubePlus,
  BsBarChartSteps,
  MdShareLocation, // Area operational nexus
  RiUserSharedLine, // User Mapping
  RiDashboard2Fill, // Plant Performance
  FaHome, // Dashboards
  MdAccessAlarms, // Alarms
  IoSettingsOutline, // Settings
  TbDashboard,
  BiSolidPackage, // Package
  HiBellAlert, // Alerts
  MdOutlineElectricMeter, // Edge Devices
  BiAlarmExclamation,
}

const getIconComponent = (iconName: string | number) => {
  return iconMap[iconName as keyof typeof iconMap] || null
}

interface SideBarMenuProps {
  user: IUser
  isOpenMenu: boolean
}

const userHasAccess = (userRole: string, accessRoles: string[] | string) => {
  if (Array.isArray(accessRoles)) return accessRoles.includes(userRole)
  return accessRoles === userRole
}

// Create tooltip root element if it doesn't exist
const getTooltipRoot = () => {
  let tooltipRoot = document.getElementById("tooltip-root")
  if (!tooltipRoot) {
    tooltipRoot = document.createElement("div")
    tooltipRoot.id = "tooltip-root"
    tooltipRoot.style.position = "absolute"
    tooltipRoot.style.top = "0"
    tooltipRoot.style.left = "0"
    tooltipRoot.style.pointerEvents = "none"
    tooltipRoot.style.zIndex = "2147483647" // Maximum z-index value
    document.body.appendChild(tooltipRoot)
  }
  return tooltipRoot
}

const SideBarMenu: React.FC<SideBarMenuProps> = ({ isOpenMenu }) => {
  const { pathname } = useLocation()
  const { user, loading } = useAuth()

  // Modified: Single menu state management
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [menuData, setMenuData] = useState<IMenu[] | undefined>([])
  const [tooltipState, setTooltipState] = useState<{
    show: boolean
    text: string
    position: { x: number; y: number }
  }>({
    show: false,
    text: "",
    position: { x: 0, y: 0 },
  })

  // Fetch menu data from API
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await api.get(`/Permission/GetPermissions`)
        if (response.status === 200) {
          const roleMatchedData = response.data.find(
            (role: any) => role.roleName === user?.role,
          )

          if (roleMatchedData) {
            const menuList: IMenu[] = roleMatchedData.getMenuLists?.map(
              (menuItem: any) => {
                const subMenuData: ISubMenu[] =
                  menuItem.subMenuLists?.map((sub: any) => ({
                    subMenuId: sub.subMenuId,
                    subMenuName: sub.subMenuName,
                    subMenuURL: sub.subMenuURL || "",
                    subMenuIcon: sub.subMenuIcon || "",
                  })) || []

                return {
                  menuId: menuItem.menuId,
                  menuName: menuItem.menuName,
                  menuURL: menuItem.menuURL || "",
                  menuIcon: menuItem.menuIcon || "",
                  accessRole: user?.role || "admin",
                  subMenus: subMenuData,
                }
              },
            )
            setMenuData(menuList)
          }
        }
      } catch (error) {
        console.error("Error fetching menu data", error)
        setMenuData([])
      }
    }

    fetchMenuData()
  }, [user?.role])

  // Single menu toggle function
  const toggleMenu = (menuName: string) => {
    setActiveMenu((prev) => (prev === menuName ? null : menuName))
  }

  // Show tooltip function
  const showTooltip = (text: string, event: React.MouseEvent) => {
    if (!isOpenMenu) {
      const rect = event.currentTarget.getBoundingClientRect()
      setTooltipState({
        show: true,
        text,
        position: {
          x: rect.right + 12, // Position to the right of the icon
          y: rect.top + rect.height / 2 - 15, // Center vertically
        },
      })
    }
  }

  // Hide tooltip function
  const hideTooltip = () => {
    setTooltipState((prev) => ({ ...prev, show: false }))
  }

  // Portal Tooltip Component - renders above all layers
  const PortalTooltip: React.FC = () => {
    if (!tooltipState.show || isOpenMenu) return null

    return createPortal(
      <div
        className="fixed pointer-events-none z-[2147483647] transition-all duration-300 ease-in-out"
        style={{
          left: `${tooltipState.position.x}px`,
          top: `${tooltipState.position.y}px`,
          zIndex: 2147483647, // Maximum possible z-index
        }}
      >
        <div className="relative">
          {/* Tooltip arrow */}
          <div
            className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"
            style={{ zIndex: 2147483647 }}
          />
          {/* Tooltip content */}
          <div
            className="bg-gray-900 text-white text-sm font-medium px-3 py-2 rounded-lg shadow-2xl whitespace-nowrap border border-gray-700"
            style={{ zIndex: 2147483647 }}
          >
            {tooltipState.text}
          </div>
        </div>
      </div>,
      getTooltipRoot(),
    )
  }

  const renderMenu = () => {
    return (
      menuData &&
      menuData.map((menuItem: IMenu) => {
        if (userHasAccess(user?.role || "", menuItem.accessRole)) {
          const MenuIconComponent = getIconComponent(menuItem.menuIcon)
          const isMenuActive = activeMenu === menuItem.menuName
          const hasSubMenus = menuItem?.subMenus?.length > 0

          return (
            <li className="mb-1" key={menuItem.menuId}>
              {hasSubMenus ? (
                <div>
                  <div
                    className={classNames(
                      "flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-base-200 hover:shadow-sm",
                      isMenuActive ? "bg-base-200 shadow-sm" : "",
                      !isOpenMenu ? "justify-center px-2" : "", // Center icon when collapsed
                    )}
                    onClick={() => toggleMenu(menuItem.menuName)}
                    onMouseEnter={(e) => showTooltip(menuItem.menuName, e)}
                    onMouseLeave={hideTooltip}
                  >
                    <div className="flex-shrink-0">
                      {MenuIconComponent ? (
                        <MenuIconComponent className="w-6 h-6 transition-all duration-200" />
                      ) : (
                        <HiOutlineTable className="w-6 h-6 transition-all duration-200" />
                      )}
                    </div>
                    {isOpenMenu && (
                      <>
                        <span className="flex-1 truncate">
                          {menuItem.menuName}
                        </span>
                        <span className="text-sm transition-transform duration-200">
                          {isMenuActive ? (
                            <FaChevronUp className="w-3 h-3" />
                          ) : (
                            <FaChevronDown className="w-3 h-3" />
                          )}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Submenu - show when menu is open OR when sidebar is collapsed and menu is active */}
                  {isMenuActive && (
                    <div
                      className={classNames(
                        "transition-all duration-300 ease-in-out",
                        isOpenMenu
                          ? "border-l-2 border-gray-200 pl-2 ml-2 mt-2 space-y-1"
                          : "flex flex-col items-center mt-2 space-y-2",
                      )}
                    >
                      {renderSubMenu(menuItem.subMenus, isOpenMenu)}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={menuItem.menuURL}
                  className={classNames(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-base-200 hover:shadow-sm",
                    pathname.includes(menuItem.menuURL)
                      ? "text-primary bg-primary/10 shadow-sm border-l-2 border-primary"
                      : "hover:text-primary",
                    !isOpenMenu ? "justify-center px-2" : "", // Center icon when collapsed
                  )}
                  onMouseEnter={(e) => showTooltip(menuItem.menuName, e)}
                  onMouseLeave={hideTooltip}
                >
                  <div className="flex-shrink-0">
                    {MenuIconComponent ? (
                      <MenuIconComponent className="w-6 h-6 transition-all duration-200" />
                    ) : (
                      <HiOutlineTable className="w-6 h-6 transition-all duration-200" />
                    )}
                  </div>
                  {isOpenMenu && (
                    <span className="truncate">{menuItem.menuName}</span>
                  )}
                </Link>
              )}
            </li>
          )
        }
        return null
      })
    )
  }

  const renderSubMenu = (subMenus: ISubMenu[], isExpanded: boolean) => {
    return (
      subMenus &&
      subMenus.map((subItem, index) => {
        const SubMenuIconComponent = getIconComponent(subItem.subMenuIcon)

        return (
          <div
            key={subItem.subMenuId}
            className={classNames(
              "transition-all duration-200",
              isExpanded ? "block" : "flex justify-center",
            )}
            style={!isExpanded ? { animationDelay: `${index * 50}ms` } : {}}
          >
            <Link
              to={subItem.subMenuURL}
              className={classNames(
                "flex items-center transition-all duration-200 hover:bg-base-200 rounded-md hover:shadow-sm",
                isExpanded
                  ? "gap-1 px-1 py-1 text-sm hover:pl-2"
                  : "p-1 justify-center w-10 h-10 hover:w-11 hover:h-11",
                pathname.includes(subItem.subMenuURL)
                  ? "text-primary bg-primary/10 shadow-sm"
                  : "hover:text-primary",
                pathname.includes(subItem.subMenuURL) && isExpanded
                  ? "border-l-2 border-primary/50 pl-2"
                  : "",
              )}
              onMouseEnter={(e) => showTooltip(subItem.subMenuName, e)}
              onMouseLeave={hideTooltip}
            >
              <div className="flex-shrink-0">
                {SubMenuIconComponent ? (
                  <SubMenuIconComponent
                    className={classNames(
                      "transition-all duration-200",
                      isExpanded ? "w-4 h-4" : "w-4 h-4 hover:w-5 hover:h-5",
                    )}
                  />
                ) : (
                  <HiOutlineTable
                    className={classNames(
                      "transition-all duration-200",
                      isExpanded ? "w-4 h-4" : "w-4 h-4 hover:w-5 hover:h-5",
                    )}
                  />
                )}
              </div>
              {isExpanded && (
                <span className="truncate">{subItem.subMenuName}</span>
              )}
            </Link>
          </div>
        )
      })
    )
  }

  return (
    <>
      {/* Portal Tooltip - renders above everything */}
      <PortalTooltip />

      <div
        className={classNames(
          "drawer sm:drawer-open z-40", // Reduced base z-index to allow tooltips to appear above
          isOpenMenu ? "drawer-open" : "",
        )}
      >
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>

          {/* Fixed height container */}
          <div className="bg-base-100 h-auto w-auto overflow-hidden scrollbar-hidden">
            <div
              className={classNames(
                "h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent transition-all duration-300",
                isOpenMenu ? "w-full" : "w-full", // Dynamic padding
                isOpenMenu ? "block" : "hidden sm:block",
              )}
            >
              {/* Menu container with fixed height */}
              <nav className="h-full relative">
                {" "}
                {/* Added relative positioning for tooltip context */}
                <ul
                  className={classNames(
                    "transition-all duration-300",
                    isOpenMenu ? "space-y-1" : "space-y-1",
                  )}
                >
                  {renderMenu()}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SideBarMenu
