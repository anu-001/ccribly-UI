import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/services/api'
import { useNavigate } from 'react-router-dom'

export default function CreateListingPage() {
  const [type, setType] = useState<'rent'|'roommate'>('rent')
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [bedrooms, setBedrooms] = useState('1')
  const [bathrooms, setBathrooms] = useState('1')
  const [furnished, setFurnished] = useState('no')
  const [petsAllowed, setPetsAllowed] = useState('allowed')
  const [amenities, setAmenities] = useState<string>('')
  const [images, setImages] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    setImages(files)
  }

  const uploadImage = async (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    const res = await api.post(`/uploads?useCase=LISTING_IMAGE`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    const payload = res.data?.data ?? res.data
    return payload.url as string
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const imageUrls = await Promise.all(images.map(uploadImage))
      const body:any = {
        title,
        price: Number(price),
        address,
        city,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        furnished: furnished === 'yes',
        petsAllowed: petsAllowed === 'allowed',
        amenities: amenities.split(',').map(a=>a.trim()).filter(Boolean),
        imageUrls,
        listingType: type === 'rent' ? 'RENT' : 'ROOMMATE',
      }
      const res = await api.post('/listings', body)
      const created = res.data?.data ?? res.data
      navigate(`/listings/${created.id || created.listing?.id || ''}`)
    } catch (err:any) {
      console.error('Create listing failed', err)
      alert(err.response?.data?.message || 'Failed to create listing')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Add Listing</h1>
      <div className="bg-white rounded-xl shadow p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Type</label>
              <select className="border rounded-md px-3 py-2 w-full" value={type} onChange={(e)=>setType(e.target.value as any)}>
                <option value="rent">Rent</option>
                <option value="roommate">Looking for roommate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Title</label>
              <input className="border rounded-md px-3 py-2 w-full" value={title} onChange={(e)=>setTitle(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Price (USD)</label>
              <input type="number" className="border rounded-md px-3 py-2 w-full" value={price} onChange={(e)=>setPrice(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">City</label>
              <input className="border rounded-md px-3 py-2 w-full" value={city} onChange={(e)=>setCity(e.target.value)} required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Address</label>
              <input className="border rounded-md px-3 py-2 w-full" value={address} onChange={(e)=>setAddress(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Bedrooms</label>
              <select className="border rounded-md px-3 py-2 w-full" value={bedrooms} onChange={(e)=>setBedrooms(e.target.value)}>
                {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Bathrooms</label>
              <select className="border rounded-md px-3 py-2 w-full" value={bathrooms} onChange={(e)=>setBathrooms(e.target.value)}>
                {[1,2,3,4].map(n=> <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Furnished</label>
              <select className="border rounded-md px-3 py-2 w-full" value={furnished} onChange={(e)=>setFurnished(e.target.value)}>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Pets</label>
              <select className="border rounded-md px-3 py-2 w-full" value={petsAllowed} onChange={(e)=>setPetsAllowed(e.target.value)}>
                <option value="allowed">Allowed</option>
                <option value="not_allowed">Not allowed</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Amenities (comma separated)</label>
              <input className="border rounded-md px-3 py-2 w-full" value={amenities} onChange={(e)=>setAmenities(e.target.value)} placeholder="Pool, Gym, Parking" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Photos</label>
              <input type="file" accept="image/*" multiple onChange={handleImages} />
              {images.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {images.map((f,i)=> (
                    <div key={i} className="w-20 h-20 rounded bg-gray-100 overflow-hidden">
                      <img src={URL.createObjectURL(f)} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-60">
              {submitting ? 'Saving…' : 'Save Listing'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}


