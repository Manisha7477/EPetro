// import {
//   FaBeer,
//   FaHistory,
//   FaUserCheck,
//   FaRegCalendarAlt,
//   FaRegClock,
// } from "react-icons/fa"
// import { HiDocumentCheck } from "react-icons/hi2"
// import { TbHeartRateMonitor, TbReport } from "react-icons/tb"
// import { MdOutlineInventory } from "react-icons/md"
// import {
//   OperatorDashboardIconsData,
//   MONITORING_DATA,
//   machineHistoryHeaderData,
//   machineHistoryData,
//   ATTENDANCE_HEADER_DATA,
//   ATTENDANCE_DATA,
//   SHIFT_CHANGE_FORM_DATA,
//   LEAVE_APPLICATION_FORM_DATA,
//   INVENTORY_CHECK_HEADER_DATA,
//   INVENTORY_CHECK_DATA,
// } from "@/utils/data"
// import { useNavigate } from "react-router-dom"
// import ModalComponent from "@/components/ModalComponent"
// import { useState } from "react"
// import CardMonitoring from "@/components/Dashboard/CardMonitoring"
// import BasicTable from "@/components/tables/BasicTable"
// import { initialFormikValues, formValidationSchema } from "@/utils/forms"
// // import RequestShiftChangeForm from "@/components/forms/RequestShiftChangeForm"
// // import LeaveApplicationForm from "@/components/forms/LeaveApplicationForm"
// import InventoryCheck from "@/components/Dashboard/InventoryCheck"

// interface IDashboardIconsComponentProps {}
// type IOperatorDashboardIconsData = {
//   label: string
//   iconName: string
//   link?: string
// }

// const DashboardIconsComponent: React.FunctionComponent<
//   IDashboardIconsComponentProps
// > = ({}) => {
//   const navigate = useNavigate()
//   const [modal, setModal] = useState(false)
//   const [selectedTitle, setSelectedTitle] = useState("")

//   const initialDefaultValueData = initialFormikValues(SHIFT_CHANGE_FORM_DATA)
//   const formValidationSchemaData = formValidationSchema(SHIFT_CHANGE_FORM_DATA)
//   const initialDefaultFormLeaveData = initialFormikValues(
//     LEAVE_APPLICATION_FORM_DATA,
//   )
//   const formValidationSchemaLeaveData = formValidationSchema(
//     LEAVE_APPLICATION_FORM_DATA,
//   )

//   const handleClick = (clickItem: IOperatorDashboardIconsData) => {
//     if (clickItem.link) {
//       navigate(clickItem.link)
//     } else {
//       setSelectedTitle(
//         clickItem.label == "Inventory Check"
//           ? "Component Allocation"
//           : clickItem.label,
//       )
//       setModal(true)
//     }
//   }
//   const handleCloseModal = (modalStatus: boolean) => {
//     setModal(modalStatus)
//   }

//   const renderSelectedItems = () => {
//     switch (selectedTitle) {
//       case "Monitoring":
//         return (
//           <div className="w-full sm:grid sm:grid-cols-3 sm:grid-rows-3 gap-4">
//             {MONITORING_DATA.map((selectedItemData, index) => (
//               <CardMonitoring data={selectedItemData} key={index} />
//             ))}
//           </div>
//         )
//       case "Machine History":
//         return (
//           <BasicTable
//             tableHeader={machineHistoryHeaderData}
//             tableData={machineHistoryData}
//             currentPage={0}
//             itemsPerPage={0} searchQuery={""} setSearchQuery={function (query: string): void {
//               throw new Error("Function not implemented.")
//             } }          />
//         )
//       case "Reports":
//         return (
//           <BasicTable
//             tableHeader={INVENTORY_CHECK_HEADER_DATA}
//             tableData={INVENTORY_CHECK_DATA}
//             currentPage={0}
//             itemsPerPage={0} searchQuery={""} setSearchQuery={function (query: string): void {
//               throw new Error("Function not implemented.")
//             } }          />
//         )
//       case "Attendance":
//         return (
//           <BasicTable
//             tableHeader={ATTENDANCE_HEADER_DATA}
//             tableData={ATTENDANCE_DATA}
//             currentPage={0}
//             itemsPerPage={0} searchQuery={""} setSearchQuery={function (query: string): void {
//               throw new Error("Function not implemented.")
//             } }          />
//         )
//       case "Shift Change":
//         return (
//           <RequestShiftChangeForm
//             formVariables={SHIFT_CHANGE_FORM_DATA}
//             initialDefaultValueData={initialDefaultValueData}
//             formValidationSchemaData={formValidationSchemaData}
//           />
//         )
//       case "Component Allocation":
//         return <InventoryCheck />
//       case "Leave Application":
//         return (
//           <LeaveApplicationForm
//             formVariables={LEAVE_APPLICATION_FORM_DATA}
//             initialDefaultValueData={initialDefaultFormLeaveData}
//             formValidationSchemaData={formValidationSchemaLeaveData}
//           />
//         )
//       default:
//         return <div className="w-full text-center">Not Available</div>
//     }
//   }

//   const renderModal = () => (
//     <ModalComponent
//       showModal={modal}
//       handleCloseModal={handleCloseModal}
//       title={selectedTitle}
//     >
//       {renderSelectedItems()}
//     </ModalComponent>
//   )

//   const renderItems = (buttonData: IOperatorDashboardIconsData) => {
//     const iconStyle = "w-10 h-10 text-primary"
//     const label = buttonData.label
//     const iconType = buttonData.iconName

//     let displayIcon
//     if (iconType == "tbreport") {
//       displayIcon = <TbReport className={iconStyle} />
//     } else if (iconType == "monit") {
//       displayIcon = <TbHeartRateMonitor className={iconStyle} />
//     } else if (iconType == "history") {
//       displayIcon = <FaHistory className={iconStyle} />
//     } else if (iconType == "report") {
//       displayIcon = <HiDocumentCheck className={iconStyle} />
//     } else if (iconType == "user") {
//       displayIcon = <FaUserCheck className={iconStyle} />
//     } else if (iconType == "calendar") {
//       displayIcon = <FaRegCalendarAlt className={iconStyle} />
//     } else if (iconType == "clock") {
//       displayIcon = <FaRegClock className={iconStyle} />
//     } else if (iconType == "inevntory") {
//       displayIcon = <MdOutlineInventory className={iconStyle} />
//     } else {
//       displayIcon = <FaBeer className={iconStyle} />
//     }

//     return (
//       <button
//         className="w-24 mb-2 mr-2"
//         key={label}
//         onClick={() => handleClick(buttonData)}
//       >
//         <div className="p-2 border flex items-center justify-center hover:border-primary">
//           {displayIcon}
//         </div>
//         <span className="text-xs">{label}</span>
//       </button>
//     )
//   }

//   return (
//     <>
//       <div className=" w-full sm:flex  flex-wrap items-baseline gap-4  ">
//         {OperatorDashboardIconsData.map((iconData) => renderItems(iconData))}
//       </div>
//       {modal && renderModal()}
//     </>
//   )
// }

// export default DashboardIconsComponent
