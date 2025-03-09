"use client"
import SpaceMeterCircle from '@/app/_components/_common/SpaceMeterCircle'
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import PageLoading from '@/app/_components/_common/PageLoading'
import { getUser } from '@/app/file-requests/api'
import Link from 'next/link'
import { Settings2 } from 'lucide-react'
import { useNavigation } from '@/app/contexts/NavigationContext'
import ErrorView from '../_components/ErrorView'

function Page() {
  const { user, isLoaded } = useUser()
  const [userDoc, setUserDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { setCurrentIndex, navigatePage, navList, currentIndex, } = useNavigation()

  // Exclude the current page from the navigation list
  const filteredList = navList.filter((item) => item.path !== currentIndex)

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
      <h1 className='text-2xl md:text-3xl'><strong>Hei, {user?.firstName}</strong></h1>
      
      <div className='flex items-center flex-wrap px-6 gap-4 min-h-72 shadow-md bg-gradient-to-br from-background to-contrast p-4'>
        <SpaceMeterCircle usedSpace={userDoc?.usedSpace} totalSpace={userDoc?.totalSpace} />
        <div className='flex flex-col gap-2'>
          <h3 className='text-xl font-bold'>Tallennustilan käyttö</h3>
          <p className='text-sm'>Voit tarvittaessa tilata lisää tallennustilaa (<strong>tulossa</strong>).</p>
          <Link className='flex items-center w-fit gap-2 px-3 py-2 mt-2 text-sm bg-navlink cursor-not-allowed text-white transition-colors' href="#">
            <Settings2 />
            Hallitse tilausta
          </Link>
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-4'>
          {filteredList.map((item) => (
          <Link 
              href={item.path}
              key={item.id}
              className="flex flex-1 h-fit flex-col items-center justify-center p-4 text-sm cursor-pointer shadow-md hover:shadow-lg bg-primary text-white
                 hover:bg-primary/75 transition-colors"
              >
                  <item.icon className='mb-2' size={30} />
                  <p className="whitespace-nowrap">{item.name}</p>
          </Link>
          ))}
      </div>
    </main> 
  )
}

export default Page