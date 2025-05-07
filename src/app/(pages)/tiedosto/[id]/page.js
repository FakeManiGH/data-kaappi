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
import FilePagePreview from '@/app/_components/_common/FilePagePreview'
import FileSharingPopup from '../../_components/_modals/FileSharingPopup'
import FileRenamePopup from '../../_components/_modals/FileRenamePopup'
import FilePasswordPopup from '../../_components/_modals/FilePasswordPopup'
import MoveSelectedObjectsPopup from '../../_components/_modals/MoveSelectedObjectsPopup'
import FileDeletePopup from '../../_components/_modals/FileDeletePopup'

function Page({ params }) {
    const { id } = use(params);
    const { setCurrentIndex, navigatePage } = useNavigation();
    const [file, setFile] = useState(null);
    const [folder, setFolder] = useState(null);
    const [shareGroups, setShareGroups] = useState(null);
    const [deleted, setDeleted] = useState(false);
    const [fileError, setFileError] = useState(null);
    const [serverError, setServerError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, isLoaded } = useUser();
    const { showAlert } = useAlert();

    // Popup states
    const [renamePopup, setRenamePopup] = useState(false);
    const [movePopup, setMovePopup] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);
    const [sharePopup, setSharePopup] = useState(false);
    const [passwordPopup, setPasswordPopup] = useState(false);

    useEffect(() => {
        const getFile = async () => {
            try {
                const response = await getFilePageInfo(user.id, id);
                if (response.success) {
                    setFile(response.file);
                    setShareGroups(response.shareGroups || null);
                    setFolder(response.folder || null);
                    if (response.error) showAlert(response.error, 'error');
                } else {
                    setFileError(response.message);
                }
            } catch (error) {
                setServerError("Sisäinen virhe: " + error.message)
                console.error("Error fetching file: " + error);
            } finally {
                setLoading(false);
            }
        }

        if (isLoaded && !user) {
            navigatePage('/sign-in');
        } else if (deleted) {
            navigatePage('/kansiot');
        } else {
            setCurrentIndex('/tiedosto/' + id);
            getFile(id);
        }

    }, [id, isLoaded, user, setCurrentIndex, navigatePage, deleted])

    
    {/* PAGE CONTENT */}
    if (loading) return <PageLoading />
    if (fileError) return <ContentNotFound message={fileError} />
    if (serverError) return <ErrorView message={serverError} />
    
    return (
        <>
        <main>
            <h1 className="text-3xl font-black truncate">{file.name}</h1>

            <FileNav 
                setSharePopup={setSharePopup}
                setRenamePopup={setRenamePopup} 
                setMovePopup={setMovePopup} 
                setDeletePopup={setDeletePopup} 
                setPasswordPopup={setPasswordPopup} 
            />
            
            <FilePagePreview file={file} />
            <FileInfo file={file} folder={folder} shareGroups={shareGroups} setFile={setFile} />
            <DownloadBtn url={file.url} fileName={file.name} buttonStyle="mt-2 py-3 md:max-w-[50%]" />
        </main>

        {/* MODALS / POPUPS */}
        {sharePopup &&
            <FileSharingPopup
                selectedFile={file}
                setFile={setFile}
                setSharingPopup={setSharePopup}
            />
        }

        {renamePopup &&
            <FileRenamePopup
                selectedFile={file}
                setFile={setFile}
                setRenamePopup={setRenamePopup}
            />
        }

        {passwordPopup &&
            <FilePasswordPopup
                selectedFile={file}
                setFile={setFile}
                setPasswordPopup={setPasswordPopup}
            />
        }

        {movePopup &&
            <MoveSelectedObjectsPopup
                currentFolder={folder}
                selectedObjects={[file]}
                setFile={setFile}
                setMovePopup={setMovePopup}
            />
        }

        {deletePopup &&
            <FileDeletePopup
                file={file}
                setDeleted={setDeleted}
                setDeletePopup={setDeletePopup}
            />
        }
        </>
    )
}

export default Page