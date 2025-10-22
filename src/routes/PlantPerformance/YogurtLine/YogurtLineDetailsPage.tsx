import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

const YogurtLineDetailsPage = () => {
  const { id, plantName } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const isMonitoring = location.pathname.includes("/monitoring")
  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div className="flex gap-1 relative">
          <div className="flex relative border-b-2 border-gray-200">
            <button
              className={`px-6 py-3 font-medium text-md transition-all duration-300 relative ${
                !isMonitoring
                  ? "text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() =>
                navigate(`/plantPerformanceYogurtLine/${plantName}/${id}`)
              }
            >
              Info & KPIs
              {!isMonitoring && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-full transform scale-x-100 transition-transform duration-300"></div>
              )}
              {isMonitoring && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full transform scale-x-0 hover:scale-x-75 transition-transform duration-300"></div>
              )}
            </button>

            <button
              className={`px-6 py-3 font-medium text-md transition-all duration-300 relative ${
                isMonitoring
                  ? "text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() =>
                navigate(
                  `/plantPerformanceYogurtLine/${plantName}/${id}/monitoring`,
                )
              }
            >
              Monitoring
              {isMonitoring && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-full transform scale-x-100 transition-transform duration-300"></div>
              )}
              {!isMonitoring && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full transform scale-x-0 hover:scale-x-75 transition-transform duration-300"></div>
              )}
            </button>
          </div>

          {isMonitoring && (
            <div className="ml-4 flex items-center">
              <span className="text-xs bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 px-3 py-1.5 rounded-full shadow-sm border border-yellow-200 font-medium">
                📅 {currentDate}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate(`/plantPerformanceYogurtLine/${plantName}`)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 text-sm rounded-full transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
        >
          <ArrowLeft size={16} strokeWidth={2} />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default YogurtLineDetailsPage
