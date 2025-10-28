import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'
import { Link } from 'react-router-dom'

export default function ListingDetailPage() {
  const { id } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/listings/${id}`)
        setData(res.data?.data ?? res.data)
      } catch (e:any) {
        setError(e.response?.data?.message || 'Failed to load listing')
      } finally {
        setLoading(false)
      }
    }
    if (id) run()
  }, [id])

  if (loading) return <div className="p-6">Loading…</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!data) return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-100 rounded-xl h-64 sm:h-96 overflow-hidden">
          {data.images?.[0] ? (
            <img src={data.images[0]} alt={data.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>
          )}
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{data.title || 'Listing'}</h1>
          <p className="text-gray-600 mb-4">{data.address}</p>
          <div className="text-2xl font-semibold mb-4">{data.price ? `$${data.price}` : ''}</div>
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-6">
            <div>Bedrooms: {data.bedrooms ?? '-'}</div>
            <div>Bathrooms: {data.bathrooms ?? '-'}</div>
            <div>Furnished: {data.furnished ? 'Yes' : 'No'}</div>
            <div>Pets: {data.petsAllowed ? 'Allowed' : 'Not allowed'}</div>
          </div>
          <p className="text-gray-800 leading-relaxed">{data.description}</p>

          {/* CTA */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {isAuthenticated ? (
              <>
                <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                  {String(data.listingType || '').toUpperCase() === 'ROOMMATE' ? 'Request to Connect' : 'Contact Landlord/Agent'}
                </button>
                <button className="px-4 py-2 rounded-md border hover:bg-gray-50">Save to Favorites</button>
              </>
            ) : (
              <Link to="/auth/signin" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 inline-block">Sign in to contact</Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}


