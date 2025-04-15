"use client"
import React, { useEffect, useState, use } from 'react'
import FileInfo from './_components/FileInfo'
import FileNav from './_components/FileNav'
import PageLoading from '@/app/_components/_common/PageLoading'
import { useNavigation } from '@/app/contexts/NavigationContext'
import { useAlert } from '@/app/contexts/AlertContext'
import { useUser } from '@clerk/nextjs'
import DownloadBtn from './_components/DownloadBtn';
import ContentNotFound from '@/app/_components/_common/ContentNotFound'
import { getFilePageInfo } from '@/app/file-requests/files'
import { getPublicFolderInfo } from '@/app/file-requests/folders'
import FilePagePreview from '@/app/_components/_common/FilePagePreview'
import FilePasswordPrompt from './_components/FilePasswordPrompt'

function Page({ params }) {
    const { id } = use(params);
    const { setCurrentIndex, navigatePage } = useNavigation();
    const [file, setFile] = useState(null);
    const [folder, setFolder] = useState(null);
    const [deleted, setDeleted] = useState(false);
    const [fileError, setFileError] = useState(null);
    const [serverError, setServerError] = useState(null);
    const [pwdVerified, setPwdVerified] = useState(true);
    const [loading, setLoading] = useState(true);
    const { user, isLoaded } = useUser();
    const { showAlert } = useAlert();

    useEffect(() => {
        const getFile = async () => {
            try {
                const response = await getFilePageInfo(user.id, id);
                if (response.success) {
                    if (response.password) {
                        setPwdVerified(false);
                        return;
                    }
                    setFile(response.data);
                } else {
                    setFileError(response.message);
                }
            } catch (error) {
                setServerError("Sisäinen virhe - " + error.message)
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

    
    {/* PAGE CONTENT */}
    if (loading) return <PageLoading />
    if (fileError) return <ContentNotFound message={fileError} />
    if (serverError) return <ErrorView message={serverError} />
    if (!pwdVerified) return <FilePasswordPrompt fileID={id} setFile={setFile} setPwdVerified={setPwdVerified} />
    
    return (
        <main>
            <div className='relative w-full flex items-center gap-2 justify-between'>
                <h1 className="text-3xl font-black truncate">{file.name}</h1>

                {isLoaded && user?.id === file.user.id && 
                    <FileNav file={file} setFile={setFile} setDeleted={setDeleted} />
                }
            </div>

            <FilePagePreview file={file} />
            <FileInfo file={file} folder={folder} setFile={setFile} />
            <DownloadBtn url={file.url} fileName={file.name} buttonStyle="mt-2 py-3 md:max-w-[50%]" />
        </main>
    )
}

export default Page