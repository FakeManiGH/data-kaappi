"use client"
import React, { useEffect, useState, use } from 'react';
import { useUser } from '@clerk/nextjs';
import ErrorView from '@/app/(pages)/_components/ErrorView';
import ContentNotFound from '@/app/_components/_common/ContentNotFound';
import PageLoading from '@/app/_components/_common/PageLoading';
import { useNavigation } from '@/app/contexts/NavigationContext';
import { getFolderContent } from '@/app/file-requests/folders';
import Breadcrumbs from './_components/BreadGrumps';
import FolderContainer from './_components/FolderContainer';
import FolderNavigation from './_components/FolderNavigation';
import CreateFolder from './_components/CreateFolder';
import RenamePopup from './_components/RenamePopup';
import PasswordPopup from './_components/PasswordPopup';
import DeletePopup from './_components/DeletePopup';
import { FilePlus, Folder, FolderPlus } from 'lucide-react';
import Link from 'next/link';


function Page({ params }) {
    const { id } = use(params);
    const { user, isLoaded } = useUser();
    const { setCurrentIndex, navigatePage } = useNavigation();
    const [loading, setLoading] = useState(true);
    const [pwdVerified, setPwdVerified] = useState(true);
    const [folder, setFolder] = useState(null);
    const [folders, setFolders] = useState(null);
    const [files, setFiles] = useState([]);
    const [selectedObjects, setSelectedObjects] = useState([]);
    const [createFolder, setCreateFolder] = useState(false);
    const [renamePopup, setRenamePopup] = useState(false);
    const [passwordPopup, setPasswordPopup] = useState(false)
    const [deletePopup, setDeletePopup] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [dataError, setDataError] = useState(null);

    useEffect(() => {
        const getFolder = async () => {
            try {
                const response = await getFolderContent(user.id, id);

                if (response.success) {
                    if (response.protected) {
                        setPwdVerified(false);
                        return;
                    }
                    setFolder(response.folder);
                    setFolders(response.folders);
                    setFiles(response.files);
                } else {
                    setDataError(response.message);
                }
            } catch (error) {
                console.error("Error fetching folder data: " + error);
                setServerError('Tietojen hakemisessa tapahti virhe: ' + error);
            } finally {
                setLoading(false);
            }
        };

        if (isLoaded && user) {
            setCurrentIndex('/kansio');
            getFolder();
        } else {
            navigatePage('/sign-in');
        }
    }, [isLoaded, user, id, setCurrentIndex, navigatePage]);

    if (loading) return <PageLoading />;
    if (serverError) return <ErrorView message={serverError} />;
    if (dataError) return <ContentNotFound message={dataError} />;
    if (!pwdVerified) return <div>Folder is password-protected. Please enter the password.</div>;

    return (
        <main>
            <Breadcrumbs folder={folder} />
            <h1 className='font-bold text-2xl md:text-3xl'>{folder.name}</h1>

            <div className='flex items-center gap-1'>
                <Link 
                    href='/tallenna' 
                    className='flex flex-1 sm:flex-none items-center justify-center w-fit gap-2 px-3 py-2 rounded-full text-sm bg-gradient-to-br 
                        from-primary to-blue-800 text-white hover:to-primary transition-colors'
                >
                    <FilePlus />
                    Lisää tiedosto
                </Link>
                <button 
                    onClick={() => setCreateFolder(true)} 
                    className='flex flex-1 sm:flex-none items-center justify-center w-fit gap-2 px-3 py-2 rounded-full text-sm bg-gradient-to-br 
                        from-primary to-blue-800 text-white hover:to-primary transition-colors'
                >
                    <FolderPlus />
                    Uusi kansio
                </button>
            </div>

            {selectedObjects.length > 0 && 
                <FolderNavigation 
                    folders={folders}
                    files={files}
                    setFolders={setFolders} 
                    setFiles={setFiles}
                    setCreateFolder={setCreateFolder}
                    selectedObjects={selectedObjects}
                    setSelectedObjects={setSelectedObjects}
                    setRenamePopup={setRenamePopup}
                    setPasswordPopup={setPasswordPopup}
                    setDeletePopup={setDeletePopup}
                />
            }

            <FolderContainer 
                folders={folders}
                files={files}
                setFolders={setFolders} 
                setFiles={setFiles}
                setCreateFolder={setCreateFolder}
                selectedObjects={selectedObjects}
                setSelectedObjects={setSelectedObjects}
            />

            {createFolder && <CreateFolder folder={folder} folders={folders} setFolders={setFolders} setCreateFolder={setCreateFolder} />}
            {renamePopup && <RenamePopup selectedObject={selectedObjects[0]} setFolders={setFolders} setFiles={setFiles} setSelectedObjects={setSelectedObjects} setRenamePopup={setRenamePopup} />}
            {passwordPopup && <PasswordPopup selectedObject={selectedObjects[0]} setFolders={setFolders} setFiles={setFiles} setSelectedObjects={setSelectedObjects} setPasswordPopup={setPasswordPopup} />}
            {deletePopup && <DeletePopup selectedObjects={selectedObjects} setSelectedObjects={setSelectedObjects} setFolders={setFolders} setFiles={setFiles} setDeletePopup={setDeletePopup} />}
        </main>
    );
}

export default Page;