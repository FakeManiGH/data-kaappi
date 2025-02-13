"use client"
import React, { useEffect, use, useState } from 'react'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '@/../firebaseConfig'
import Link from 'next/link'
import { ArrowLeftSquare, File, FileWarning, Settings, Share } from 'lucide-react'
import FilePreview from './_components/FilePreview'
import FileNav from './_components/FileNav'
import PageLoading from '@/app/_components/_common/PageLoading'

function page({ params }) {
    const { id } = use(params)
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        id && getFileInfo()
    }, [])

    const getFileInfo = async () => {
        const docRef = doc(db, 'files', id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            console.log('Document data:', docSnap.data())
            setFile(docSnap.data())
            setLoading(false)
        } else {
            setLoading(false)
            console.log('No such document!')
        }
    }

    if (loading) return (
        <main>
            <PageLoading />
        </main>
    )

    if (!file) return (
        <main >
            <Link href="/tiedostot" className='flex items-center pb-2 text-sm text-navlink space-x-2 gap-1 hover:text-primary border-b border-contrast2'>
                <ArrowLeftSquare size={24} />
                Palaa tiedostoihin
            </Link>

            <div className='flex flex-col items-center justify-center gap-2 w-full mt-8'>
                <h1 className="text-7xl font-black text-foreground">404</h1>
                <p className='text-lg md:text-xl'>Tiedostoa <strong className='text-primary'>{id}</strong> ei löytynyt...</p>
            </div>
        </main>
    )
    
    return (
        <main>
            <FileNav file={file} setFile={setFile} />
            <FilePreview file={file} setFile={setFile} />
        </main>
    )
}

export default page