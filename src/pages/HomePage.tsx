import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown, MapPin } from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import FilterBar from '@/components/FilterBar'
import PropertyListingCard from '@/components/PropertyListingCard'
import RoommateCard from '@/components/RoommateCard'
import MapComponent from '@/components/MapComponent'
import { ExploreItem, Property, Roommate } from '@/types'
import { haversineKm } from '@/utils'
import { exploreApi } from '@/services/api'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showMap, setShowMap] = useState(true)
  const [radiusKm, setRadiusKm] = useState<number | 'ALL'>('ALL')
  const [userLoc, setUserLoc] = useState<{lat:number,lng:number} | null>(null)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('price')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [showRoommates, setShowRoommates] = useState(false)
  const [exploreData, setExploreData] = useState<ExploreItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Filter data based on type
  const properties = exploreData.filter(item => item.type === 'property').map(item => item.item as Property)
  const roommates = exploreData.filter(item => item.type === 'roommate').map(item => item.item as Roommate)
  const allItems = showRoommates ? exploreData.filter(i=>i.type==='roommate') : exploreData

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await exploreApi.getExploreData()
        setExploreData(response.data)
      } catch (err) {
        setError('Failed to load data')
        console.error('Error fetching explore data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // request geolocation (non-blocking)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLoc(null),
        { enableHighAccuracy: true, timeout: 5000 }
      )
    }
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters)
    // sync to URL so list recomputes immediately
    const params = new URLSearchParams(searchParams)
    // map known keys for quick chips
    if (newFilters.price) {
      const [min,max] = newFilters.price.split('-')
      params.set('minPrice', min)
      params.set('maxPrice', max)
    } else {
      params.delete('minPrice'); params.delete('maxPrice')
    }
    if (newFilters.rooms) {
      // Use rooms value heuristically as beds
      const v = newFilters.rooms.replace('+','')
      params.set('beds', v)
    } else {
      params.delete('beds')
    }
    navigate(`/?${params.toString()}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Check if we have data before rendering
  if (!loading && exploreData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No data available</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>
    )
  }

  // optional client-side nearby filter
  // Apply query param filters (basic client-side demo)
  const itemsForDisplay = (() => {
    let items = allItems
    // text search on title/address/city for properties, and bio/name for roommates
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      items = items.filter((i) => {
        if (i.type === 'property') {
          const p:any = i.item
          const hay = `${p.title} ${p.address} ${p.city}`.toLowerCase()
          return hay.includes(q)
        } else {
          const r:any = i.item
          const hay = `${r.firstName ?? ''} ${r.lastName ?? ''} ${r.bio ?? ''}`.toLowerCase()
          return hay.includes(q)
        }
      })
    }
    const mode = searchParams.get('mode')
    if (mode === 'roommates') {
      items = items.filter(i => i.type === 'roommate')
      const minB = Number(searchParams.get('minBudget') || 0)
      const maxB = Number(searchParams.get('maxBudget') || Number.MAX_SAFE_INTEGER)
      items = items.filter(i => {
        const r:any = i.item
        const b = Number(r?.budget || 0)
        return b >= minB && b <= maxB
      })
      return items
    }

    // property filters (do NOT remove roommate items)
    const minP = Number(searchParams.get('minPrice') || 0)
    const maxP = Number(searchParams.get('maxPrice') || Number.MAX_SAFE_INTEGER)
    const bedsQ = searchParams.get('beds')
    const bathsQ = searchParams.get('baths')
    const pets = searchParams.get('pets') // allowed | not_allowed
    const furnished = searchParams.get('furnished') // yes | no
    items = items.filter(i => {
      if (i.type !== 'property') return true // keep roommate items
      const p:any = i.item
      const price = Number(p?.price || 0)
      if (price < minP || price > maxP) return false
      if (bedsQ && Number(p?.bedrooms || 0) < Number(bedsQ)) return false
      if (bathsQ && Number(p?.bathrooms || 0) < Number(bathsQ)) return false
      if (pets === 'allowed' && p?.petsAllowed === false) return false
      if (pets === 'not_allowed' && p?.petsAllowed === true) return false
      if (furnished === 'yes' && p?.furnished === false) return false
      if (furnished === 'no' && p?.furnished === true) return false
      return true
    })

    if (userLoc && radiusKm !== 'ALL') {
      items = items.filter((it) => {
        if (it.type !== 'property') return true // do not radius-filter roommates
        const p = it.item as any
        if (typeof p.latitude !== 'number' || typeof p.longitude !== 'number') return true
        const d = haversineKm(userLoc.lat, userLoc.lng, p.latitude, p.longitude)
        return d <= (radiusKm as number)
      })
    }
    return items
  })()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search and Filter Section */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            {/* Search Input */}
            <SearchBar
              onSearch={handleSearch}
              placeholder="Apartments in Miami"
            />

            {/* Filter Buttons */}
            <FilterBar onFilterChange={handleFilterChange} />

            {/* Map Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 font-medium">Map</span>
              <button
                onClick={() => setShowMap(!showMap)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  showMap ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showMap ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Roommate Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 font-medium">Find Roommate</span>
              <button
                onClick={() => setShowRoommates(v=>!v)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  showRoommates ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showRoommates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Sort By */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none bg-white"
              >
                <option value="price">Price</option>
                <option value="date">Date Added</option>
                <option value="rating">Rating</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col lg:flex-row gap-6">
        {/* Left Panel - Listings */}
        <div className={`flex-1`}> 
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {itemsForDisplay.length} objects found
            </h2>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              {userLoc && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <select
                    value={radiusKm}
                    onChange={(e)=>{
                      const v = e.target.value
                      setRadiusKm(v === 'ALL' ? 'ALL' : parseInt(v))
                    }}
                    className="border rounded-md px-2 py-1"
                  >
                    <option value={'ALL'}>All listings</option>
                    <option value={5}>Within 5 km</option>
                    <option value={10}>Within 10 km</option>
                    <option value={20}>Within 20 km</option>
                    <option value={50}>Within 50 km</option>
                  </select>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span>Sort by</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Property Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {itemsForDisplay.map((item, index) => (
              <motion.div
                key={`${item.type}-${item.item.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {item.type === 'property' ? (
                  <PropertyListingCard
                    property={item.item as Property}
                    onClick={() => setSelectedItem(item.item.id)}
                    isSelected={selectedItem === item.item.id}
                  />
                ) : (
                  <RoommateCard
                    roommate={item.item as Roommate}
                    onClick={() => setSelectedItem(item.item.id)}
                    isSelected={selectedItem === item.item.id}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Panel - Map */}
        {showMap && (
          <div className="lg:w-1/3 w-full">
            <div className="sticky top-24 h-72 sm:h-96 lg:h-[calc(100vh-8rem)] bg-gray-200 rounded-xl overflow-hidden">
              <MapComponent
                properties={properties}
                selectedProperty={selectedItem}
                onPropertySelect={setSelectedItem}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}