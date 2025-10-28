import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Heart,
  MapPin,
  Bed,
  Bath,
  Square,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Property } from '@/types'

interface PropertyCardProps {
  property: Property
  onClick?: () => void
  isSelected?: boolean
}

export default function PropertyListingCard({ property, onClick, isSelected = false }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.imageUrls.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.imageUrls.length - 1 : prev - 1
    )
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      {/* Image Carousel */}
      <div className="relative h-48 overflow-hidden rounded-t-xl group">
        <img
          src={property.imageUrls[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Image Navigation */}
        {property.imageUrls.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'
            }`}
          />
        </button>

        {/* Image Dots Indicator */}
        {property.imageUrls.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {property.imageUrls.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Property Type Badge */}
        <div className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
          {property.propertyType}
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4">
        {/* Price */}
        <div className="text-2xl font-bold text-gray-900 mb-2">
          ${property.price}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {property.title}
        </h3>

        {/* Address */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{property.address}, {property.city}</span>
        </div>

        {/* Property Details */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>{property.bedrooms} bedrooms</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>{property.bathrooms} rooms</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1" />
            <span>{property.squareFeet.toLocaleString()} Sq. ft</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2">
          {property.amenities.slice(0, 2).map((amenity) => (
            <span
              key={amenity}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
            >
              {amenity}
            </span>
          ))}
          {property.amenities.length > 2 && (
            <span className="text-xs text-gray-500 px-2 py-1">
              +{property.amenities.length - 2} more
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}