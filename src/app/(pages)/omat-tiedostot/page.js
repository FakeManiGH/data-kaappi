"use client"
import React, { useEffect, useState } from 'react'
import FileNav from './_components/FileNav'
import FileContainer from './_components/FileContainer'
import { useUser } from '@clerk/nextjs'
import { getFiles } from '@/api/api'
import PageLoading from '@/app/_components/_common/PageLoading'

function Page() {
  const { user, isLoaded } = useUser()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFiles = async () => {
      if (isLoaded && user) {
        const userFiles = await getFiles(user.id)
        setFiles(userFiles)
        setLoading(false)
      }
    }
    fetchFiles()
  }, [isLoaded, user])
    
  return (
    <main className='mt-4'>
      <FileNav />
      {loading ? (
        <PageLoading />
      ) : (
        <FileContainer files={files} setFiles={setFiles} />
      )}
    </main>
  )
}

export default Page