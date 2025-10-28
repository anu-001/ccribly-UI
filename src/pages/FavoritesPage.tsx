import React, { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function FavoritesPage(){
  const [favorites,setFavorites] = useState<any[]>([])
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState<string|null>(null)
  const { isAuthenticated } = useAuthStore()

  useEffect(()=>{
    const run=async()=>{
      try{
        setLoading(true)
        const res = await api.get('/favorites')
        setFavorites(res.data?.data ?? res.data)
      }catch(e:any){
        setError(e.response?.data?.message||'Failed to load favorites')
      }finally{setLoading(false)}
    }
    run()
  },[])
  
  if(!isAuthenticated){
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Sign in to view favorites</h1>
        <p className="text-gray-600 mb-4">Your saved homes and roommate matches appear here.</p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/auth/signin" className="px-4 py-2 rounded-md bg-blue-600 text-white">Sign In</Link>
          <Link to="/auth/signup" className="px-4 py-2 rounded-md border">Create account</Link>
        </div>
      </div>
    )
  }
  if(loading) return <div className="p-6">Loading…</div>
  if(error){
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">We couldn't load your favorites</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/auth/signin" className="px-4 py-2 rounded-md bg-blue-600 text-white">Sign In</Link>
          <Link to="/auth/signup" className="px-4 py-2 rounded-md border">Create account</Link>
        </div>
      </div>
    )
  }
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">My Favorites</h1>
      {favorites.length===0? (
        <div className="text-gray-600">No favorites yet.</div>
      ):(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((fav:any)=>{
            const l = fav.listing||fav
            const id = l.id
            const img = (l.images && l.images[0]) || (l.imageUrls && l.imageUrls[0])
            return (
              <Link key={id} to={`/listings/${id}`} className="bg-white rounded-xl shadow hover:shadow-md overflow-hidden">
                <div className="h-40 bg-gray-100">{img? <img src={img} alt="" className="w-full h-full object-cover"/>: null}</div>
                <div className="p-3">
                  <div className="font-semibold line-clamp-1">{l.title||'Listing'}</div>
                  {l.price!==undefined && <div className="text-gray-700 text-sm">${l.price}</div>}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}


