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
      <div className="border border-gray-300 bg-white shadow-sm -mb-10 max-h-[calc(105vh-200px)] overflow-auto">
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