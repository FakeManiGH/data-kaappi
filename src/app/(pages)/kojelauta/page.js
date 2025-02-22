"use client"
import SpaceMeter from '@/app/_components/_common/SpaceMeter'
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import PageLoading from '@/app/_components/_common/PageLoading'
import { getUser } from '@/app/file-requests/api'


function page() {
  const { user, isLoaded } = useUser()
  const [userDoc, setUserDoc] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      getUser(user.id).then((doc) => {
        setUserDoc(doc)
        setLoading(false)
      })
    }
  }, [isLoaded, user, setUserDoc, setLoading])

  if (loading) return <PageLoading />
  
  return (
    <main>
      <h1 className='text-2xl md:text-3xl'><strong>Hei, {user.fullName}</strong></h1>
      <div className='flex items-center gap-4'>
        <SpaceMeter usedSpace={userDoc?.usedSpace} totalSpace={userDoc?.totalSpace} />
        <h3 className='text-xl'>Tallennustilan käyttö</h3>
      </div>
    </main>
  )
}

export default page