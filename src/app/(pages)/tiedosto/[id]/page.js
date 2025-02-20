"use client"
import React, { useEffect, use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeftSquare, LockKeyhole } from 'lucide-react'
import FilePreview from './_components/FilePreview'
import FileNav from './_components/FileNav'
import PageLoading from '@/app/_components/_common/PageLoading'
import { useNavigation } from '@/app/contexts/NavigationContext'
import { getFileInfo,  } from '@/api/api'
import { useUser } from '@clerk/nextjs'
import PasswordPrompt from './_components/PasswordPrompt'

function page({ params }) {
    const { id } = use(params)
    const { setCurrentIndex, navigatePage } = useNavigation()
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(true)
    const { user, isLoaded } = useUser()
    const [accessPassword, setAccessPassword] = useState('')

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

        if (isLoaded && !user) navigatePage('/sign-in')
        id && getFile(id)
    }, [id])

    if (loading) return <PageLoading />

    // No file found or not shared
    if (!file || (file && !file.shared && user?.id !== file.owner)) return (
        <main>
            <Link href="/omat-tiedostot" onClick={() => setCurrentIndex('/omat-tiedostot')} className='flex items-center text-sm text-navlink space-x-2 gap-1 hover:text-primary'>
                <ArrowLeftSquare size={24} />
                Palaa tiedostoihin
            </Link>

            <div className='flex flex-col items-center justify-center gap-2 w-full mt-8'>
                <h1 className="text-7xl font-black text-foreground">404</h1>
                <p className='text-lg md:text-xl'>Tiedostoa <strong className='text-primary'>{id}</strong> ei löytynyt...</p>
            </div>
        </main>
    )

    // Password protected file
    if (file && (file.password !== accessPassword) && (user?.id !== file.owner)) return (
        <main>
            <Link href="/jaetut-tiedostot" onClick={() => setCurrentIndex('/jaetut-tiedostot')} className='flex items-center text-sm text-navlink space-x-2 gap-1 hover:text-primary'>
                <ArrowLeftSquare size={24} />
                Jaetut tiedostot
            </Link>
            <div className='flex flex-col items-center justify-center w-full mt-8'>
                <div className='flex flex-col gap-4 max-w-2xl'>
                    <h1 className='font-semibold text-xl'>Tiedosto <span className='font-bold text-2xl text-primary'>{file.fileName}</span> vaatii salasanan:</h1>
                    <PasswordPrompt setAccessPassword={setAccessPassword} />
                </div>
            </div>
        </main>
    )
    
    return (
        <main>
            <FileNav file={file} setFile={setFile} />

            <div className='flex flex-col gap-1'>
                <h1 className='text-xl md:text-3xl'><strong>{file.fileName}</strong></h1>
                <p className='text-navlink'>{file.userName}</p>
            </div>

            <FilePreview file={file} setFile={setFile} />
        </main>
    )
}

export default page