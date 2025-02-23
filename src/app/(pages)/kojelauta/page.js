"use client"
import SpaceMeter from '@/app/_components/_common/SpaceMeter'
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import PageLoading from '@/app/_components/_common/PageLoading'
import { getUser } from '@/app/file-requests/api'
import NavigationGrid from '@/app/_components/_common/NavigationGrid'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useNavigation } from '@/app/contexts/NavigationContext'


function page() {
  const { user, isLoaded } = useUser()
  const [userDoc, setUserDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const { setCurrentIndex, navigatePage } = useNavigation()
 
  useEffect(() => {
    setCurrentIndex('/kojelauta')
    if (isLoaded && user) {
      getUser(user.id).then((doc) => {
        setUserDoc(doc)
        setLoading(false)
      })
    } else {
      navigatePage('/kirjaudu')
    }
  }, [isLoaded, user, setUserDoc, setLoading, setCurrentIndex])

  if (loading) return <PageLoading />
  
  return (
    <main>
      <h1 className='text-2xl md:text-3xl'><strong>Hei, {user?.fullName}</strong></h1>
      <div className='flex items-center gap-4 p-2'>
        <SpaceMeter usedSpace={userDoc?.usedSpace} totalSpace={userDoc?.totalSpace} />
        <div className='flex flex-col gap-2'>
          <h3 className='text-xl font-bold'>Tallennustilan käyttö</h3>
          <Link className='flex gap-1 text-sm text-navlink hover:text-primary' href="/tilaukset">
            <ChevronRight size={20} />
            Hallitse tilausta
          </Link>
        </div>
      </div>
      <NavigationGrid />
    </main>
  )
}

export default page