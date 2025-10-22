import ModalDeleteComponent from "@/components/forms/ModalDeleteComponent"
import ModalComponent from "@/components/ModalComponent"
import BasicTable from "@/components/tables/BasicTable"
import usePagination from "@/components/UsePagination" // Correct import path
import Loading from "@/navigation/Loading"
import { formatDate, formatDateTime } from "@/utils/convert"
import {
  OperationNexusPlantTableHeader,
  USER_STRUCTURE_HEADER_DATA,
} from "@/utils/data"
import { startCase } from "lodash"
import nookies from "nookies"
import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import api from "@/api/axiosInstance"
import Pagination from "@/components/Pagination"
import PageHeaderWithSearchAndAdd from "@/navigation/PageHeaderWithSearchAndAdd"
import type { ITableHeader } from "@/utils/types"
interface IManagePlantsProps {}

const ManagePlants: React.FunctionComponent<IManagePlantsProps> = ({}) => {
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
    console.log("row=" + infoSelectedRow.plantId)
    navigate(`/on-plant/configuration/update?id=${infoSelectedRow.plantId}`)
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

  // Function to fetch data from the API
  const fetchAPI = useCallback(async () => {
    setLoading(true)

    try {
      setLoading(true)

      const response = await api.get("/Plant/GetAllPlantDetails", {
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
      itemId={selectedViewUser?.plantId}
      itemName={selectedViewUser?.plantName}
      idKey="PlantId" //  this tells the modal to send { UserId: itemId } in params
      apiNameUrl="Plant/DeletePlantDetails"
    />
  )

  const renderModal = () => (
    <ModalComponent
      showModal={modal}
      handleCloseModal={handleCloseModal}
      title={`Plant Details(${selectedViewUser?.plantName})`}
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
                  !["deleteFlag", "plantId", "getPlantEnergyMapping"].includes(
                    keyItem,
                  ),
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
    <div className="sm:ml-10 xl:ml-0 min-w-[80vw]">
      <div className="border rounded border-base-300">
        <PageHeaderWithSearchAndAdd
          title="Manage Plants"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClick={() => navigate("/on-plant/configuration")}
        />

        <div className="overflow-auto h-50">
          <div className="screen-height-media w-full">
            {/* <button
              className="sm:btn btn-primary btn-outline btn-sm sm:float-right mb-2"
              onClick={() => navigate("/on-plant/configuration")}
            >
              <Plus className="w-4 h-4" />
              Create
            </button> */}
            {/* <button
              className="px-2 py-1 text-s sm:float-right mb-2 flex items-center gap-1 border border-primary text-primary rounded hover:bg-primary hover:text-white transition"
              onClick={() => navigate("/on-plant/configuration")}
            >
              <Plus className="w-4 h-4" />
              Create */}
            {/* </button> */}

            {loading ? (
              <Loading />
            ) : (
              currentItems && (
                <>
                  <BasicTable
                    tableHeader={OperationNexusPlantTableHeader} // Use the correct table header
                    tableData={currentItems} // Use currentItems after filtering and pagination
                    handleClickEditAction={handleClickEditAction}
                    handleClickViewAction={handleClickViewAction}
                    handleDeleteAction={handleDeleteAction}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    currentPage={currentPage} // Pass currentPage here
                    itemsPerPage={itemsPerPage} // Pass itemsPerPage here />
                    showAddButton={false}
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

export default ManagePlants
