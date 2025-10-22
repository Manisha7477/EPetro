import React, { useState } from "react";
import Pagination from "@/components/Pagination";
import BasicTable from "@/components/tables/BasicTable";
import {MOC_HEADER_DATA } from "@/utils/data";
import {useNavigate } from "react-router-dom";
import MocHeader from "@/navigation/MocHeader";

// Type for each table row
interface IMOCTableRow {
  slNo: number;
  mocID: string;
  request: number;
  place: string;
  name: string;
  time: string;
  action: string;
}


const MocDashboard = () => {
  // Hardcoded table data
const [tableData] = useState<IMOCTableRow[]>([
  { slNo: 1, mocID: "MOC-A", request: 5, place: "Hall A", name: "John Doe", time: "08:00", action: "" },
  { slNo: 2, mocID: "MOC-B", request: 3, place: "Room 101", name: "Jane Smith", time: "09:00", action: "" },
  { slNo: 3, mocID: "MOC-C", request: 7, place: "Lab 3", name: "Alice Brown", time: "10:00", action: "" },
  { slNo: 4, mocID: "MOC-D", request: 2, place: "Office 2", name: "Bob White", time: "11:00", action: "" },
  { slNo: 5, mocID: "MOC-E", request: 6, place: "Conference Room", name: "Charlie Green", time: "12:00", action: "" },
  { slNo: 6, mocID: "MOC-A", request: 5, place: "Hall A", name: "John Doe", time: "08:00", action: "" },
  { slNo: 7, mocID: "MOC-B", request: 3, place: "Room 101", name: "Jane Smith", time: "09:00", action: "" },
  { slNo: 8, mocID: "MOC-C", request: 7, place: "Lab 3", name: "Alice Brown", time: "10:00", action: "" },
  { slNo: 9, mocID: "MOC-D", request: 2, place: "Office 2", name: "Bob White", time: "11:00", action: "" },
  { slNo: 10, mocID: "MOC-E", request: 6, place: "Conference Room", name: "Charlie Green", time: "12:00", action: "" },
  { slNo: 11, mocID: "MOC-A", request: 5, place: "Hall A", name: "John Doe", time: "08:00", action: "" },
  { slNo: 12, mocID: "MOC-B", request: 3, place: "Room 101", name: "Jane Smith", time: "09:00", action: "" },
  { slNo: 13, mocID: "MOC-C", request: 7, place: "Lab 3", name: "Alice Brown", time: "10:00", action: "" },
  { slNo: 14, mocID: "MOC-D", request: 2, place: "Office 2", name: "Bob White", time: "11:00", action: "" },
  { slNo: 15, mocID: "MOC-E", request: 6, place: "Conference Room", name: "Charlie Green", time: "12:00", action: "" },
]);


  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [modal, setModal] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const itemsPerPageOptions = [5, 10, 15, 20, 30, 40, 50]
 const navigate = useNavigate()
  const handleClickViewAction = (row: IMOCTableRow) => console.log("View:", row);
  const handleDeleteAction = (row: IMOCTableRow) => console.log("Delete:", row);

   const handleClickEditAction = (infoSelectedRow: Record<string, any>) => {
    // navigate(`/manage-users/user-creation?id=${infoSelectedRow.userId}`)
  }

  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const goToPage = (page: number) => setCurrentPage(page);
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
// Filtered table data based on search
const filteredData = tableData.filter(row =>
  row.mocID.toLowerCase().includes(searchQuery.toLowerCase()) ||
  row.place.toLowerCase().includes(searchQuery.toLowerCase()) ||
  row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  row.time.toLowerCase().includes(searchQuery.toLowerCase()) ||
  row.request.toString().includes(searchQuery) // optional: search by number
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
        <MocHeader
          title="MoC Table"
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
              tableHeader={MOC_HEADER_DATA}
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

export default MocDashboard;

