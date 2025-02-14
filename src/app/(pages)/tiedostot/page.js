"use client"
import React, { useEffect, useState } from 'react'
import FileNav from './_components/FileNav'
import FileContainer from './_components/FileContainer'
import { useUser } from '@clerk/nextjs'
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '@/../firebaseConfig';
import PageLoading from '@/app/_components/_common/PageLoading'

function Page() {
  const { user, isLoaded } = useUser()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      getFiles()
    }
  }, [isLoaded, user])

  const getFiles = async () => {
    setLoading(true)
    try {
      const q = query(collection(db, "files"), where("owner", "==", user.id));
      const querySnapshot = await getDocs(q);
      const filesData = querySnapshot.docs.map(doc => doc.data())
      setFiles(filesData)
    } catch (error) {
      console.error("Error fetching files: ", error)
    } finally {
      setLoading(false)
    }
  }
    
  return (
    <main className='mt-4'>
      <FileNav />
      {loading ? (
        <PageLoading />
      ) : (
        <FileContainer files={files} />
      )}
    </main>
  )
}

export default Page