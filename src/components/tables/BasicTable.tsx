import React, { useEffect, useState } from "react"
import { FaSearch } from "react-icons/fa"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table"
import {
  HiArrowSmDown,
  HiArrowSmUp,
  HiExclamation,
  HiEye,
  HiOutlineTrash,
} from "react-icons/hi"
import { MdEditSquare } from "react-icons/md"
import { FaDownload } from "react-icons/fa"
import { Plus } from "lucide-react"
import { classNames } from "@/utils/dom"
import { formatDate, formatDateTime } from "@/utils/convert"
import { ITableHeader, ITableData } from "@/utils/types"

interface IBasicTableProps {
  tableHeader: ITableHeader[]
  tableData: ITableData[]
  handleClickEditAction?: Function
  handleClickViewAction?: Function
  handleDeleteAction?: Function
  handleClickDownload?: Function
  currentPage: number
  itemsPerPage: number
  searchQuery: string
  setSearchQuery: (query: string) => void
  showAddButton?: boolean
  addButtonLabel?: string
  onAddButtonClick?: () => void
}

const columnHelper = createColumnHelper<ITableData>()

const BasicTable: React.FunctionComponent<IBasicTableProps> = ({
  tableHeader,
  tableData,
  handleClickEditAction,
  handleClickViewAction,
  handleDeleteAction,
  handleClickDownload,
  currentPage,
  itemsPerPage,
  searchQuery,
  setSearchQuery,
  showAddButton,
  addButtonLabel,
  onAddButtonClick,
}) => {
  const handleClickEdit = (infoSelected: ITableData) => {
    handleClickEditAction && handleClickEditAction(infoSelected)
  }
  const handleClickView = (infoSelected: ITableData) => {
    handleClickViewAction && handleClickViewAction(infoSelected)
  }
  const handleDelete = (infoSelected: ITableData) => {
    handleDeleteAction && handleDeleteAction(infoSelected)
  }
  const handleDownload = (infoSelected: ITableData) => {
    handleClickDownload && handleClickDownload(infoSelected)
  }

  const columns = tableHeader.map((header) =>
    columnHelper.accessor(header.name, {
      header: () => header.display,
      cell: (info) => {
        const rowData = info.row.original
        if (info.column.id === "action") {
          return (
            <div className="flex justify-center gap-3 text-gray-600">
              <MdEditSquare
                onClick={() => rowData && handleClickEdit(rowData)}
                className="cursor-pointer text-primary hover:text-secondary transition w-5 h-5"
                title="Edit"
                aria-label="Edit"
                role="button"
                tabIndex={0}
              />
              <HiEye
                onClick={() => rowData && handleClickView(rowData)}
                className="cursor-pointer text-tableHeaderbg hover:text-secondary transition w-5 h-5"
                title="View"
                aria-label="View"
                role="button"
                tabIndex={0}
              />
              <HiOutlineTrash
                onClick={() => rowData && handleDelete(rowData)}
                className="cursor-pointer text-error hover:text-error transition w-5 h-5"
                title="Delete"
                aria-label="Delete"
                role="button"
                tabIndex={0}
              />
            </div>
          )
        }
        if (info.column.id === "delete") {
          return (
            <div className="flex justify-center text-red-600">
              <HiOutlineTrash
                onClick={() => rowData && handleDelete(rowData)}
                className="cursor-pointer hover:text-error transition w-5 h-5"
                title="Delete"
                aria-label="Delete"
                role="button"
                tabIndex={0}
              />
            </div>
          )
        }
        if (info.column.id === "Download") {
          return (
            <div className="flex justify-center">
              <FaDownload
                onClick={() => rowData && handleDownload(rowData)}
                className="cursor-pointer hover:text-primary transition w-5 h-5"
                title="Download"
                aria-label="Download"
                role="button"
                tabIndex={0}
              />
            </div>
          )
        }
        if (info.column.id === "alarm" && info.getValue()) {
          return (
            <div className="flex justify-center text-red-600">
              <HiExclamation className="w-5 h-5" title="Alarm" aria-label="Alarm" />
            </div>
          )
        }
        const dateTimeColumns = [
          "CreationDate",
          "LastModifiedDate",
          "PackingDate",
          "PickingDate",
          "DispatchDate",
          "OrderDate",
          "ActualDeliveryDate",
          "ExpectedDeliveryDate",
          "MovementDate",
          "EntryDate",
          "InEntyDate",
          "OutEntyDate",
          "PlannedStartDate",
          "PlannedEndDate",
          "ActualStartDate",
          "ActualEndDate",
          "Cycle_Start",
          "Cycle_End",
        ]
        const dateColumns = ["ValidFrom", "ValidTo"]

        if (dateTimeColumns.includes(info.column.id)) {
          return (
            <span className="whitespace-nowrap text-gray-700 text-sm">
              {formatDateTime(info.renderValue() as string)}
            </span>
          )
        }
        if (dateColumns.includes(info.column.id)) {
          return (
            <span className="whitespace-nowrap text-gray-700 text-sm">
              {formatDate(info.renderValue() as string)}
            </span>
          )
        }
        return (
          // <span className="text-gray-800 text-sm">{info.renderValue()}</span>
          <span className="text-gray-800 text-sm">{(info.renderValue() as React.ReactNode) ?? ""}</span>

        )
      },
      footer: (info) => info.column.id,
    }),
  )

  const [data, setData] = useState(tableData)

  useEffect(() => {
    setData(tableData)
  }, [tableData])

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <>
      <div className="border border-gray-300 bg-white shadow-sm">
        
        <div className="w-full overflow-x-auto">
          <table className="w-full table-auto text-left border-collapse">
            <thead className="sticky top-0 bg-neutral z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={classNames(
                        "border-b border-gray-200 px-4 py-3 text-xs font-bold tracking-wider text-secondary select-none",
                        header.column.getCanSort() ? "cursor-pointer" : "",
                        header.id === "action" ? "text-center" : "text-left"
                      )}
                      onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                      aria-sort={
                        header.column.getIsSorted()
                          ? header.column.getIsSorted() === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <>
                            {header.column.getIsSorted() === "asc" && <HiArrowSmUp className="h-4 w-4 text-secondary" />}
                            {header.column.getIsSorted() === "desc" && <HiArrowSmDown className="h-4 w-4 text-secondary" />}
                            {!header.column.getIsSorted() && (
                              <div className="flex flex-col">
                                <HiArrowSmUp className="h-2 w-2 text-secondary" />
                                <HiArrowSmDown className="h-2 w-2 text-secondary -mt-0.5" />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, rowIndex) => {
                const serialNumber = (currentPage - 1) * itemsPerPage + rowIndex + 1
                return (
                  <tr
                    key={row.id}
                    className={classNames(
                      rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50",
                      "hover:bg-primary/10 transition cursor-pointer"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={classNames(
                          "p-2 align-top text-xs text-gray-700",
                          "whitespace-normal",
                          cell.column.id === "slNo" ? "font-semibold" : ""
                        )}
                      >
                        {cell.column.id === "slNo"
                          ? serialNumber
                          : flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                )
              })}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={table.getAllColumns().length} className="py-8 text-center text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default BasicTable


// import React, { useEffect, useState } from "react"
// import { FaSearch } from "react-icons/fa"
// import { useNavigate } from "react-router-dom"
// import {
//   flexRender,
//   getCoreRowModel,
//   getSortedRowModel,
//   SortingState,
//   useReactTable,
//   createColumnHelper,
//   getFilteredRowModel,
// } from "@tanstack/react-table"
// import { ITableHeader, ITableData } from "@/utils/types"
// import {
//   HiArrowSmDown,
//   HiArrowSmUp,
//   HiExclamation,
//   HiEye,
//   HiOutlineTrash,
// } from "react-icons/hi"
// import { MdAddHome, MdEditSquare } from "react-icons/md"
// import { FaDownload } from "react-icons/fa" // Import Download Icon
// import { classNames } from "@/utils/dom"
// import { formatDate, formatDateTime } from "@/utils/convert"
// import { Plus } from "lucide-react"
// interface IBasicTableProps {
//   tableHeader: ITableHeader[]
//   tableData: ITableData[]
//   handleClickEditAction?: Function
//   handleClickViewAction?: Function
//   handleDeleteAction?: Function
//   handleClickDownload?: Function
//   currentPage: number
//   itemsPerPage: number
//   searchQuery: string
//   setSearchQuery: (query: string) => void
//   showAddButton?: boolean
//   addButtonLabel?: string
//   onAddButtonClick?: () => void
// }

// const columnHelper = createColumnHelper<ITableData>()

// const BasicTable: React.FunctionComponent<IBasicTableProps> = ({
//   tableHeader,
//   tableData,
//   handleClickEditAction,
//   handleClickViewAction,
//   handleDeleteAction,
//   handleClickDownload,
//   currentPage,
//   itemsPerPage,
//   searchQuery,
//   setSearchQuery,
//   showAddButton,
//   addButtonLabel,
//   onAddButtonClick,
// }) => {
//   const navigate = useNavigate()
//   // const [globalFilter, setGlobalFilter] = useState("")
//   const [sorting, setSorting] = useState<SortingState>([])

//   const handleClickEdit = (infoSelected: ITableData) => {
//     const rowData = infoSelected
//     handleClickEditAction && handleClickEditAction(rowData)
//   }

//   const handleClickView = (infoSelected: ITableData) => {
//     const rowData = infoSelected
//     handleClickViewAction && handleClickViewAction(rowData)
//   }

//   const handleDelete = (infoSelected: ITableData) => {
//     const rowData = infoSelected
//     handleDeleteAction && handleDeleteAction(rowData)
//   }

//   const handleDownload = (infoSelected: ITableData) => {
//     const rowData = infoSelected
//     handleClickDownload && handleClickDownload(rowData)
//   }

//   const columns = tableHeader.map((tableHeaderItem) =>
//     columnHelper.accessor(tableHeaderItem.name, {
//       header: () => tableHeaderItem.display,
//       cell: (info) => {
//         const rowData = info.row.original

//         return info.column.id === "action" ? (
//           <div className="flex justify-center gap-2">
//             <MdEditSquare
//               onClick={() => {
//                 if (rowData) handleClickEdit(rowData)
//               }}
//               className="cursor-pointer hover:opacity-50 text-primary w-5 h-5"
//               title="Edit"
//             />
//             <HiEye
//               onClick={() => {
//                 if (rowData) handleClickView(rowData)
//               }}
//               className="cursor-pointer hover:opacity-50 w-5 h-5"
//               title="View"
//             />
//             <HiOutlineTrash
//               onClick={() => {
//                 if (rowData) handleDelete(rowData)
//               }}
//               className="text-error cursor-pointer hover:opacity-50 w-5 h-5"
//               title="Delete"
//             />
//           </div>
//         ) : info.column.id === "delete" ? (
//           <div className="flex justify-center gap-2">
//             <HiOutlineTrash
//               onClick={() => {
//                 if (rowData) handleDelete(rowData)
//               }}
//               className="text-error cursor-pointer hover:opacity-50 w-5 h-5"
//               title="delete"
//             />
//           </div>
//         ) : info.column.id === "Download" ? (
//           // <div className="flex justify-center">
//           <div className="ml-6">
//             <FaDownload
//               onClick={() => {
//                 if (rowData) handleDownload(rowData)
//               }}
//               className="cursor-pointer hover:opacity-50 text-primary w-5 h-5"
//               title="Download"
//             />
//           </div>
//         ) : info.column.id === "alarm" && info.getValue() ? (
//           <div className="flex justify-center">
//             <HiExclamation className="text-error w-5 h-5" />
//           </div>
//         ) : [
//             "CreationDate",
//             "LastModifiedDate",
//             "PackingDate",
//             "PickingDate",
//             "DispatchDate",
//             "OrderDate",
//             "ActualDeliveryDate",
//             "ExpectedDeliveryDate",
//             "MovementDate",
//             "EntryDate",
//             "InEntyDate",
//             "OutEntyDate",
//             "PlannedStartDate",
//             "PlannedEndDate",
//             "ActualStartDate",
//             "ActualEndDate",
//             "Cycle_Start",
//             "Cycle_End",
//           ].includes(info.column.id) ? (
//           <span className="whitespace-nowrap">
//             {formatDateTime(info.renderValue() as string)}
//           </span>
//         ) : ["ValidFrom", "ValidTo"].includes(info.column.id) ? (
//           <span className="whitespace-nowrap">
//             {formatDate(info.renderValue() as string)}
//           </span>
//         ) : (
//           info.renderValue()
//         )
//       },
//       footer: (info) => info.column.id,
//     }),
//   )

//   const [data, setData] = useState(tableData)
//   // const [sorting, setSorting] = useState<SortingState>([])

//   useEffect(() => {
//     setData(tableData)
//   }, [tableData])

//   const table = useReactTable({
//     data,
//     columns,
//     filterFns: {},
//     state: {
//       sorting,
//       // globalFilter, //specify our global filter here
//     },
//     // onGlobalFilterChange: setGlobalFilter, //if the filter changes, change the hook value
//     // globalFilterFn: "includesString", //type of filtering
//     // getFilteredRowModel: getFilteredRowModel(), //row model to filter the table
//     onSortingChange: setSorting,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     debugTable: true,
//   })

//   return (
//     <>
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
//         <div className="relative w-full sm:w-1/2">
//           <input
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search Keyword"
//             className="border border-primary rounded pl-10 pr-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//           />
//           <FaSearch
//             className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"
//             size={14}
//           />
//         </div>

//         {showAddButton && (
//           <button
//             className="px-3 py-2 text-sm flex items-center gap-1 border border-primary text-primary rounded hover:bg-primary hover:text-white transition w-full sm:w-auto"
//             onClick={onAddButtonClick}
//           >
//             <Plus className="w-4 h-4" />
//             {addButtonLabel || "Add"}
//           </button>
//         )}
//       </div>

//       <div className="overflow-x-auto w-full">
//         {/* Table */}
//         <table className="table">
//           <thead className="bg-info">
//             {table.getHeaderGroups().map((headerGroup) => (
//               <tr key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <th
//                     key={header.id}
//                     colSpan={header.colSpan}
//                     className="font-bold text-[#000000] whitespace-normal"
//                   >
//                     {header.isPlaceholder ? null : (
//                       <div
//                         {...{
//                           className: header.column.getCanSort()
//                             ? "cursor-pointer select-none"
//                             : "",
//                           onClick: header.column.getToggleSortingHandler(),
//                         }}
//                       >
//                         <div
//                           className={classNames(
//                             "flex",
//                             header.id === "action" ? "justify-center" : "",
//                           )}
//                         >
//                           {flexRender(
//                             header.column.columnDef.header,
//                             header.getContext(),
//                           )}
//                           {{
//                             asc: <HiArrowSmUp className="relative top-1" />,
//                             desc: <HiArrowSmDown className="relative top-1" />,
//                           }[header.column.getIsSorted() as string] ?? null}
//                         </div>
//                       </div>
//                     )}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody>
//             {table.getRowModel().rows.map((row, rowIndex) => {
//               const serialNumber =
//                 (currentPage - 1) * itemsPerPage + rowIndex + 1
//               return (
//                 <tr key={row.id}>
//                   {row.getVisibleCells().map((cell) => (
//                     <td key={cell.id} className="whitespace-normal text-xs">
//                       {cell.column.id === "slNo"
//                         ? serialNumber
//                         : flexRender(
//                             cell.column.columnDef.cell,
//                             cell.getContext(),
//                           )}
//                     </td>
//                   ))}
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//       </div>
//     </>
//   )
// }

// export default BasicTable
// return (
//   <div className="overflow-x-auto w-full">
//     <div className="relative">
//       {/* <input
//       value={globalFilter}
//       onChange={(e) => setGlobalFilter(e.target.value)} // Set the global filter state
//       placeholder="Search Keyword"
//       className="border border-primary p-2 rounded mb-4 min-w-full pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
//     /> */}

//       <input
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         placeholder="Search Keyword"
//         className="border border-primary p-2 rounded mb-4 min-w-full pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
//       />
//       <FaSearch
//         className="absolute left-3 top-6 transform -translate-y-1/2 text-primary"
//         size={14} // Adjust the icon size as needed
//       />
//     </div>
//     <table className="table">
//       <thead className="bg-info">
//         {table.getHeaderGroups().map((headerGroup) => (
//           <tr key={headerGroup.id}>
//             {headerGroup.headers.map((header) => (
//               <th
//                 key={header.id}
//                 colSpan={header.colSpan}
//                 className="font-bold text-[#000000] whitespace-normal"
//               >
//                 {header.isPlaceholder ? null : (
//                   <div
//                     {...{
//                       className: header.column.getCanSort()
//                         ? "cursor-pointer select-none"
//                         : "",
//                       onClick: header.column.getToggleSortingHandler(),
//                     }}
//                   >
//                     <div
//                       className={classNames(
//                         "flex",
//                         header.id === "action" ? "justify-center" : "",
//                       )}
//                     >
//                       {flexRender(
//                         header.column.columnDef.header,
//                         header.getContext(),
//                       )}
//                       {{
//                         asc: <HiArrowSmUp className="relative top-1" />,
//                         desc: <HiArrowSmDown className="relative top-1" />,
//                       }[header.column.getIsSorted() as string] ?? null}
//                     </div>
//                   </div>
//                 )}
//               </th>
//             ))}
//           </tr>
//         ))}
//       </thead>
//       <tbody>
//         {table.getRowModel().rows.map((row, rowIndex) => {
//           const serialNumber = (currentPage - 1) * itemsPerPage + rowIndex + 1
//           return (
//             <tr key={row.id}>
//               {row.getVisibleCells().map((cell) => (
//                 <td key={cell.id} className="whitespace-normal text-xs">
//                   {cell.column.id === "slNo"
//                     ? serialNumber
//                     : flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext(),
//                       )}
//                 </td>
//               ))}
//             </tr>
//           )
//         })}
//       </tbody>
//     </table>
//   </div>
// )

// ---------------------------------
// import React, { useEffect, useState } from "react"
// import {
//   flexRender,
//   getCoreRowModel,
//   getSortedRowModel,
//   useReactTable,
//   SortingState,
//   createColumnHelper,
//   getPaginationRowModel,
// } from "@tanstack/react-table"
// import { ITableHeader, ITableData } from "@/utils/types"
// import {
//   HiArrowSmDown,
//   HiArrowSmUp,
//   HiExclamation,
//   HiEye,
//   HiOutlineTrash,
// } from "react-icons/hi"
// import { useNavigate } from "react-router-dom"
// import { MdEditSquare } from "react-icons/md"
// import { FaSearch } from "react-icons/fa"
// import { classNames } from "@/utils/dom"
// import { formatDate, formatDateTime } from "@/utils/convert"

// interface IBasicTableProps {
//   tableHeader: ITableHeader[]
//   tableData: ITableData[]
//   handleClickEditAction?: Function
//   handleClickViewAction?: Function
//   handleDeleteAction?: Function
//   handleClickDownload?: Function
//   currentPage: number
//   itemsPerPage: number
//   searchQuery: string
//   setSearchQuery: (query: string) => void
// }

// const columnHelper = createColumnHelper<ITableData>()
// // const [globalFilter, setGlobalFilter] = useState<string>("")
// const BasicTable: React.FunctionComponent<IBasicTableProps> = ({
//   tableHeader,
//   tableData,
//   handleClickEditAction,
//   handleClickViewAction,
//   handleDeleteAction,
// }) => {
//   const navigate = useNavigate()

//   const handleClickEdit = (infoSelected: any) => {
//     handleClickEditAction?.(
//       infoSelected.getValue ? infoSelected.row.original : infoSelected,
//     )
//   }

//   const handleClickView = (infoSelected: any) => {
//     handleClickViewAction?.(
//       infoSelected.getValue ? infoSelected.row.original : infoSelected,
//     )
//   }

//   const handleDelete = (infoSelected: any) => {
//     handleDeleteAction?.(
//       infoSelected.getValue ? infoSelected.row.original : infoSelected,
//     )
//   }

//   const columns = tableHeader.map((tableHeaderItem) =>
//     columnHelper.accessor(tableHeaderItem.name, {
//       header: () => tableHeaderItem.display,
//       cell: (info) =>
//         info.column.id === "action" ? (
//           <div className="flex justify-center gap-2">
//             <MdEditSquare
//               onClick={() => handleClickEdit(info)}
//               className="cursor-pointer hover:opacity-50 text-primary w-5 h-5"
//               title="Edit"
//             />
//             <HiEye
//               onClick={() => handleClickView(info)}
//               className="cursor-pointer hover:opacity-50 w-5 h-5"
//               title="View"
//             />
//             <HiOutlineTrash
//               onClick={() => handleDelete(info)}
//               className="text-error cursor-pointer hover:opacity-50 w-5 h-5"
//               title="Delete"
//             />
//           </div>
//         ) : info.column.id === "alarm" && info.getValue() ? (
//           <div className="flex justify-center">
//             <HiExclamation className="text-error w-5 h-5" />
//           </div>
//         ) : info.column.id === "CreationDate" ||
//           info.column.id === "LastModifiedDate" ||
//           info.column.id === "PackingDate" ||
//           info.column.id === "PickingDate" ||
//           info.column.id === "OrderDate" ||
//           info.column.id === "ActualDeliveryDate" ||
//           info.column.id === "ExpectedDeliveryDate" ||
//           info.column.id === "MovementDate" ||
//           info.column.id === "EntryDate" ? (
//           <span className="whitespace-nowrap">
//             {formatDateTime(info.renderValue() as string)}
//           </span>
//         ) : info.column.id === "ValidFrom" || info.column.id === "ValidTo" ? (
//           <span className="whitespace-nowrap">
//             {formatDate(info.renderValue() as string)}
//           </span>
//         ) : (
//           info.renderValue()
//         ),
//       footer: (info) => info.column.id,
//     }),
//   )

//   const [data, setData] = useState(tableData)
//   // console.log("data coming in basic Table is "+tableData.length)
//   const [sorting, setSorting] = useState<SortingState>([])
//   const [pageIndex, setPageIndex] = useState(0)
//   const [pageSize, setPageSize] = useState(10)
//   // Add state for globalFilter
//   const [globalFilter, setGlobalFilter] = useState<string>("")

//   useEffect(() => {
//     setData(tableData)
//   }, [tableData])

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//       pagination: {
//         pageIndex,
//         pageSize,
//       },
//     },

//     onGlobalFilterChange: setGlobalFilter,
//     onSortingChange: setSorting,
//     onPaginationChange: (updater) => {
//       const newPaginationState =
//         typeof updater === "function"
//           ? updater(table.getState().pagination)
//           : updater
//       setPageIndex(newPaginationState.pageIndex)
//       setPageSize(newPaginationState.pageSize)
//     },
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     debugTable: true,
//   })

//   return (
//     <div className="overflow-x-auto w-full">
//       {/* <div className="relative">
//       <input
//         value={globalFilter}
//         onChange={(e) => setGlobalFilter(e.target.value)} // Set the global filter state
//         placeholder="Search Keyword"
//         className="border border-primary p-2 rounded mb-4 min-w-full pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
//       />
//       <FaSearch
//         className="absolute left-3 top-6 transform -translate-y-1/2 text-primary"
//         size={14} // Adjust the icon size as needed
//       />
//     </div> */}
//       <table className="table w-full min-w-full max-w-full">
//         <thead className="bg-info">
//           {table.getHeaderGroups().map((headerGroup) => (
//             <tr key={headerGroup.id}>
//               {headerGroup.headers.map((header) => (
//                 <th
//                   key={header.id}
//                   colSpan={header.colSpan}
//                   className="font-bold text-[#000000] whitespace-normal px-2 py-2"
//                 >
//                   {header.isPlaceholder ? null : (
//                     <div
//                       {...{
//                         className: header.column.getCanSort()
//                           ? "cursor-pointer select-none flex items-center justify-between"
//                           : "",
//                         onClick: header.column.getToggleSortingHandler(),
//                       }}
//                     >
//                       <span>
//                         {flexRender(
//                           header.column.columnDef.header,
//                           header.getContext(),
//                         )}
//                       </span>
//                       {{
//                         asc: <HiArrowSmUp className="relative top-1" />,
//                         desc: <HiArrowSmDown className="relative top-1" />,
//                       }[header.column.getIsSorted() as string] ?? null}
//                     </div>
//                   )}
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </thead>
//         <tbody>
//           {table.getRowModel().rows.map((row, rowIndex) => (
//             <tr key={row.id} className="border-b">
//               {row.getVisibleCells().map((cell) => (
//                 <td
//                   key={cell.id}
//                   className="whitespace-normal text-xs px-2 py-5"
//                 >
//                   {cell.column.id === "slNo"
//                     ? rowIndex + 1
//                     : flexRender(cell.column.columnDef.cell, cell.getContext())}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Pagination Controls */}
//       <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
//         <div>
//           Page{" "}
//           <strong>
//             {table.getState().pagination.pageIndex + 1} of{" "}
//             {table.getPageCount()}
//           </strong>
//         </div>
//         <div className="flex items-center">
//           <button
//             onClick={() => table.setPageIndex(0)}
//             disabled={!table.getCanPreviousPage()}
//             className="join-item btn btn-sm btn-primary-content"
//           >
//             FIRST
//           </button>
//           <button
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//             className="join-item btn btn-sm btn-primary-content"
//           >
//             PREV
//           </button>
//           <button
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//             className="join-item btn btn-sm btn-primary-content"
//           >
//             NEXT
//           </button>
//           <button
//             onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//             disabled={!table.getCanNextPage()}
//             className="join-item btn btn-sm btn-primary-content"
//           >
//             LAST
//           </button>
//         </div>

//         <div className="flex gap-4">
//           <div>
//             <select
//               value={table.getState().pagination.pageSize}
//               onChange={(e) => {
//                 table.setPageSize(Number(e.target.value))
//               }}
//               className="border p-1 rounded"
//             >
//               {[10, 20, 30, 40, 50].map((pageSize) => (
//                 <option key={pageSize} value={pageSize}>
//                   Show {pageSize}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             Go to page:{" "}
//             <input
//               type="number"
//               defaultValue={table.getState().pagination.pageIndex + 1}
//               onChange={(e) => {
//                 const page = e.target.value ? Number(e.target.value) - 1 : 0
//                 table.setPageIndex(page)
//               }}
//               className="border p-1 rounded w-12 text-center"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default BasicTable
