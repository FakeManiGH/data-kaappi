"use client"
import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { ArrowLeftSquare, ScanEye, User2, Share2, LockKeyholeOpen, ArrowLeftCircle, Eye, UserCircle, UserRoundCheck, Home, CircleGauge } from 'lucide-react'
import FileInfo from './_components/FileInfo'
import FileNav from './_components/FileNav'
import PageLoading from '@/app/_components/_common/PageLoading'
import { useNavigation } from '@/app/contexts/NavigationContext'
import { useAlert } from '@/app/contexts/AlertContext'
import { useUser } from '@clerk/nextjs'
import PasswordPrompt from './_components/PasswordPrompt'
import FileLivePreview from './_components/FileLivePreview';
import DownloadBtn from './_components/DownloadBtn';
import ContentNotFound from '@/app/_components/_common/ContentNotFound'
import { getFilePageInfo } from '@/app/file-requests/files'
import { getPublicFolderInfo } from '@/app/file-requests/folders'
import FilePagePreview from '@/app/_components/_common/FilePagePreview'

function Page({ params }) {
    const { id } = use(params)
    const { setCurrentIndex, navigatePage } = useNavigation()
    const [file, setFile] = useState(null)
    const [folder, setFolder] = useState(null)
    const [deleted, setDeleted] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const { user, isLoaded } = useUser()
    const { showAlert } = useAlert()
    const [isPasswordValid, setIsPasswordValid] = useState(false)
    const [livePreview, setLivePreview] = useState(false)

    useEffect(() => {
        const getFile = async () => {
            try {
                const response = await getFilePageInfo(user.id, id);
                if (response.success) {
                    setFile(response.data);
                } else {
                    setError(response.message);
                }
            } catch (error) {
                setError("Sisäinen virhe - " + error.message)
                console.error("Error fetching file: " + error);
            } finally {
                setLoading(false);
            }
        }

        if (isLoaded && !user) {
            navigatePage('/sign-in');
        } else if (deleted) {
            navigatePage('/kojelauta');
        } else {
            setCurrentIndex('/tiedosto/' + id);
            getFile(id);
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

    
    {/* PAGE CONTENT */}
    if (loading) return <PageLoading />
    if (error) return <ContentNotFound message={error} />
    if (!user) return <ErrorView message="Kirjaudu sisään nähdäksesi tämän sivun." />

    if (file.passwordProtected && file.user.id !== user.id) return (
        <main>
            <div className='flex flex-col items-center justify-center w-full mt-8'>
                <div className='flex flex-col gap-4 w-full max-w-xl'>
                    <h1 className='text-2xl md:text-3xl'>Tiedosto <span className='font-bold text-primary'>{file.fileName}</span> on suojattu salasanalla</h1>
                    <PasswordPrompt validatePassword={validatePassword} />
                    <Link href='/kojelauta' className='text-center text-primary hover:text-primary/75'>Vie minut pois!</Link>
                </div>
            </div>
        </main>
    )
    
    return (
        <main>
            <div className='flex flex-col overflow-hidden'>
                <h1 className='text-2xl md:text-3xl truncate'><strong>{file.name}</strong></h1>
                <p className='flex items-center gap-1 text-md'><UserRoundCheck size={20} /> {file.user.name}</p>
            </div>

            {isLoaded && user?.id === file.user.id && 
                <FileNav file={file} setFile={setFile} setDeleted={setDeleted} />
            }

            <FilePagePreview file={file} />
            <FileInfo file={file} folder={folder} setFile={setFile} setLivePreview={setLivePreview} />
            <DownloadBtn url={file.url} fileName={file.name} buttonStyle="mt-2 py-3 md:max-w-[50%]" />

            {livePreview && <FileLivePreview file={file} setLivePreview={setLivePreview} />}
            {}
        </main>
    )
}

export default Page