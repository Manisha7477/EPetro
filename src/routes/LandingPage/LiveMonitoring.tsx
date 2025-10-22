import React, { useEffect, useState } from "react"
import axios from "axios"

interface User {
  userId: number
  userName: string
  role: string
  // Add more user fields as required
}

interface LiveMonitoringProps {
  user?: User
  accessToken?: string
}

interface LiveData {
  deviceId: string
  energyConsumption: number
  timestamp: string
}

const LiveMonitoring: React.FC<LiveMonitoringProps> = ({
  user,
  accessToken,
}) => {
  const [liveData, setLiveData] = useState<LiveData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/energy/live`, // Change to your endpoint
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )

        if (response.status === 200) {
          setLiveData(response.data)
          setError("")
        } else {
          setError("Failed to fetch live data.")
        }
      } catch (err: any) {
        console.error("Live data fetch error:", err)
        setError("Error fetching data.")
      } finally {
        setLoading(false)
      }
    }

    const interval = setInterval(fetchLiveData, 5000) // Polling every 5 seconds
    fetchLiveData() // Initial fetch
    return () => clearInterval(interval)
  }, [accessToken])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Live Energy Monitoring</h1>
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : liveData.length > 0 ? (
        <table className="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Device ID</th>
              <th className="py-2 px-4 border-b">Energy Consumption (kWh)</th>
              <th className="py-2 px-4 border-b">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {liveData.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="py-2 px-4 border-b">{item.deviceId}</td>
                <td className="py-2 px-4 border-b">{item.energyConsumption}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(item.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No live data available.</p>
      )}
    </div>
  )
}

export default LiveMonitoring
