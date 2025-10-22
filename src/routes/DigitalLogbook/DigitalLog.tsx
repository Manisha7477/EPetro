import React, { useState } from "react";
import Pagination from "@/components/Pagination";
import BasicTable from "@/components/tables/BasicTable";
import { DIGITAL_HEADER_DATA } from "@/utils/data";
import PageHeaderWithSearchAndAdd from "@/navigation/PageHeaderWithSearchAndAdd";
import { Navigate, useNavigate } from "react-router-dom";
import CreateDigitalLog from "@/navigation/CreateDigitalLog";

// Type for each table row
interface ITableRow {
  slNo: number;
  shiftID: string;
  date: string;
  location: string;
  place: string;
  name: string;
  time: string;
  action: string;
}

const DigitalLog = () => {
  // Hardcoded table data
  const [tableData] = useState<ITableRow[]>([
    { slNo: 1, shiftID: "SHIFT-A", date: "2025-10-22", location: "Mumbai Plant", place: "Hall A", name: "John Doe", time: "08:00", action: "" },
    { slNo: 2, shiftID: "SHIFT-B", date: "2025-10-22", location: "Delhi Terminal", place: "Room 101", name: "Jane Smith", time: "09:00", action: "" },
    { slNo: 3, shiftID: "SHIFT-C", date: "2025-10-21", location: "Chennai Depot", place: "Lab 3", name: "Alice Brown", time: "10:00", action: "" },
    { slNo: 4, shiftID: "SHIFT-D", date: "2025-10-21", location: "Kolkata Plant", place: "Office 2", name: "Bob White", time: "11:00", action: "" },
    { slNo: 5, shiftID: "SHIFT-E", date: "2025-10-20", location: "Bangalore Terminal", place: "Conference Room", name: "Charlie Green", time: "12:00", action: "" },
    { slNo: 6, shiftID: "SHIFT-A", date: "2025-10-22", location: "Mumbai Plant", place: "Hall A", name: "John Doe", time: "08:00", action: "" },
    { slNo: 7, shiftID: "SHIFT-B", date: "2025-10-22", location: "Delhi Terminal", place: "Room 101", name: "Jane Smith", time: "09:00", action: "" },
    { slNo: 8, shiftID: "SHIFT-C", date: "2025-10-21", location: "Chennai Depot", place: "Lab 3", name: "Alice Brown", time: "10:00", action: "" },
    { slNo: 9, shiftID: "SHIFT-D", date: "2025-10-21", location: "Kolkata Plant", place: "Office 2", name: "Bob White", time: "11:00", action: "" },
    { slNo: 10, shiftID: "SHIFT-E", date: "2025-10-20", location: "Bangalore Terminal", place: "Conference Room", name: "Charlie Green", time: "12:00", action: "" },
    { slNo: 11, shiftID: "SHIFT-A", date: "2025-10-22", location: "Mumbai Plant", place: "Hall A", name: "John Doe", time: "08:00", action: "" },
    { slNo: 12, shiftID: "SHIFT-B", date: "2025-10-22", location: "Delhi Terminal", place: "Room 101", name: "Jane Smith", time: "09:00", action: "" },
    { slNo: 13, shiftID: "SHIFT-C", date: "2025-10-21", location: "Chennai Depot", place: "Lab 3", name: "Alice Brown", time: "10:00", action: "" },
    { slNo: 14, shiftID: "SHIFT-D", date: "2025-10-21", location: "Kolkata Plant", place: "Office 2", name: "Bob White", time: "11:00", action: "" },
    { slNo: 15, shiftID: "SHIFT-E", date: "2025-10-20", location: "Bangalore Terminal", place: "Conference Room", name: "Charlie Green", time: "12:00", action: "" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [modal, setModal] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const itemsPerPageOptions = [5, 10, 15, 20, 30, 40, 50]
 const navigate = useNavigate()
  // Dummy action handlers
  // const handleClickEditAction = (row: ITableRow) => console.log("Edit:", row);
  const handleClickViewAction = (row: ITableRow) => console.log("View:", row);
  const handleDeleteAction = (row: ITableRow) => console.log("Delete:", row);

   const handleClickEditAction = (infoSelectedRow: Record<string, any>) => {
    navigate(`/manage-users/user-creation?id=${infoSelectedRow.userId}`)
  }

  // const handleClickViewAction = (infoSelectedRow: Record<string, any>) => {
  //   const { serialNumber, ...rest } = infoSelectedRow
  //   setSelectedViewUser(rest)
  //   setModal(true)
  // }

  // const handleDeleteAction = (infoSelectedRow: Record<string, any>) => {
  //   setSelectedViewUser(infoSelectedRow)
  //   setDeleteModal(true)
  // }
  // Pagination
  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const goToPage = (page: number) => setCurrentPage(page);
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
// Filtered table data based on search
const filteredData = tableData.filter(
  row =>
    row.shiftID.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.place.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.time.toLowerCase().includes(searchQuery.toLowerCase())
);

// Paginate filtered data
const currentItems = filteredData
  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  .map((item, index) => ({
    ...item,
    serialNumber: (currentPage - 1) * itemsPerPage + index + 1,
  }));

  const renderModal = () => <div>Modal Content</div>;
  const renderDeleteModal = () => <div>Delete Modal Content</div>;

  return (
    <div className="p-0">
      <div>
        <CreateDigitalLog
          title="Digital LogBook"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClick={() => navigate("/manage-users/user-creation")}
        />
      </div>
      <div className="flex-grow overflow-auto border-t border-gray-200">
        <div className="screen-height-media w-full">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <BasicTable
              tableHeader={DIGITAL_HEADER_DATA}
               tableData={currentItems as any}
              handleClickEditAction={handleClickEditAction}
              handleClickViewAction={handleClickViewAction}
              handleDeleteAction={handleDeleteAction}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              showAddButton={false}
            />
          )}
        </div>
      </div>
      <div className="pt-2 border-t border-gray-200">
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

      {modal && renderModal()}
      {modalDelete && renderDeleteModal()}
    </div>
  );
};

export default DigitalLog;
