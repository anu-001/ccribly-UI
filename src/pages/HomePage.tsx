import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, MapPin } from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import FilterBar from '@/components/FilterBar'
import PropertyListingCard from '@/components/PropertyListingCard'
import RoommateCard from '@/components/RoommateCard'
import MapComponent from '@/components/MapComponent'
import { ExploreItem, Property, Roommate } from '@/types'
import { exploreApi } from '@/services/api'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('Apartments in Miami')
  const [showMap, setShowMap] = useState(true)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('price')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [exploreData, setExploreData] = useState<ExploreItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter data based on type
  const properties = exploreData.filter(item => item.type === 'property').map(item => item.item as Property)
  const roommates = exploreData.filter(item => item.type === 'roommate').map(item => item.item as Roommate)
  const allItems = exploreData

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
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Implement search logic here
  }

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters)
    // Implement filter logic here
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex space-x-6">
        {/* Left Panel - Listings */}
        <div className={`flex-1 ${showMap ? 'w-2/3' : 'w-full'}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {allItems.length} objects found
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Sort by price</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allItems.map((item, index) => (
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
          <div className="w-1/3">
            <div className="sticky top-24 h-[calc(100vh-8rem)] bg-gray-200 rounded-xl overflow-hidden">
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