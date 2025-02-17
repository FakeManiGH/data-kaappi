"use client"
import React, { useEffect, useState } from 'react'
import FileNav from './_components/FileNav'
import FileContainer from './_components/FileContainer'
import { useUser } from '@clerk/nextjs'
import { getFiles } from '@/api/api'
import PageLoading from '@/app/_components/_common/PageLoading'
import SearchBar from './_components/SearchBar'
import { set } from 'date-fns'

function Page() {
  const { user, isLoaded } = useUser()
  const [files, setFiles] = useState([])
  const [filteredFiles, setFilteredFiles] = useState([])
  const [searchedFiles, setSearchedFiles] = useState([])
  const [search, setSearch] = useState(false)
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
      <FileNav files={files} setFilteredFiles={setFilteredFiles} />
      <SearchBar files={filteredFiles} setSearchedFiles={setSearchedFiles} setSearch={setSearch}/>
      {loading ? (
        <PageLoading />
      ) : (
        <FileContainer files={search ? searchedFiles : filteredFiles} setFiles={setFiles} />
      )}
    </main>
  )
}

export default Page