import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/services/api'
import { Link, useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const run = async () => {
      if (!user) return
      try {
        setLoading(true)
        const res = await api.get('/favorites')
        setFavorites(res.data?.data ?? res.data)
      } catch (e:any) {
        setError(e.response?.data?.message || 'Failed to load favorites')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [user])
  
  const removeFavorite = async (listingId: string) => {
    try {
      await api.delete(`/favorites/${listingId}`)
      setFavorites((prev)=>prev.filter((f:any)=> (f.listing?.id || f.id) !== listingId))
    } catch (e:any) {
      console.error('Remove favorite failed', e)
    }
  }
  if (!user) return <div className="p-6">Please sign in to view your profile.</div>
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">My Profile</h1>
      <div className="bg-white rounded-xl shadow p-4 sm:p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-gray-200 rounded-full" />
          <div>
            <div className="text-lg font-semibold">{user.firstName} {user.lastName}</div>
            <div className="text-gray-600 text-sm">{user.email}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Role:</span> {user.role}</div>
          <div><span className="text-gray-500">Verification:</span> {user.verificationStatus}</div>
          {user.phoneNumber && (<div><span className="text-gray-500">Phone:</span> {user.phoneNumber}</div>)}
          {user.dateOfBirth && (<div><span className="text-gray-500">DOB:</span> {new Date(user.dateOfBirth as any).toLocaleDateString()}</div>)}
        </div>
        {user.verificationStatus !== 'VERIFIED' && (
          <div className="mt-4">
            <button
              onClick={() => {
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                navigate(isMobile ? '/verification' : '/verification/qr')
              }}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Verify identity
            </button>
          </div>
        )}
        { (user as any).bio && (
          <div className="mt-4">
            <div className="text-sm text-gray-500 mb-1">Bio</div>
            <div className="text-gray-800 whitespace-pre-line">{(user as any).bio}</div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Favorites</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_,i)=> (
              <div key={i} className="animate-pulse bg-white rounded-xl shadow overflow-hidden">
                <div className="h-40 bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : favorites.length === 0 ? (
          <div className="text-gray-600">No favorites yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favorites.map((fav:any) => {
              const listing = fav.listing || fav
              const id = listing.id
              const title = listing.title || 'Listing'
              const price = listing.price
              const img = (listing.images && listing.images[0]) || (listing.imageUrls && listing.imageUrls[0])
              return (
                <div key={id} className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
                  <Link to={`/listings/${id}`} className="block">
                    <div className="h-40 bg-gray-100">
                      {img ? (
                        <img src={img} alt={title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">No image</div>
                      )}
                    </div>
                  </Link>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link to={`/listings/${id}`} className="block text-sm font-semibold text-gray-900 line-clamp-1">{title}</Link>
                        {price !== undefined && (
                          <div className="text-gray-700 text-sm">${price}</div>
                        )}
                      </div>
                      <button onClick={()=>removeFavorite(id)} className="text-xs text-red-600 hover:text-red-700">Remove</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}


