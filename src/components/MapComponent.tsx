import React from 'react'
import { MapPin } from 'lucide-react'
import { Property } from '@/types'

interface MapComponentProps {
  properties: Property[]
  selectedProperty: string | null
  onPropertySelect: (id: string | null) => void
}

const MapComponent: React.FC<MapComponentProps> = ({ properties, selectedProperty, onPropertySelect }) => {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-200 to-indigo-300 rounded-xl overflow-hidden flex items-center justify-center">
      <div className="text-center text-white">
        <MapPin className="w-16 h-16 mx-auto mb-4" />
        <p className="text-lg font-semibold">Map Integration Coming Soon!</p>
        <p className="text-sm opacity-80">Displaying {properties.length} properties</p>
      </div>

      {properties.map((property) => (
        <div
          key={property.id}
          className={`absolute p-2 rounded-full shadow-lg cursor-pointer transition-all duration-200
            ${selectedProperty === property.id ? 'bg-blue-600 text-white scale-110 z-10' : 'bg-white text-gray-800 hover:bg-gray-100'}
          `}
          style={{
            top: `${Math.random() * 80 + 10}%`, // Random position for mock
            left: `${Math.random() * 80 + 10}%`, // Random position for mock
          }}
          onClick={() => onPropertySelect(property.id)}
        >
          ${property.price}
        </div>
      ))}
    </div>
  )
}

export default MapComponent