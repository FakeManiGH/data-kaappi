"use client"
import React, { useEffect, useState } from 'react'
import FileNav from './_components/FileNav'
import FileContainer from './_components/FileContainer'
import { useUser } from '@clerk/nextjs'
import { getFiles } from '@/api/api'
import PageLoading from '@/app/_components/_common/PageLoading'
import SearchBar from './_components/SearchBar'

function Page() {
  const { user, isLoaded } = useUser()
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
      if (isLoaded && user) {
        const userFiles = await getFiles(user.id)
        setFileState(prevState => ({
          ...prevState,
          files: userFiles,
          filteredFiles: userFiles,
          loading: false,
        }))
      }
    }
    fetchFiles()
  }, [isLoaded, user])

  if (!isLoaded) return <PageLoading />
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