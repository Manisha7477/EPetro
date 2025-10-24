import React, { useState } from "react";
import Pagination from "@/components/Pagination";
import BasicTable from "@/components/tables/BasicTable";
import { MOC_HEADER_DATA } from "@/utils/data";
import { useNavigate } from "react-router-dom";
import MocHeader from "@/navigation/MocHeader";
import MocTopHeader from "./MocTopHeader";
import MocTopCards from "./MocTopCards";

// Type for each table row
interface IMOCTableRow {
  slNo: number;
  requestNo: string;
  title: string;
  department: string;
  location: string;
  requester: string;
  date: string;
  status: string;
  action: string;
}


const MocDashboard = () => {
  // Hardcoded table data
  const [tableData] = useState<IMOCTableRow[]>([
    {
      slNo: 1,
      requestNo: "REQ-001",
      title: "Fire Safety Review",
      department: "Safety",
      location: "Plant 1",
      requester: "John Doe",
      date: "2025-10-01",
      status: "Approved",
      action: "",
    },
    {
      slNo: 2,
      requestNo: "REQ-002",
      title: "Equipment Upgrade",
      department: "Maintenance",
      location: "Workshop 2",
      requester: "Jane Smith",
      date: "2025-10-02",
      status: "Pending",
      action: "",
    },
    {
      slNo: 3,
      requestNo: "REQ-003",
      title: "Chemical Handling SOP Update",
      department: "Production",
      location: "Lab A",
      requester: "Alice Brown",
      date: "2025-10-03",
      status: "Under Review",
      action: "",
    },
    {
      slNo: 4,
      requestNo: "REQ-004",
      title: "New PPE Guidelines",
      department: "Safety",
      location: "Plant 2",
      requester: "Bob White",
      date: "2025-10-04",
      status: "Rejected",
      action: "",
    },
    {
      slNo: 5,
      requestNo: "REQ-005",
      title: "Ventilation Improvement Plan",
      department: "Engineering",
      location: "Warehouse",
      requester: "Charlie Green",
      date: "2025-10-05",
      status: "Approved",
      action: "",
    },
    {
      slNo: 6,
      requestNo: "REQ-006",
      title: "Hazardous Material Storage Audit",
      department: "Compliance",
      location: "Storage Area B",
      requester: "David Lee",
      date: "2025-10-06",
      status: "In Progress",
      action: "",
    },
    {
      slNo: 7,
      requestNo: "REQ-007",
      title: "Emergency Drill Plan",
      department: "Operations",
      location: "Main Office",
      requester: "Sophia Clark",
      date: "2025-10-07",
      status: "Approved",
      action: "",
    },
    {
      slNo: 8,
      requestNo: "REQ-008",
      title: "Machine Inspection Report",
      department: "Quality",
      location: "Plant 3",
      requester: "Liam Scott",
      date: "2025-10-08",
      status: "Pending",
      action: "",
    },
    {
      slNo: 9,
      requestNo: "REQ-009",
      title: "Environmental Impact Assessment",
      department: "Environment",
      location: "Office 1",
      requester: "Olivia Hill",
      date: "2025-10-09",
      status: "Under Review",
      action: "",
    },
    {
      slNo: 10,
      requestNo: "REQ-010",
      title: "Energy Efficiency Proposal",
      department: "Engineering",
      location: "Plant 4",
      requester: "Ethan Turner",
      date: "2025-10-10",
      status: "Approved",
      action: "",
    },
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
  const filteredData = tableData.filter((row) =>
    row.requestNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.slNo.toString().includes(searchQuery)
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
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="p-1 rounded-md mb-2 mt-2">
        <MocTopHeader
          title="Management of Change"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClick={() => navigate("/manage-users/user-creation")}
        />
      </div>
      {/* <div className="flex-shrink-0">
        <MocHeader
          title="Management of Change"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClick={() => navigate("/manage-users/user-creation")}
        />
      </div> */}
      <div className=" mb-1 rounded-md">
        <MocTopCards />
      </div>
      <div className="flex-shrink-0">
        <MocHeader
          title="Recent Requests"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClick={() => navigate("/manage-users/user-creation")}
        />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div>Loading...</div>
            </div>
          ) : (
            <BasicTable
              tableHeader={MOC_HEADER_DATA}
              tableData={currentItems as any}
              handleClickEditAction={handleClickEditAction}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              showAddButton={false}
            />
          )}
        </div>
      </div>

      {/* Pagination - Fixed at bottom */}
      {/* <div className="mb-2">
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
      </div> */}

      {modal && renderModal()}
      {modalDelete && renderDeleteModal()}
    </div>
  );
};

export default MocDashboard;