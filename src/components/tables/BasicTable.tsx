import React, { useEffect, useState } from "react"
import { FaDownload } from "react-icons/fa"
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
import { classNames } from "@/utils/dom"
import { formatDate, formatDateTime } from "@/utils/convert"
import { ITableHeader, ITableData } from "@/utils/types"

interface IBasicTableProps {
  tableHeader: ITableHeader[]
  tableData: ITableData[]
  handleClickEditAction?: (row: ITableData) => void
  handleClickViewAction?: (row: ITableData) => void
  handleDeleteAction?: (row: ITableData) => void
  handleClickDownload?: (row: ITableData) => void
  currentPage: number
  itemsPerPage: number
  searchQuery?: string
  setSearchQuery?: (query: string) => void
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
}) => {
  const handleClickEdit = (row: ITableData) => handleClickEditAction?.(row)
  const handleClickView = (row: ITableData) => handleClickViewAction?.(row)
  const handleDelete = (row: ITableData) => handleDeleteAction?.(row)
  const handleDownload = (row: ITableData) => handleClickDownload?.(row)

  const columns = tableHeader.map((header) =>
    columnHelper.accessor(header.name, {
      header: () => header.display,
      cell: (info) => {
        const rowData = info.row.original

        // Action buttons
        if (info.column.id === "action") {
          return (
            <div className="flex justify-center gap-3 text-gray-600">
              <HiEye
                onClick={() => handleClickView(rowData)}
                className="cursor-pointer text-tableHeaderbg hover:text-secondary transition w-5 h-5"
                title="View"
              /> View
            </div>
          )
        }

        if (info.column.id === "delete") {
          return (
            <div className="flex justify-center text-red-600">
              <HiOutlineTrash
                onClick={() => handleDelete(rowData)}
                className="cursor-pointer hover:text-error transition w-5 h-5"
                title="Delete"
              />
            </div>
          )
        }

        if (info.column.id === "Download") {
          return (
            <div className="flex justify-center">
              <FaDownload
                onClick={() => handleDownload(rowData)}
                className="cursor-pointer hover:text-primary transition w-5 h-5"
                title="Download"
              />
            </div>
          )
        }

        if (info.column.id === "alarm" && info.getValue()) {
          return (
            <div className="flex justify-center text-red-600">
              <HiExclamation className="w-5 h-5" title="Alarm" />
            </div>
          )
        }

        // Date and DateTime columns
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

        // Status column with colors
        if (info.column.id === "status") {
          const statusValue = (info.renderValue() as string)?.toLowerCase()
          let textColor = "text-gray-800"

          if (statusValue === "approved") textColor = "text-green-600"
          else if (statusValue === "rejected") textColor = "text-red-600"
          else if (statusValue === "pending") textColor = "text-yellow-600"
          else if (statusValue === "in progress") textColor = "text-blue-600"
          else if (statusValue === "under review") textColor = "text-gray-500"

          return (
            <span className={`text-sm font-medium ${textColor}`}>
              {info.renderValue() as string}
            </span>
          )
        }

        // Default cell render
        return <span>{info.renderValue() as string}</span>
      },
      footer: (info) => info.column.id,
    }),
  )

  const [data, setData] = useState(tableData)
  const [sorting, setSorting] = useState<SortingState>([])

  useEffect(() => {
    setData(tableData)
  }, [tableData])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="w-full border border-gray-300 rounded-md">
      <div className="max-h-[260px] overflow-y-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={classNames(
                      "px-3 py-3 text-sm font-bold tracking-wider text-secondary border-b border-gray-300 select-none",
                      header.column.getCanSort() ? "cursor-pointer" : "",
                      header.id === "action" ? "text-center" : "text-left"
                    )}
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    aria-sort={
                      header.column.getIsSorted()
                        ? header.column.getIsSorted() === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    {header.isPlaceholder ? null : (
                      <div className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}>
                        <div className={classNames("flex items-center", header.id === "action" ? "justify-center" : "")}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getIsSorted() === "asc" && <HiArrowSmUp className="ml-1" />}
                          {header.column.getIsSorted() === "desc" && <HiArrowSmDown className="ml-1" />}
                        </div>
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row, rowIndex) => {
              const serialNumber = (currentPage - 1) * itemsPerPage + rowIndex + 1
              return (
                <tr key={row.id} className="border-b border-gray-300">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="whitespace-normal text-xs p-2">
                      {cell.column.id === "slNo"
                        ? serialNumber
                        : flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BasicTable
