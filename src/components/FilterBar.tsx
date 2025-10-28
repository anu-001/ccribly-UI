import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, ChevronDown } from 'lucide-react'

interface FilterButtonProps {
  label: string
  value: string
  isActive?: boolean
  onClick: (value: string) => void
}

function FilterButton({ label, value, isActive = false, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`px-3 py-1.5 rounded-md text-sm font-normal transition-colors ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  )
}

interface FilterBarProps {
  onFilterChange: (filters: Record<string, string>) => void
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const priceRanges = [
    { label: '$450k-$990k', value: '450000-990000' },
    { label: '$500k-$1M', value: '500000-1000000' },
    { label: '$600k-$1.2M', value: '600000-1200000' }
  ]

  const roomFilters = [
    { label: '3+ rooms', value: '3+' },
    { label: '2+ beds', value: '2+' },
    { label: 'Sea view', value: 'sea-view' }
  ]

  const handleFilterClick = (filterType: string, value: string) => {
    const newFilters = { ...activeFilters }
    
    if (activeFilters[filterType] === value) {
      delete newFilters[filterType]
    } else {
      newFilters[filterType] = value
    }
    
    setActiveFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="flex items-center space-x-2">
      {priceRanges.map((range) => (
        <FilterButton
          key={range.value}
          label={range.label}
          value={range.value}
          isActive={activeFilters.price === range.value}
          onClick={(value) => handleFilterClick('price', value)}
        />
      ))}
      {roomFilters.map((filter) => (
        <FilterButton
          key={filter.value}
          label={filter.label}
          value={filter.value}
          isActive={activeFilters.rooms === filter.value}
          onClick={(value) => handleFilterClick('rooms', value)}
        />
      ))}
      <button
        onClick={() => navigate(`/filters?${searchParams.toString()}`)}
        className="px-3 py-1.5 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors font-medium flex items-center space-x-2 text-sm"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span>All filters</span>
      </button>
    </div>
  )
}
