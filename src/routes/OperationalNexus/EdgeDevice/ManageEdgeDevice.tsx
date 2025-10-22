import api from "@/api/axiosInstance"
import BasicTable from "@/components/tables/BasicTable"

import React, { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
// import { defaultUsers,tableHeader } from '@/utils/ManageUsersData/ManageUsersData';
import Pagination from "@/components/Pagination"
import UsePagination from "@/components/UsePagination"

import ModalDeleteComponent from "@/components/forms/ModalDeleteComponent"
import ModalComponent from "@/components/ModalComponent"
import Loading from "@/navigation/Loading"
import { formatDate, formatDateTime } from "@/utils/convert"
import {
  OperationNexusEdgeDeviceTableHeader,
  OperationNexusLineTableHeader,
} from "@/utils/data"
import type { ITableHeader } from "@/utils/types"
import { startCase } from "lodash"
import PageHeaderWithSearchAndAdd from "@/navigation/PageHeaderWithSearchAndAdd"

interface IManageEdgeDEviceProps {}

const ManageEdgeDevice: React.FunctionComponent<
  IManageEdgeDEviceProps
> = ({}) => {
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
    OperationNexusLineTableHeader,
  )

  const {
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    currentData,
  } = UsePagination(totalItems, itemsPerPage)

  const handleClickEditAction = (infoSelectedRow: Record<string, any>) => {
    console.log(infoSelectedRow)
    navigate(
      `/edge-devices/configuration/update?id=${infoSelectedRow.edgeDeviceId}`,
    )
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

      const response = await api.get("/EdgeDevice/GetAllEdgeDevice", {
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
      itemId={selectedViewUser?.edgeDeviceId}
      itemName={selectedViewUser?.edgeDeviceName}
      idKey="EdgeDeviceId" //  this tells the modal to send { UserId: itemId } in params
      apiNameUrl="EdgeDevice/DeleteEdgeDevice"
    />
  )

  const renderModal = () => (
    <ModalComponent
      showModal={modal}
      handleCloseModal={handleCloseModal}
      title={`EdgeDevice Details(${selectedViewUser?.edgeDeviceId})`}
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
                  ![
                    "deleteFlag",
                    "edgeDeviceId",
                    "plantId",
                    "assetId",
                    "lineId",
                  ].includes(keyItem),
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
    <div className="min-w-[80vw]">
      <div className="border rounded border-base-300">
        <PageHeaderWithSearchAndAdd
          title="Manage Edge Device"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClick={() => navigate("/edge-devices/configuration")}
        />

        <div className="overflow-auto h-50">
          <div className=" screen-height-media w-full">
            {loading ? (
              <Loading />
            ) : (
              currentItems && (
                <>
                  <BasicTable
                    tableHeader={OperationNexusEdgeDeviceTableHeader} // Use the correct table header
                    tableData={currentItems} // Use currentItems after filtering and pagination
                    handleClickEditAction={handleClickEditAction}
                    handleClickViewAction={handleClickViewAction}
                    handleDeleteAction={handleDeleteAction}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    currentPage={currentPage} // Pass currentPage here
                    itemsPerPage={itemsPerPage} // Pass itemsPerPage here />
                    showAddButton={true}
                    addButtonLabel="Create Edge Device"
                    onAddButtonClick={() =>
                      navigate("/edge-devices/configuration")
                    }
                  />
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
                </>
              )
            )}
          </div>
        </div>
        {modal && renderModal()}
        {modalDelete && renderDeleteModal()}
      </div>
    </div>
  )
}

export default ManageEdgeDevice
