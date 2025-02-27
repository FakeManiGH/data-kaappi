"use client"
import React, { useEffect, useState } from 'react'
import FileNav from './_components/FileNav'
import FileContainer from './_components/FileContainer'
import { useUser } from '@clerk/nextjs'
import { getSharedFiles } from '@/app/file-requests/api'
import { useNavigation } from '@/app/contexts/NavigationContext'
import PageLoading from '@/app/_components/_common/PageLoading'
import ErrorView from '../_components/ErrorView'
import SearchBar from './_components/SearchBar'

function Page() {
  const { setCurrentIndex, navigatePage } = useNavigation()
  const { user, isLoaded } = useUser()
  const [error, setError] = useState(null)
  const [fileState, setFileState] = useState({
    files: [],
    filteredFiles: [],
    searchedFiles: [],
    filter: 'all',
    filtered: false,
    searched: false,
    selectedFiles: [],
    selecting: false,
    loading: true,
  })

  useEffect(() => {
    const fetchFiles = async () => {
      if (isLoaded) {
        if (user) {
          try {
            const sharedFiles = await getSharedFiles()
            setFileState(prevState => ({
              ...prevState,
              files: sharedFiles,
              filteredFiles: sharedFiles,
              loading: false,
            }))
          } catch (err) {
            console.error("Error fetching shared files:", err)
            setError("Jaettujen tiedostojen hakeminen epäonnistui. Yritä uudelleen.")
          }
        } else {
          navigatePage('/sign-in')
        }
      }
    }
    setCurrentIndex('/jaetut-tiedostot')
    fetchFiles()
  }, [isLoaded, user, setCurrentIndex, navigatePage, setFileState, setError])

  if (fileState.loading) return <PageLoading />
  if (error) return <ErrorView message={error} />
  if (!user) return <ErrorView message="Kirjaudu sisään nähdäksesi tämän sivun." />
    
  return (
    <main>
      <FileNav fileState={fileState} setFileState={setFileState} />
      <SearchBar fileState={fileState} setFileState={setFileState} />
      <FileContainer fileState={fileState} />
    </main>
  )
}

export default Page