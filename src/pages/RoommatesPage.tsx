import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/services/api'

export default function RoommatesPage(){
  const [items,setItems] = useState<any[]>([])
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState<string|null>(null)

  useEffect(()=>{
    const run = async()=>{
      try{
        setLoading(true)
        const res = await api.get('/explore')
        const data = res.data?.data ?? res.data
        setItems((data||[]).filter((i:any)=>i.type==='roommate').map((i:any)=>i.item))
      }catch(e:any){
        setError(e.response?.data?.message||'Failed to load')
      }finally{setLoading(false)}
    }
    run()
  },[])

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Find a Roommate</h1>
      {loading? <div>Loading…</div>: error? <div className="text-red-600">{error}</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((r:any)=> (
            <div key={r.id} className="bg-white rounded-xl shadow p-4">
              <div className="text-lg font-semibold">{r.firstName} {r.lastName}</div>
              <div className="text-gray-600 text-sm">Budget: {r.budget ? `$${r.budget}` : '—'}</div>
              <p className="text-gray-700 mt-2 line-clamp-3">{r.bio}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}



