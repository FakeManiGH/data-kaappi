"use client"
import React, { useEffect, useState } from 'react'
import FileNav from './_components/FileNav'
import FileContainer from './_components/FileContainer'
import { useUser } from '@clerk/nextjs'
import { getFiles } from '@/app/file-requests/api'
import { useNavigation } from '@/app/contexts/NavigationContext'
import { useAlert } from '@/app/contexts/AlertContext'
import PageLoading from '@/app/_components/_common/PageLoading'
import SearchBar from './_components/SearchBar'

function Page() {
  const { setCurrentIndex } = useNavigation()
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
    selectedFiles: [],
    selecting: false,
    loading: true,
  })

  useEffect(() => {
    const fetchFiles = async () => {
      if (isLoaded && user) {
        try {
          const userFiles = await getFiles(user.id)
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
      }
    }
    setCurrentIndex('/omat-tiedostot')
    fetchFiles()
  }, [isLoaded, user, setCurrentIndex, setFileState])

  if (fileState.loading) return <PageLoading />
    
  return (
    <main>
      <FileNav fileState={fileState} setFileState={setFileState} />
      <SearchBar fileState={fileState} setFileState={setFileState} />
      <FileContainer fileState={fileState} setFileState={setFileState} />
    </main>
  )
}

export default Page