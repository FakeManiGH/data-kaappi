"use client"
import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { ArrowLeftSquare, Bold, LockKeyhole } from 'lucide-react'
import FilePreview from './_components/FilePreview'
import FileNav from './_components/FileNav'
import PageLoading from '@/app/_components/_common/PageLoading'
import { useNavigation } from '@/app/contexts/NavigationContext'
import { getFileInfo } from '@/app/file-requests/api'
import { useAlert } from '@/app/contexts/AlertContext'
import { useUser } from '@clerk/nextjs'
import PasswordPrompt from './_components/PasswordPrompt'

function Page({ params }) {
    const { id } = use(params)
    const { setCurrentIndex, navigatePage } = useNavigation()
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(true)
    const { user, isLoaded } = useUser()
    const { showAlert } = useAlert()
    const [isPasswordValid, setIsPasswordValid] = useState(false)

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

    const validatePassword = async (e) => {
        setLoading(true)
        e.preventDefault()
        const password = e.target.password.value

        if (!password) {
            showAlert('Anna tiedoston salasana.', 'error')
            setLoading(false)
            return
        }

        try {
            const response = await fetch('/api/verify-file-password', {
                method: 'POST',
                body: JSON.stringify({ fileID: id, password }), 
            });

            const data = await response.json();

            if (data.valid) {
                setIsPasswordValid(true);
            } else {
                showAlert('Virheellinen salasana, yritä uudelleen.', 'error');
            }

            setLoading(false);
        } catch (error) {
            console.error('Error verifying password:', error);
        }
    };

    if (loading) return <PageLoading />

    if (!file || (file && !file.shared && user?.id !== file.userID)) return (
        <main>
            <Link href="/omat-tiedostot" onClick={() => setCurrentIndex('/omat-tiedostot')} className='flex items-center text-sm text-navlink space-x-2 gap-1 hover:text-primary'>
                <ArrowLeftSquare size={24} />
                Palaa tiedostoihin
            </Link>

            <div className='flex flex-col items-center justify-center gap-2 w-full mt-8'>
                <h1 className="text-7xl font-black text-foreground">404</h1>
                <p className='text-xl md:text-2xl'>Tiedostoa <strong className='text-primary text-2x md:3xl'>{id}</strong> ei löytynyt...</p>
            </div>
        </main>
    )

    if (file.password && !isPasswordValid && user?.id !== file.userID) return (
        <main>
            <Link href="/jaetut-tiedostot" onClick={() => setCurrentIndex('/jaetut-tiedostot')} className='flex items-center text-sm text-navlink space-x-2 gap-1 hover:text-primary'>
                <ArrowLeftSquare size={24} />
                Jaetut tiedostot
            </Link>
            <div className='flex flex-col items-center justify-center w-full mt-8'>
                <div className='flex flex-col gap-4 w-full max-w-2xl'>
                    <h1 className='text-lg md:text-xl'>Tiedosto <span className='font-bold text-primary'>{file.fileName}</span> on suojattu salasanalla</h1>
                    <PasswordPrompt validatePassword={validatePassword} />
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

export default Page