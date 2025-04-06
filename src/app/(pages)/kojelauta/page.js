"use client"
import SpaceMeterCircle from '@/app/_components/_common/SpaceMeterCircle'
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import PageLoading from '@/app/_components/_common/PageLoading'
import { getUser, getUserDocument } from '@/app/file-requests/api'
import Link from 'next/link'
import { BadgeCheck, CircleAlert, Frown, Settings2 } from 'lucide-react'
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
    const getUserData = async () => {
      if (isLoaded && user) {
        try {
          const response = await getUserDocument(user.id);
          if (response.success) {
            setUserDoc(response.document);
          } else {
            setError(response.message || "Käyttäjätietojen hakemisessa tapahtui virhe.");
          }
        } catch (error) {
          console.error("Error fetching userdata: " + error);
          setError(error.message || "Palvelinvirhe, yritä uudelleen.");
        } finally {
          setLoading(false);
        }
      } else {
        navigatePage('/sign-in')
      }
    }

    getUserData();
  }, [isLoaded, user, setCurrentIndex, navigatePage])

  if (loading) return <PageLoading />
  if (error) return <ErrorView message={error} />
  if (!user) return <ErrorView message="Kirjaudu sisään nähdäksesi tämän sivun." />

  return (
    <main>
      <h1 className='text-4xl md:text-4xl'><strong>Hei, {user?.firstName}</strong></h1>
      
      <div 
        className='flex items-center justify-center min-h-96 px-4 py-8 pr-4 bg-[url(/images/helsinki.jpg)] bg-bottom mr-[-1rem] md:mr-[-2rem]
          rounded-l-full'
      >
        <div className='flex gap-2 p-4 flex-wrap items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl shadow-lg shadow-black/25'>
          <SpaceMeterCircle usedSpace={userDoc?.usedSpace} totalSpace={userDoc?.totalSpace} />
          <div className='flex flex-col gap-2'>
            <h3 className='text-xl font-bold'>Tallennustilan käyttö</h3>
            <p className='text-sm'>Voit tarvittaessa tilata lisää tallennustilaa (<strong>tulossa</strong>).</p>
            <Link className='flex items-center w-fit gap-2 px-3 py-2 mt-2 rounded-lg text-sm bg-navlink shadow-black/25 shadow-md 
                cursor-not-allowed text-white transition-colors' href="#"
            >
              <Settings2 />
              Hallitse tilausta
            </Link>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-2 mt-2'>
          {filteredList.map((item) => (
          <Link 
              href={item.path}
              key={item.id}
              className="flex items-center justify-center gap-1 p-4 rounded-lg text-sm 
                bg-primary shadow-black/25 shadow-md text-white hover:bg-primary/75 transition-colors"
              >
                <item.icon />
                <p className="whitespace-nowrap">{item.name}</p>
          </Link>
          ))}
      </div>
    </main> 
  )
}

export default Page