import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function FiltersPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [minPrice, setMinPrice] = useState<string>(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') || '')
  const [beds, setBeds] = useState<string>(searchParams.get('beds') || '')
  const [baths, setBaths] = useState<string>(searchParams.get('baths') || '')
  const [pets, setPets] = useState<string>(searchParams.get('pets') || 'any')
  const [furnished, setFurnished] = useState<string>(searchParams.get('furnished') || 'any')
  const [roommateMode, setRoommateMode] = useState<boolean>(searchParams.get('mode') === 'roommates')
  const [minBudget, setMinBudget] = useState<string>(searchParams.get('minBudget') || '')
  const [maxBudget, setMaxBudget] = useState<string>(searchParams.get('maxBudget') || '')

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (roommateMode) {
      params.set('mode', 'roommates')
      if (minBudget) params.set('minBudget', minBudget)
      if (maxBudget) params.set('maxBudget', maxBudget)
    } else {
      if (minPrice) params.set('minPrice', minPrice)
      if (maxPrice) params.set('maxPrice', maxPrice)
      if (beds) params.set('beds', beds)
      if (baths) params.set('baths', baths)
      if (pets !== 'any') params.set('pets', pets)
      if (furnished !== 'any') params.set('furnished', furnished)
    }
    navigate(`/?${params.toString()}`)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl sm:text-2xl font-bold">All Filters</h1>
            <label className="flex items-center gap-2 text-sm">
              <span>Find Roommate</span>
              <input type="checkbox" checked={roommateMode} onChange={(e)=>setRoommateMode(e.target.checked)} />
            </label>
          </div>

          {!roommateMode && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                <input className="w-full border rounded-md px-3 py-2" placeholder="500" value={minPrice} onChange={(e)=>setMinPrice(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                <input className="w-full border rounded-md px-3 py-2" placeholder="2500" value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Beds</label>
                <select className="w-full border rounded-md px-3 py-2" value={beds} onChange={(e)=>setBeds(e.target.value)}>
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Baths</label>
                <select className="w-full border rounded-md px-3 py-2" value={baths} onChange={(e)=>setBaths(e.target.value)}>
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Pets</label>
                <select className="w-full border rounded-md px-3 py-2" value={pets} onChange={(e)=>setPets(e.target.value)}>
                  <option value="any">Any</option>
                  <option value="allowed">Allowed</option>
                  <option value="not_allowed">Not allowed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Furnished</label>
                <select className="w-full border rounded-md px-3 py-2" value={furnished} onChange={(e)=>setFurnished(e.target.value)}>
                  <option value="any">Any</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          )}

          {roommateMode && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Min Budget</label>
                <input className="w-full border rounded-md px-3 py-2" placeholder="500" value={minBudget} onChange={(e)=>setMinBudget(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Max Budget</label>
                <input className="w-full border rounded-md px-3 py-2" placeholder="2000" value={maxBudget} onChange={(e)=>setMaxBudget(e.target.value)} />
              </div>
              <p className="text-sm text-gray-600 col-span-full">Additional roommate preferences (cleanliness, pets, etc.) can be added similarly.</p>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button onClick={()=>navigate(-1)} className="px-4 py-2 rounded-md border">Cancel</button>
            <button onClick={applyFilters} className="px-4 py-2 rounded-md bg-blue-600 text-white">Apply Filters</button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}



