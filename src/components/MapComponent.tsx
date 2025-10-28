import React, { useMemo } from 'react'
// Fallback to static map without external packages to avoid build errors
import { Property } from '@/types'

interface MapComponentProps {
  properties: Property[]
  selectedProperty: string | null
  onPropertySelect: (id: string | null) => void
}

const MapComponent: React.FC<MapComponentProps> = ({ properties }) => {
  const coords = properties
    .map((p:any) => ({ lat: p.latitude, lon: p.longitude }))
    .filter((c) => typeof c.lat === 'number' && typeof c.lon === 'number')
  if (coords.length === 0) return <div className="w-full h-full flex items-center justify-center text-gray-600">No coordinates available.</div>
  const avg = coords.reduce((a,c)=>({ lat: a.lat + c.lat, lon: a.lon + c.lon }), { lat:0, lon:0 })
  avg.lat /= coords.length; avg.lon /= coords.length
  const markers = coords.slice(0,50).map((c)=>`${c.lat},${c.lon},lightblue1`).join('|')
  const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${avg.lat},${avg.lon}&zoom=12&size=640x480&maptype=mapnik&markers=${encodeURIComponent(markers)}`
  return <img src={mapUrl} alt="Map" className="w-full h-full object-cover" />
}

export default MapComponent