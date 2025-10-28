import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Heart,
  MapPin,
  User,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Roommate } from '@/types'

interface RoommateCardProps {
  roommate: Roommate
  onClick?: () => void
  isSelected?: boolean
}

export default function RoommateCard({ roommate, onClick, isSelected = false }: RoommateCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

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
      {/* Profile Image */}
      <div className="relative h-48 overflow-hidden rounded-t-xl group">
        <img
          src={roommate.user.avatarUrl}
          alt={`${roommate.user.firstName} ${roommate.user.lastName}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

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

        {/* Verification Badge */}
        {roommate.user.verificationStatus === 'VERIFIED' && (
          <div className="absolute bottom-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
            Verified
          </div>
        )}
      </div>

      {/* Roommate Details */}
      <div className="p-4">
        {/* Name and Age */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {roommate.user.firstName} {roommate.user.lastName}
          </h3>
          <span className="text-sm text-gray-500">{roommate.ageRange}</span>
        </div>

        {/* Occupation */}
        <div className="flex items-center text-gray-600 mb-2">
          <User className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="text-sm">{roommate.occupation}</span>
        </div>

        {/* Budget Range */}
        <div className="flex items-center text-gray-600 mb-3">
          <DollarSign className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="text-sm">${roommate.minBudget} - ${roommate.maxBudget}/month</span>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {roommate.bio}
        </p>

        {/* Preferences */}
        <div className="flex flex-wrap gap-2">
          {roommate.preferredCities.slice(0, 2).map((city) => (
            <span
              key={city}
              className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full"
            >
              {city}
            </span>
          ))}
          {roommate.preferredCities.length > 2 && (
            <span className="text-xs text-gray-500 px-2 py-1">
              +{roommate.preferredCities.length - 2} more
            </span>
          )}
        </div>

        {/* Move-in Date */}
        <div className="flex items-center text-gray-500 mt-3 text-xs">
          <Calendar className="w-3 h-3 mr-1" />
          <span>Available {new Date(roommate.preferredMoveInDate).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  )
}
