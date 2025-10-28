import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Star,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/utils'
import { useFavorites } from '@/hooks'
import type { Property } from '@/types'

interface PropertyCardProps {
  property: Property
  onClick?: () => void
  isSelected?: boolean
  showActions?: boolean
}

export default function PropertyCard({ 
  property, 
  onClick, 
  isSelected = false,
  showActions = true 
}: PropertyCardProps) {
  const [imageError, setImageError] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(property.id)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`card cursor-pointer group relative ${
        isSelected ? 'ring-2 ring-primary-500' : ''
      }`}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden rounded-t-2xl">
        {!imageError && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-lg">🏠</span>
              </div>
              <p className="text-sm text-gray-500">No image available</p>
            </div>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex space-x-2">
          {property.isActive && (
            <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Available
            </span>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="absolute top-3 right-3 flex space-x-2">
            <button
              onClick={handleFavoriteClick}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite(property.id) ? 'text-red-500 fill-current' : 'text-gray-600'
                }`}
              />
            </button>
          </div>
        )}

        {/* Image Counter */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            +{property.images.length - 1} more
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(property.price, property.currency)}
            <span className="text-sm font-normal text-gray-500">/mo</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Star className="w-4 h-4 fill-current text-yellow-400" />
            <span>4.8</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">
            {property.city}, {property.state}
          </span>
        </div>

        {/* Details */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
            {property.squareFeet && (
              <div className="flex items-center">
                <Square className="w-4 h-4 mr-1" />
                <span>{property.squareFeet.toLocaleString()} sq ft</span>
              </div>
            )}
          </div>
        </div>

        {/* Available From */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Calendar className="w-4 h-4 mr-1" />
          <span>Available from {formatDate(property.availableFrom)}</span>
        </div>

        {/* Amenities */}
        {property.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 3).map((amenity) => (
                <span
                  key={amenity}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                >
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{property.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2">
            <Link
              to={`/properties/${property.id}`}
              className="flex-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Button variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </Link>
            <Button
              variant="primary"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation()
                // Handle contact action
              }}
            >
              Contact
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

