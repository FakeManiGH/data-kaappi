"use client"
import React, { useEffect, useState } from 'react'
import FileNav from './_components/FileNav'
import FileContainer from './_components/FileContainer'
import { useUser } from '@clerk/nextjs'
import { useNavigation } from '@/app/contexts/NavigationContext'
import { useAlert } from '@/app/contexts/AlertContext'
import PageLoading from '@/app/_components/_common/PageLoading'
import SearchBar from './_components/SearchBar'

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
    selectedFiles: [],
    selecting: false,
    loading: true,
  })

  useEffect(() => {
    const fetchFiles = async () => {
      if (isLoaded && user) {
        try {
          const response = await fetch(`/api/get-files-user?userID=${user.id}`, {
            method: 'GET',
          })

          const data = await response.json()

          if (!response.ok) {
            showAlert(data.message, 'error')
            return
          } 

          const userFiles = data.files.map(file => ({
            ...file,
          }))

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
    setCurrentIndex('/omat-tiedostot')
  }, [isLoaded, user, setCurrentIndex, setFileState, navigatePage])

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