import { ReactNode } from "react"

type Props = {
  title?: string
  children: ReactNode
  onClick?: () => void
}

export default function ChartCard({ title, children, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-4 cursor-pointer"
    >
      {/* {title && ( */}
      {/* <h2 className="text-sm font-semibold text-gray-900 truncate block">
          {title}
        </h2> */}
      {/* )} */}
      {children}
    </div>
  )
}
