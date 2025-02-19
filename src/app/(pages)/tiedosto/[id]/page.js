"use client"
import React, { useEffect, use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeftSquare, File, FileWarning, Settings, Share } from 'lucide-react'
import FilePreview from './_components/FilePreview'
import FileNav from './_components/FileNav'
import PageLoading from '@/app/_components/_common/PageLoading'
import { useNavigation } from '@/app/contexts/NavigationContext'
import { getFileInfo,  } from '@/api/api'

function page({ params }) {
    const { id } = use(params)
    const { setCurrentIndex } = useNavigation()
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getFile = async (id) => {
            try {
                const fileData = await getFileInfo(id)
                setFile(fileData)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching file: ", error)
                setLoading(false)
            } 
        }

        id && getFile(id)
    }, [id])

    if (loading) return <PageLoading />

    if (!file) return (
        <main >
            <Link href="/omat-tiedostot" onClick={() => setCurrentIndex('/omat-tiedostot')} className='flex items-center pb-2 text-sm text-navlink space-x-2 gap-1 hover:text-primary border-b border-contrast2'>
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
            <div className='flex flex-col gap-1'>
                <h1 className='text-2xl md:text-3xl'><strong>{file.fileName}</strong></h1>
                <p className='text-navlink'>{file.userName}</p>
            </div>

            <FileNav file={file} setFile={setFile} />
            <FilePreview file={file} setFile={setFile} />
        </main>
    )
}

export default page