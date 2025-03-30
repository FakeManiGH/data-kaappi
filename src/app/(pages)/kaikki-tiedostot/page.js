"use client"
import React, { useEffect, useState, useRef } from 'react'
import FileNav from './_components/FileNav'
import FileContainer from './_components/FileContainer'
import { useUser } from '@clerk/nextjs'
import { useNavigation } from '@/app/contexts/NavigationContext'
import { useAlert } from '@/app/contexts/AlertContext'
import PageLoading from '@/app/_components/_common/PageLoading'
import SearchBar from './_components/SearchBar'
import { getUserFiles } from '@/app/file-requests/files'

function Page() {
  const { setCurrentIndex, navigatePage } = useNavigation()
  const { user, isLoaded } = useUser()
  const { showAlert } = useAlert()
  const [fileState, setFileState] = useState({
    files: [],
    filteredFiles: [],
    filter: 'all',
    filtered: false,
    searchedFiles: [],
    searched: false,
    sortedFiles: [],
    sortedBy: 'date-desc', 
    sorted: false,
    view: 'grid',
    loading: true,
  })

  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDelta, setScrollDelta] = useState(0);
  const scrollThreshold = 225 // Hide from top
  const sensitivityThreshold = 20 // Sensitivity


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY

      if (Math.abs(delta) > sensitivityThreshold) {
        if (delta > 0 && currentScrollY > scrollThreshold) {
          // Scrolling down
          setIsVisible(false)
        } else {
          // Scrolling up
          setIsVisible(true)
        }
        setLastScrollY(currentScrollY)
        setScrollDelta(0)
      } else {
        setScrollDelta(scrollDelta + delta)
      }
    }

    const handleMenuBackground = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > scrollThreshold) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    }

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleMenuBackground);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleMenuBackground);
    }
  }, [lastScrollY, scrollThreshold, sensitivityThreshold, scrollDelta])

  useEffect(() => {
    const fetchFiles = async () => {
      if (isLoaded && user) {
        try {
          const userFiles = await getUserFiles(user.id)

          setFileState(prevState => ({
            ...prevState,
            files: userFiles,
            filteredFiles: userFiles,
            loading: false,
          }))

        } catch (error) {
          showAlert('Tiedostojen hakeminen epäonnistui. Yritä uudelleen.', 'error')
          setFileState(prevState => ({ ...prevState, loading: false }))
        }
      } else {
        navigatePage('/sign-in')
      }
    }

    fetchFiles()
    setCurrentIndex('/kaikki-tiedostot')
  }, [isLoaded, user, setCurrentIndex, setFileState, navigatePage])

  if (fileState.loading) return <PageLoading />
    
  return (
    <main>
      <h1 className='text-2xl md:text-3xl'><strong>Kaikki tiedostot</strong></h1>
      <FileNav fileState={fileState} setFileState={setFileState} />
      <div 
        className={`sticky top-0 flex flex-col z-10 py-2 gap-2 duration-300 
          ${isVisible ? 'translate-y-0' : '-translate-y-full'}
          ${isSticky ? 'w-screen ml-[-16px] bg-background' : ' bg-transparent'}`}
      >
        <SearchBar fileState={fileState} setFileState={setFileState} />
      </div>  
      <FileContainer fileState={fileState} setFileState={setFileState} />
    </main>
  )
}

export default Page