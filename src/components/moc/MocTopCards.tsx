import React from 'react'
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react'

function MocTopCards() {
  const cards = [
    { name: 'Total Requests', value: 24, icon: FileText, iconColor: 'text-blue-500' },
    { name: 'Pending Review', value: 5, icon: Clock, iconColor: 'text-orange-500' },
    { name: 'Approved', value: 16, icon: CheckCircle, iconColor: 'text-green-500' },
    { name: 'Rejected', value: 3, icon: XCircle, iconColor: 'text-red-500' }
  ]

  return (
    <div className="w-full bg-blue-50 p-1 rounded-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 rounded-md">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={index}
              className=" bg-white rounded-md shadow-md p-1 hover:shadow-xl transition-shadow duration-200 border border-gray-300"
              style={{ boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="flex items-center justify-between ml-5">
                <h6 className="text-sm font-semibold text-gray-600">
                  {card.name}
                </h6>
                <Icon className={`h-6 w-6 mr-5 mt-2 ${card.iconColor}`} />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-800 ml-5">
                  {card.value}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MocTopCards