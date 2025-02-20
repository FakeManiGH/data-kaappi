"use client"
import ProgressCircle from '@/app/_components/_common/ProgressCircle'
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import PageLoading from '@/app/_components/_common/PageLoading'
import { LogIn } from 'lucide-react'
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
  if (!user) return (
    <main>
      <div className='flex flex-col items-center justify-center h-96'>
        <h1 className='text-2xl md:text-3xl'><strong>Pääsy kielletty, kirjaudu sisään.</strong></h1>
        <button className='flex items-center w-fit gap-1.5 p-2 px-3 rounded-full bg-primary hover:bg-primary/90'><LogIn size={20} /> Kirjaudu sisään</button>
      </div>
    </main>
  )

  return (
    <main>
      <h1 className='text-2xl md:text-3xl'><strong>Hei, {user.fullName}</strong></h1>
      <ProgressCircle usedSpace={userDoc?.usedSpace} totalSpace={userDoc?.totalSpace} />
    </main>
  )
}

export default page