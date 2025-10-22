import {
  OperationalNexusAreaTableHeader,
  USER_STRUCTURE_HEADER_DATA,
} from "@/utils/data"
import BasicTable from "@/components/tables/BasicTable"
import { useNavigate } from "react-router-dom"
import { useEffect, useState, useCallback } from "react"
import ModalComponent from "@/components/ModalComponent"
import { startCase } from "lodash"
import ModalDeleteComponent from "@/components/forms/ModalDeleteComponent"
import axios from "axios"
import { formatDate, formatDateTime } from "@/utils/convert"
import Loading from "@/navigation/Loading"
import usePagination from "@/components/UsePagination" // Correct import path
import nookies from "nookies"
import type { ITableHeader } from "@/utils/types"
import api from "@/api/axiosInstance"
import Pagination from "@/components/Pagination"
import PageHeaderWithSearchAndAdd from "@/navigation/PageHeaderWithSearchAndAdd"

interface IManageAreaFormDataProps {}

const ManageArea: React.FunctionComponent<IManageAreaFormDataProps> = ({}) => {
  const token = nookies.get(null).accessToken || ""
  const navigate = useNavigate()
  const [modal, setModal] = useState(false)
  const [selectedViewUser, setSelectedViewUser] = useState<Record<
    string,
    any
  > | null>(null)

  const [listData, setListData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalDelete, setDeleteModal] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [globalFilter, setGlobalFilter] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const itemsPerPageOptions = [5, 10, 15, 20, 30, 40, 50]
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[1]) // Default to 10 items per page
  const [tableHeaderFilter, setTableHeaderFilter] = useState(
    USER_STRUCTURE_HEADER_DATA,
  )

  const {
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    currentData,
  } = usePagination(totalItems, itemsPerPage)

  const handleClickEditAction = (infoSelectedRow: Record<string, any>) => {
    console.log(infoSelectedRow)
    navigate(`/area/configuration/update?id=${infoSelectedRow.areaId}`)
  }

  const handleClickViewAction = (infoSelectedRow: Record<string, any>) => {
    const { serialNumber, ...rest } = infoSelectedRow // Exclude serialNumber
    setSelectedViewUser(rest) // Set the filtered object
    setModal(true)
  }

  const handleDeleteAction = (infoSelectedRow: Record<string, any>) => {
    console.log("Row selected for deletion:", infoSelectedRow) // Debug
    setSelectedViewUser(infoSelectedRow)
    setDeleteModal(true)
  }

  const handleCloseModal = (modalStatus: boolean) => {
    setModal(modalStatus)
  }

  const handleCloseDeleteModal = (modalDeleteStatus: boolean) => {
    setDeleteModal(modalDeleteStatus)
  }

  const handleSuccessCloseDeleteModal = (modalDeleteStatus: boolean) => {
    setDeleteModal(modalDeleteStatus)
    fetchAPI()
  }

  const handleVisibleStatus = (itemsUpdatedData: ITableHeader[]) => {
    const filterTableHeader = itemsUpdatedData.filter((item) => item.visible)
    setTableHeaderFilter(filterTableHeader)
  }

  const filterTableHeader = tableHeaderFilter?.filter((item) => item.visible)
  const fetchAPI = useCallback(async () => {
    setLoading(true)

    try {
      setLoading(true)

      const response = await api.get("/Area/GetAllAreaDetails", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
      })

      if (response.data) {
        const filteredData = response.data.filter(
          (item: any) => !item.deleteFlag,
        )
        setListData(filteredData)
        setTotalItems(filteredData.length)
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, itemsPerPage])

  useEffect(() => {
    fetchAPI()
  }, [fetchAPI])

  // Filter data based on search query BEFORE pagination
  const filteredData = listData.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  )

  // Apply pagination AFTER filtering
  const currentItems = currentData(filteredData).map((item, index) => ({
    ...item,
    serialNumber: (currentPage - 1) * itemsPerPage + index + 1,
  }))

  const renderDeleteModal = () => (
    <ModalDeleteComponent
      showDeleteModal={modalDelete}
      handleCloseDeleteModal={handleCloseDeleteModal}
      handleSuccessCloseDeleteModal={handleSuccessCloseDeleteModal}
      itemId={selectedViewUser?.areaId}
      itemName={selectedViewUser?.areaName}
      idKey="AreaId" //  this tells the modal to send { UserId: itemId } in params
      apiNameUrl="Area/DeleteAreaDetails"
    />
  )

  const renderModal = () => (
    <ModalComponent
      showModal={modal}
      handleCloseModal={handleCloseModal}
      title={`Area Details(${selectedViewUser?.areaId})`}
    >
      {renderSelectedItems()}
      {/* <TableHeaderConfig
        tableHeaderData={USER_STRUCTURE_HEADER_DATA}
        handleVisibleStatus={handleVisibleStatus}
      /> */}
    </ModalComponent>
  )

  const renderSelectedItems = () => {
    return (
      <div className="overflow-x-auto w-full sm:max-w-sm mx-auto">
        <table className="table table-xs border border-base-300">
          <tbody>
            {Object.keys(selectedViewUser ?? {})
              .filter(
                (keyItem) =>
                  !["deleteFlag", "userId", "areaId"].includes(keyItem),
              )
              .map((keyItem, index) => {
                let value = selectedViewUser![keyItem]
                // Format 'ModifiedBy' field
                if (keyItem === "ModifiedBy") {
                  value = value || "NA"
                }
                // Format dates if applicable
                if (
                  keyItem === "CreationDate" ||
                  keyItem === "LastModifiedDate"
                ) {
                  value = formatDateTime(value)
                } else if (keyItem === "validFrom" || keyItem === "validTo") {
                  value = formatDate(value)
                } else {
                  value = value?.toString()
                }

                return (
                  <tr key={keyItem + index}>
                    <td className="font-semibold">{startCase(keyItem)}</td>
                    <td>
                      <span className="mr-2">:</span>
                      {value}
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className=" min-w-[80vw]">
      <div className="border rounded border-base-300">
        {/* <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1 mt-16">
          Manage Area
        </div> */}
        <PageHeaderWithSearchAndAdd
          title="Manage Area"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClick={() => navigate("/area/configuration")}
        />
        <div className="overflow-auto h-50">
          <div className="p-4  screen-height-media w-full">
            {/* <button
              className="sm:btn btn-primary btn-outline btn-sm sm:float-right mb-2"
              onClick={() => navigate("/area/configuration")}
            >
              Create New Area
            </button> */}
            {/* <button
              className="px-2 py-1 text-s sm:float-right mb-2 flex items-center gap-1 border border-primary text-primary rounded hover:bg-primary hover:text-white transition"
              onClick={() => navigate("/area/configuration")}
            >
              <Plus className="w-4 h-4" />
              Create
            </button> */}
            {loading ? (
              <Loading />
            ) : (
              currentItems && (
                <>
                  <BasicTable
                    tableHeader={OperationalNexusAreaTableHeader} // Use the correct table header
                    tableData={currentItems} // Use currentItems after filtering and pagination
                    handleClickEditAction={handleClickEditAction}
                    handleClickViewAction={handleClickViewAction}
                    handleDeleteAction={handleDeleteAction}
                    searchQuery={searchQuery} // aritra change
                    setSearchQuery={setSearchQuery} // aritra change
                    currentPage={currentPage} // Pass currentPage here
                    itemsPerPage={itemsPerPage} // Pass itemsPerPage here />
                    showAddButton={true}
                    addButtonLabel="Create Area"
                    onAddButtonClick={() => navigate("/area/configuration")}
                  />
                  
                </>
              )
            )}
          </div>
        </div>
        {modal && renderModal()}
        {modalDelete && renderDeleteModal()}
        <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPage={goToPage}
                    goToNextPage={goToNextPage}
                    goToPreviousPage={goToPreviousPage}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    itemsPerPageOptions={itemsPerPageOptions}
                  />
      </div>
    </div>
  )
}

export default ManageArea






// import {
//   OperationalNexusAreaTableHeader,
//   USER_STRUCTURE_HEADER_DATA,
// } from "@/utils/data"
// import BasicTable from "@/components/tables/BasicTable"
// import { useNavigate } from "react-router-dom"
// import { useEffect, useState, useCallback } from "react"
// import ModalComponent from "@/components/ModalComponent"
// import { startCase } from "lodash"
// import ModalDeleteComponent from "@/components/forms/ModalDeleteComponent"
// import axios from "axios"
// import { formatDate, formatDateTime } from "@/utils/convert"
// import Loading from "@/navigation/Loading"
// import usePagination from "@/components/UsePagination" // Correct import path
// import nookies from "nookies"
// import type { ITableHeader } from "@/utils/types"
// import api from "@/api/axiosInstance"
// import Pagination from "@/components/Pagination"

// interface IManageAreaFormDataProps {}

// const ManageArea: React.FunctionComponent<IManageAreaFormDataProps> = ({}) => {
//   const token = nookies.get(null).accessToken || ""
//   const navigate = useNavigate()
//   const [modal, setModal] = useState(false)
//   const [selectedViewUser, setSelectedViewUser] = useState<Record<
//     string,
//     any
//   > | null>(null)

//   const [listData, setListData] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [modalDelete, setDeleteModal] = useState(false)
//   const [totalItems, setTotalItems] = useState(0)
//   const [globalFilter, setGlobalFilter] = useState("")
//   const [searchQuery, setSearchQuery] = useState("")
//   const itemsPerPageOptions = [5, 10, 15, 20, 30, 40, 50]
//   const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[1]) // Default to 10 items per page
//   const [tableHeaderFilter, setTableHeaderFilter] = useState(
//     USER_STRUCTURE_HEADER_DATA,
//   )

//   const {
//     currentPage,
//     totalPages,
//     goToNextPage,
//     goToPreviousPage,
//     goToPage,
//     currentData,
//   } = usePagination(totalItems, itemsPerPage)

//   const handleClickEditAction = (infoSelectedRow: Record<string, any>) => {
//     console.log(infoSelectedRow)
//     navigate(`/area/configuration/update?id=${infoSelectedRow.areaId}`)
//   }

//   const handleClickViewAction = (infoSelectedRow: Record<string, any>) => {
//     const { serialNumber, ...rest } = infoSelectedRow // Exclude serialNumber
//     setSelectedViewUser(rest) // Set the filtered object
//     setModal(true)
//   }

//   const handleDeleteAction = (infoSelectedRow: Record<string, any>) => {
//     console.log("Row selected for deletion:", infoSelectedRow) // Debug
//     setSelectedViewUser(infoSelectedRow)
//     setDeleteModal(true)
//   }

//   const handleCloseModal = (modalStatus: boolean) => {
//     setModal(modalStatus)
//   }

//   const handleCloseDeleteModal = (modalDeleteStatus: boolean) => {
//     setDeleteModal(modalDeleteStatus)
//   }

//   const handleSuccessCloseDeleteModal = (modalDeleteStatus: boolean) => {
//     setDeleteModal(modalDeleteStatus)
//     fetchAPI()
//   }

//   const handleVisibleStatus = (itemsUpdatedData: ITableHeader[]) => {
//     const filterTableHeader = itemsUpdatedData.filter((item) => item.visible)
//     setTableHeaderFilter(filterTableHeader)
//   }

//   const filterTableHeader = tableHeaderFilter?.filter((item) => item.visible)
//   const fetchAPI = useCallback(async () => {
//     setLoading(true)

//     try {
//       setLoading(true)

//       const response = await api.get("/Area/GetAllAreaDetails", {
//         params: {
//           page: currentPage,
//           limit: itemsPerPage,
//         },
//       })

//       if (response.data) {
//         const filteredData = response.data.filter(
//           (item: any) => !item.deleteFlag,
//         )
//         setListData(filteredData)
//         setTotalItems(filteredData.length)
//       }
//     } catch (error) {
//       console.error("Error fetching user details:", error)
//     } finally {
//       setLoading(false)
//     }
//   }, [currentPage, itemsPerPage])

//   useEffect(() => {
//     fetchAPI()
//   }, [fetchAPI])

//   // Filter data based on search query BEFORE pagination
//   const filteredData = listData.filter((item) =>
//     Object.values(item).some((value) =>
//       value?.toString().toLowerCase().includes(searchQuery.toLowerCase()),
//     ),
//   )

//   // Apply pagination AFTER filtering
//   const currentItems = currentData(filteredData).map((item, index) => ({
//     ...item,
//     serialNumber: (currentPage - 1) * itemsPerPage + index + 1,
//   }))

//   const renderDeleteModal = () => (
//     <ModalDeleteComponent
//       showDeleteModal={modalDelete}
//       handleCloseDeleteModal={handleCloseDeleteModal}
//       handleSuccessCloseDeleteModal={handleSuccessCloseDeleteModal}
//       itemId={selectedViewUser?.areaId}
//       itemName={selectedViewUser?.areaName}
//       idKey="AreaId" //  this tells the modal to send { UserId: itemId } in params
//       apiNameUrl="Area/DeleteAreaDetails"
//     />
//   )

//   const renderModal = () => (
//     <ModalComponent
//       showModal={modal}
//       handleCloseModal={handleCloseModal}
//       title={`Area Details(${selectedViewUser?.areaId})`}
//     >
//       {renderSelectedItems()}
//       {/* <TableHeaderConfig
//         tableHeaderData={USER_STRUCTURE_HEADER_DATA}
//         handleVisibleStatus={handleVisibleStatus}
//       /> */}
//     </ModalComponent>
//   )

//   const renderSelectedItems = () => {
//     return (
//       <div className="overflow-x-auto w-full sm:max-w-sm mx-auto">
//         <table className="table table-xs border border-base-300">
//           <tbody>
//             {Object.keys(selectedViewUser ?? {})
//               .filter(
//                 (keyItem) =>
//                   !["deleteFlag", "userId", "areaId"].includes(keyItem),
//               )
//               .map((keyItem, index) => {
//                 let value = selectedViewUser![keyItem]
//                 // Format 'ModifiedBy' field
//                 if (keyItem === "ModifiedBy") {
//                   value = value || "NA"
//                 }
//                 // Format dates if applicable
//                 if (
//                   keyItem === "CreationDate" ||
//                   keyItem === "LastModifiedDate"
//                 ) {
//                   value = formatDateTime(value)
//                 } else if (keyItem === "validFrom" || keyItem === "validTo") {
//                   value = formatDate(value)
//                 } else {
//                   value = value?.toString()
//                 }

//                 return (
//                   <tr key={keyItem + index}>
//                     <td className="font-semibold">{startCase(keyItem)}</td>
//                     <td>
//                       <span className="mr-2">:</span>
//                       {value}
//                     </td>
//                   </tr>
//                 )
//               })}
//           </tbody>
//         </table>
//       </div>
//     )
//   }

//   return (
//     <div className=" min-w-[80vw]">
//       <div className="border rounded border-base-300">
//         <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1 mt-16">
//           Manage Area
//         </div>

//         <div className="overflow-auto h-50">
//           <div className="p-4 bg-neutral screen-height-media w-full">
//             {/* <button
//               className="sm:btn btn-primary btn-outline btn-sm sm:float-right mb-2"
//               onClick={() => navigate("/area/configuration")}
//             >
//               Create New Area
//             </button> */}
//             {/* <button
//               className="px-2 py-1 text-s sm:float-right mb-2 flex items-center gap-1 border border-primary text-primary rounded hover:bg-primary hover:text-white transition"
//               onClick={() => navigate("/area/configuration")}
//             >
//               <Plus className="w-4 h-4" />
//               Create
//             </button> */}
//             {loading ? (
//               <Loading />
//             ) : (
//               currentItems && (
//                 <>
//                   <BasicTable
//                     tableHeader={OperationalNexusAreaTableHeader} // Use the correct table header
//                     tableData={currentItems} // Use currentItems after filtering and pagination
//                     handleClickEditAction={handleClickEditAction}
//                     handleClickViewAction={handleClickViewAction}
//                     handleDeleteAction={handleDeleteAction}
//                     searchQuery={searchQuery} // aritra change
//                     setSearchQuery={setSearchQuery} // aritra change
//                     currentPage={currentPage} // Pass currentPage here
//                     itemsPerPage={itemsPerPage} // Pass itemsPerPage here />
//                     showAddButton={true}
//                     addButtonLabel="Create Area"
//                     onAddButtonClick={() => navigate("/area/configuration")}
//                   />
//                   <Pagination
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     goToPage={goToPage}
//                     goToNextPage={goToNextPage}
//                     goToPreviousPage={goToPreviousPage}
//                     itemsPerPage={itemsPerPage}
//                     setItemsPerPage={setItemsPerPage}
//                     itemsPerPageOptions={itemsPerPageOptions}
//                   />
//                 </>
//               )
//             )}
//           </div>
//         </div>
//         {modal && renderModal()}
//         {modalDelete && renderDeleteModal()}
//       </div>
//     </div>
//   )
// }

// export default ManageArea
