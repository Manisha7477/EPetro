// import React, { useState } from "react"
// import { AppConfig } from "@/utils/AppConfig"
// import { MenuItem } from "@/utils/types"
// import { SubMenu } from "@/navigation/SubMenu"
// import { classNames } from "@/utils/dom"

// interface SideBarProps {
//   data: MenuItem[]
// }

// export const SideBar: React.FC<SideBarProps> = ({ data }) => {
//   const [isOpen, setIsOpen] = useState(false)

//   return (
//     <aside
//       className={classNames(
//         "z-50 h-full sticky top-0", // Sticky sidebar that stays in view
//         isOpen ? "w-72" : "w-20",
//       )}
//     >
//       <div className="drawer-content">
//         <label
//           className="btn btn-sm bg-neutral-50 drawer-button m-4"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           <img src={`${AppConfig.imagePath}/menu.png`} alt="menuIcon" />
//         </label>
//       </div>
//       <div className="drawer-side w-72 h-full overflow-y-auto bg-base-100">
//         {/* Sidebar becomes scrollable */}
//         <ul className="menu p-4 w-72 text-base-content">
//           {data.map((item) => (
//             <SubMenu key={item.title} data={item} />
//           ))}
//         </ul>
//       </div>
//     </aside>
//   )
// }

// // This component renders a sidebar with a toggle button to open/close it.
// // It uses the `SubMenu` component to render each menu item.
// // The sidebar is styled to be sticky and scrollable, with a width that changes based on the `isOpen` state.
// // The `classNames` utility is used to conditionally apply classes based on the sidebar's open state.
// // The sidebar's width is set to 72 when open and 20 when closed, providing a responsive design.
// // The `AppConfig` is used to get the image path for the menu icon.
// // The sidebar contains a button that toggles its open state, allowing users to expand or collapse the sidebar.
// // The `data` prop is an array of menu items, each of which is passed to the `SubMenu` component for rendering.
// // The sidebar is designed to be user-friendly, with a clear toggle button and organized menu items.
// // The sidebar's content is wrapped in a `drawer-side` class to ensure it behaves correctly within the layout.
// // The sidebar is responsive, adapting its width based on the `isOpen` state, making it suitable for various screen sizes.
// // The sidebar is designed to be accessible, with a clear button for toggling its visibility.

// // The sidebar's design follows best practices for navigation components, ensuring a consistent user experience across the application.
// // The sidebar is part of a larger layout, typically used in conjunction with a main content area that adjusts based on the sidebar's state.
// // The sidebar's styling is based on Tailwind CSS classes, providing a modern and clean look.
