"use client"
import SpaceMeterCircle from '@/app/_components/_common/SpaceMeterCircle'
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import PageLoading from '@/app/_components/_common/PageLoading'
import { getUser } from '@/app/file-requests/api'
import NavigationGrid from '@/app/_components/_common/NavigationGrid'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useNavigation } from '@/app/contexts/NavigationContext'
import ErrorView from '../_components/ErrorView'

function Page() {
  const { user, isLoaded } = useUser()
  const [userDoc, setUserDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { setCurrentIndex, navigatePage } = useNavigation()

  useEffect(() => {
    setCurrentIndex('/kojelauta')
    if (isLoaded) {
      if (user) {
        getUser(user.id)
          .then((doc) => {
            setUserDoc(doc)
            setLoading(false)
          })
          .catch((err) => {
            console.error("Error fetching user document:", err)
            setError("Käyttäjätietojen hakeminen epäonnistui. Yritä uudelleen.")
            setLoading(false)
          })
      } else {
        navigatePage('/sign-in')
      }
    }
  }, [isLoaded, user, setUserDoc, setLoading, setCurrentIndex, navigatePage])

  if (loading) return <PageLoading />
  if (error) return <ErrorView message={error} />
  if (!user) return <ErrorView message="Kirjaudu sisään nähdäksesi tämän sivun." />

  return (
    <main>
      <h1 className='text-2xl md:text-3xl'><strong>Hei, {user?.fullName}</strong></h1>
      <div className='flex items-center flex-wrap px-4 gap-4'>
        <SpaceMeterCircle usedSpace={userDoc?.usedSpace} totalSpace={userDoc?.totalSpace} />
        <div className='flex flex-col gap-2'>
          <h3 className='text-xl font-bold'>Tallennustilan käyttö</h3>
          <p className='text-sm'>Voit tarvittaessa tilata lisää tallennustilaa (<strong>tulossa</strong>).</p>
          <Link className='flex items-center gap-1 text-sm text-navlink line-through' href="#">
            <ChevronRight size={24} className='text-primary' />
            Hallitse tilausta
          </Link>
        </div>
      </div>
      <NavigationGrid />
    </main> 
  )
}

export default Page