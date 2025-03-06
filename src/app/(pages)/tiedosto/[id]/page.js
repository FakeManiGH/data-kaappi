"use client"
import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { ArrowLeftSquare, ScanEye, User2, Share2, LockKeyholeOpen, ArrowLeftCircle } from 'lucide-react'
import FilePreview from './_components/FilePreview'
import FileNav from './_components/FileNav'
import PageLoading from '@/app/_components/_common/PageLoading'
import { useNavigation } from '@/app/contexts/NavigationContext'
import { getFileInfo } from '@/app/file-requests/api'
import { useAlert } from '@/app/contexts/AlertContext'
import { useUser } from '@clerk/nextjs'
import PasswordPrompt from './_components/PasswordPrompt'
import FileLivePreview from './_components/FileLivePreview';
import DownloadBtn from './_components/DownloadBtn';
import ErrorView from '../../_components/ErrorView'

function Page({ params }) {
    const { id } = use(params)
    const { setCurrentIndex, navigatePage } = useNavigation()
    const [file, setFile] = useState(null)
    const [deleted, setDeleted] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const { user, isLoaded } = useUser()
    const { showAlert } = useAlert()
    const [isPasswordValid, setIsPasswordValid] = useState(false)
    const [livePreview, setLivePreview] = useState(false)

    useEffect(() => {
        const getFile = async (id) => {
            try {
                const response = await fetch(`/api/get-file-info?fileID=${id}`)
                const data = await response.json()
                if (response.ok) {
                    setFile(data.file)
                } else {
                    setError(data.message)
                    showAlert(data.message, 'error')
                }
            } catch (error) {
                console.error("Error fetching file: ", error)
            } finally {
                setLoading(false)
            }
        }

        if (isLoaded) {
            if (!user) {
                navigatePage('/sign-in')
            } else if (deleted) {
                navigatePage('/kaikki-tiedostot')
            } else {
                setCurrentIndex(`/tiedosto/${id}`)
                id && getFile(id)
            }
        }
    }, [id, isLoaded, user, setCurrentIndex, navigatePage, deleted])

    // Validate password
    const validatePassword = async (e) => {
        setLoading(true)
        e.preventDefault()
        const password = e.target.password.value

        if (!password) {
            showAlert('Anna kelvollinen salasana.', 'error')
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

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: file.fileName,
                    text: `Moikka, katso mitä löysin: ${file.fileName}`,
                    url: file.fileUrl,
                });
            } catch (error) {
                console.error('Error sharing file:', error);
            }
        } else {
            showAlert('Suoraa jakoa ei tueta tällä laitteella.', 'error');
        }
    };

    
    {/* PAGE CONTENT */}
    if (loading) return <PageLoading />
    if (error) return <ErrorView message={error} />
    if (!user) return <ErrorView message="Kirjaudu sisään nähdäksesi tämän sivun." />

    if (!file || (file && !file.shared && user?.id !== file.user.id)) return (
        <main>
            <Link href="/kaikki-tiedostot" className='flex items-center text-sm text-navlink gap-2 hover:text-foreground'>
                <ArrowLeftCircle size={24} className='text-primary' />
                Kaikki tiedostot
            </Link>

            <div className='flex flex-col items-center justify-center gap-2 w-full mt-8'>
                <h1 className="text-7xl font-black text-foreground">404</h1>
                <p className='text-xl md:text-2xl'>Tiedostoa <strong className='text-primary text-2x md:3xl'>{id}</strong> ei löytynyt...</p>
            </div>
        </main>
    )

    if (file.password && !isPasswordValid && user?.id !== file.user.id) return (
        <main>
            <Link href="/jaetut-tiedostot" className='flex items-center text-sm text-navlink space-x-2 gap-1 hover:text-foreground'>
                <ArrowLeftCircle className='text-primary' />
                Jaetut tiedostot
            </Link>
            <div className='flex flex-col items-center justify-center w-full mt-8'>
                <div className='flex flex-col gap-4 w-full max-w-xl'>
                    <h1 className='text-2xl md:text-3xl'>Tiedosto <span className='font-bold text-primary'>{file.fileName}</span> on suojattu salasanalla</h1>
                    <PasswordPrompt validatePassword={validatePassword} />
                </div>
            </div>
        </main>
    )
    
    return (
        <main>
            <FileNav file={file} setFile={setFile} setDeleted={setDeleted} />

            <div className='flex flex-col gap-1'>
                <h1 className='text-xl md:text-3xl'><strong>{file.name}</strong></h1>
                <p className='flex gap-1 items-center text-sm'><User2 size={20} /> {file.user.name}</p>
            </div>

            <FilePreview file={file} setFile={setFile} />

            <div className='grid grid-cols-2 lg:grid-cols-3 items-center gap-2 w-full max-w-full'>
                <button 
                    href={file.url}
                    className='flex items-center justify-center px-4 py-3 group rounded-full 
                    text-white bg-primary text-sm gap-2 hover:bg-primary/85 transition-colors'
                    onClick={() => setLivePreview(true)}
                >
                    <ScanEye />
                    Esikatsele
                </button>

                <DownloadBtn url={file.url} fileName={file.name} buttonStyle="w-full py-3" />

                <button 
                    className='flex items-center justify-center px-4 py-3 group rounded-full 
                    text-white bg-primary text-sm gap-2 hover:bg-primary/85 transition-colors'
                    onClick={handleShare}
                >
                    <Share2 />
                    <span className='flex items-center gap-1'>Jaa suoraan</span>
                </button>
            </div>

            {livePreview && <FileLivePreview file={file} setLivePreview={setLivePreview} />}
        </main>
    )
}

export default Page