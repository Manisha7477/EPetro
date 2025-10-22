import PageHeaderWithSearchAndAdd from "@/navigation/PageHeaderWithSearchAndAdd"
import { ROLE_ASSIGNMENT_HEADER_DATA } from "@/utils/data"
import BasicTable from "@/components/tables/BasicTable"
import { useNavigate } from "react-router-dom"
import { useEffect, useState, useCallback } from "react"
import ModalComponent from "@/components/ModalComponent"
import { startCase } from "lodash"
import axios from "axios"
import Loading from "@/navigation/Loading"
import ModalDeleteComponent from "@/components/forms/ModalDeleteComponent"
import { formatDate, formatDateTime } from "@/utils/convert"
import usePagination from "@/components/UsePagination" // Correct import path
import Pagination from "@/components/Pagination" // Correct import path
import api from "@/api/axiosInstance"
import { FaSearch } from "react-icons/fa"
import { Plus } from "lucide-react"
interface IRoleAssignmentProps {}

const RoleAssignment: React.FunctionComponent<IRoleAssignmentProps> = ({}) => {
  const navigate = useNavigate()
  // const token = nookies.get(null).accessToken || ""
  const [modal, setModal] = useState(false)
  const [selectedViewUser, setSelectedViewUser] = useState<Record<
    string,
    any
  > | null>(null)
  const [listData, setListData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalDelete, setDeleteModal] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [searchQuery, setSearchQuery] = useState("") //aritra change
  const itemsPerPageOptions = [5, 10, 15, 20, 30, 40, 50]
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[1]) // Default to 10 items per page

  const {
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    currentData,
  } = usePagination(totalItems, itemsPerPage)

  // const handleClickViewAction = (infoSelectedRow: Record<string, any>) => {
  //   setSelectedViewUser(infoSelectedRow)
  //   setModal(true)
  // }

  const handleDeleteAction = (infoSelectedRow: Record<string, any>) => {
    setSelectedViewUser(infoSelectedRow)
    setDeleteModal(true)
  }
  // const handleClickEditAction = (infoSelectedRow: Record<string, any>) => {
  //   console.log(infoSelectedRow)
  //   navigate(`/user-mapping/configuration?id=${infoSelectedRow.userId}`)
  // }

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

  const fetchAPI = useCallback(async () => {
    setLoading(true)

    try {
      setLoading(true)

      const response = await api.get("/User/GetAllUserdetails", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
      })

      if (response.data) {
        const filteredData = response.data.filter(
          (item: any) => !item.IsDeleted,
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
      itemId={selectedViewUser?.userId}
      itemName={selectedViewUser?.userName}
      idKey="UserId" //  this tells the modal to send { UserId: itemId } in params
      apiNameUrl="user/DeleteUserMapping"
    />
  )
  return (
    // <div className="sm:ml-10 xl:ml-0 min-w-[80vw]">
      <div className="sm:ml-10 xl:ml-0 w-full max-w-screen-m mx-auto">
      <div className="border rounded border-base-300">
        <PageHeaderWithSearchAndAdd
          title="User Configuration"
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery}
          onAddClick={() => navigate("/user-mapping/configuration")}
        />

        <div className="overflow-auto h-50 py-1">
          <div className=" screen-height-media w-full">
            {loading ? (
              <Loading />
            ) : (
              currentItems && (
                <>
                  <BasicTable
                    tableHeader={ROLE_ASSIGNMENT_HEADER_DATA}
                    tableData={currentItems}
                    handleDeleteAction={handleDeleteAction}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    showAddButton={false}
                    
                  />
                  {/* <BasicTable
                    tableHeader={ROLE_ASSIGNMENT_HEADER_DATA}
                    tableData={currentItems}
                    handleDeleteAction={handleDeleteAction}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    showAddButton={true}
                    addButtonLabel="Create Mapping"
                    onAddButtonClick={() =>
                      navigate("/user-mapping/configuration")
                    }
                  /> */}
                  
                </>
              )
            )}
          </div>
        </div>

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
export default RoleAssignment



// import { ROLE_ASSIGNMENT_HEADER_DATA } from "@/utils/data"
// import BasicTable from "@/components/tables/BasicTable"
// import { useNavigate } from "react-router-dom"
// import { useEffect, useState, useCallback } from "react"
// import ModalComponent from "@/components/ModalComponent"
// import { startCase } from "lodash"
// import axios from "axios"
// import Loading from "@/navigation/Loading"
// import ModalDeleteComponent from "@/components/forms/ModalDeleteComponent"
// import { formatDate, formatDateTime } from "@/utils/convert"
// import usePagination from "@/components/UsePagination" // Correct import path
// import Pagination from "@/components/Pagination" // Correct import path
// import api from "@/api/axiosInstance"
// import { Plus } from "lucide-react"
// interface IRoleAssignmentProps {}

// const RoleAssignment: React.FunctionComponent<IRoleAssignmentProps> = ({}) => {
//   const navigate = useNavigate()
//   // const token = nookies.get(null).accessToken || ""
//   const [modal, setModal] = useState(false)
//   const [selectedViewUser, setSelectedViewUser] = useState<Record<
//     string,
//     any
//   > | null>(null)
//   const [listData, setListData] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [modalDelete, setDeleteModal] = useState(false)
//   const [totalItems, setTotalItems] = useState(0)
//   const [searchQuery, setSearchQuery] = useState("") //aritra change
//   const itemsPerPageOptions = [5, 10, 15, 20, 30, 40, 50]
//   const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[1]) // Default to 10 items per page

//   const {
//     currentPage,
//     totalPages,
//     goToNextPage,
//     goToPreviousPage,
//     goToPage,
//     currentData,
//   } = usePagination(totalItems, itemsPerPage)

//   // const handleClickViewAction = (infoSelectedRow: Record<string, any>) => {
//   //   setSelectedViewUser(infoSelectedRow)
//   //   setModal(true)
//   // }

//   const handleDeleteAction = (infoSelectedRow: Record<string, any>) => {
//     setSelectedViewUser(infoSelectedRow)
//     setDeleteModal(true)
//   }
//   // const handleClickEditAction = (infoSelectedRow: Record<string, any>) => {
//   //   console.log(infoSelectedRow)
//   //   navigate(`/user-mapping/configuration?id=${infoSelectedRow.userId}`)
//   // }

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

//   const fetchAPI = useCallback(async () => {
//     setLoading(true)

//     try {
//       setLoading(true)

//       const response = await api.get("/User/GetAllUserdetails", {
//         params: {
//           page: currentPage,
//           limit: itemsPerPage,
//         },
//       })

//       if (response.data) {
//         const filteredData = response.data.filter(
//           (item: any) => !item.IsDeleted,
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
//       itemId={selectedViewUser?.userId}
//       itemName={selectedViewUser?.userName}
//       idKey="UserId" //  this tells the modal to send { UserId: itemId } in params
//       apiNameUrl="user/DeleteUserMapping"
//     />
//   )

//   return (
//     <div className=" min-w-[80vw]">
//       <div className="border rounded border-base-300">
//         <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1 mt-16">
//           User Configuration
//         </div>

//         <div className="overflow-auto h-50">
//           <div className="p-4 bg-neutral screen-height-media w-full">
//             {loading ? (
//               <Loading />
//             ) : (
//               currentItems && (
//                 <>
//                   <BasicTable
//                     tableHeader={ROLE_ASSIGNMENT_HEADER_DATA}
//                     tableData={currentItems}
//                     handleDeleteAction={handleDeleteAction}
//                     searchQuery={searchQuery}
//                     setSearchQuery={setSearchQuery}
//                     currentPage={currentPage}
//                     itemsPerPage={itemsPerPage}
//                     showAddButton={true}
//                     addButtonLabel="Create Mapping"
//                     onAddButtonClick={() =>
//                       navigate("/user-mapping/configuration")
//                     }
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

//         {modalDelete && renderDeleteModal()}
//       </div>
//     </div>
//   )
// }
// export default RoleAssignment

// //     <div className="w-full">
// //       <div className="border rounded border-base-300">
// //         <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1 mt-16">
// //           User Configuration
// //         </div>
// //         <div className="w-full p-4 bg-neutral screen-height-media">
// //           <div className="w-full mb-2 text-right flex justify-end">
// //             {/* <span className="self-center font-bold text-sm">
// //               User Overview
// //             </span> */}
// //             {/* <button
// //               className="btn btn-primary btn-outline btn-sm "
// //               onClick={() => navigate("/user-mapping/configuration")}
// //             >
// //               Add New
// //             </button> */}
// //             {/* <button
// //               className="px-2 py-1 text-s sm:float-right mb-2 flex items-center gap-1 border border-primary text-primary rounded hover:bg-primary hover:text-white transition"
// //               onClick={() => navigate("/user-mapping/configuration")}
// //             >
// //               <Plus className="w-4 h-4" />
// //               Create
// //             </button> */}
// //           </div>
// //           {loading ? (
// //             <Loading />
// //           ) : (
// //             currentItems && (
// //               <>
// //                 <BasicTable
// //                   tableHeader={ROLE_ASSIGNMENT_HEADER_DATA}
// //                   tableData={currentItems} // Use currentItems after filtering and pagination
// //                   handleDeleteAction={handleDeleteAction}
// //                   // handleClickEditAction={handleClickEditAction}
// //                   searchQuery={searchQuery}
// //                   setSearchQuery={setSearchQuery}
// //                   currentPage={currentPage} // Pass currentPage here
// //                   itemsPerPage={itemsPerPage} // Pass itemsPerPage here />
// //                   showAddButton={true}
// //                   addButtonLabel="Create Mapping"
// //                   onAddButtonClick={() =>
// //                     navigate("/user-mapping/configuration")
// //                   }
// //                 />
// //                 <Pagination
// //                   currentPage={currentPage}
// //                   totalPages={totalPages}
// //                   goToPage={goToPage}
// //                   goToNextPage={goToNextPage}
// //                   goToPreviousPage={goToPreviousPage}
// //                   itemsPerPage={itemsPerPage}
// //                   setItemsPerPage={setItemsPerPage}
// //                   itemsPerPageOptions={itemsPerPageOptions}
// //                 />
// //               </>
// //             )
// //           )}
// //         </div>
// //       </div>
// //       {/* {modal && renderModal()} */}
// //       {modalDelete && renderDeleteModal()}
// //     </div>
// //   )
// // }
