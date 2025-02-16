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
  const [files, setFiles] = useState([])
  const [filteredFiles, setFilteredFiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFiles = async () => {
      if (isLoaded && user) {
        const userFiles = await getFiles(user.id)
        setFiles(userFiles)
        setFilteredFiles(userFiles)
        setLoading(false)
      }
    }
    fetchFiles()
  }, [isLoaded, user])
    
  return (
    <main>
      <FileNav files={files} />
      <SearchBar files={files} setFilteredFiles={setFilteredFiles} />
      {loading ? (
        <PageLoading />
      ) : (
        <FileContainer files={filteredFiles} setFiles={setFiles} setFilteredFiles={setFilteredFiles} />
      )}
    </main>
  )
}

export default Page