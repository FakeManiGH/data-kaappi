"use client"
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@/app/contexts/NavigationContext';
import FolderContainer from './_components/FolderContainer';
import CreateFolder from './_components/CreateFolder';
import { FilePlus, FolderPlus, Grid, List } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useAlert } from '@/app/contexts/AlertContext';
import PageLoading from '@/app/_components/_common/PageLoading';
import ErrorView from '../_components/ErrorView';
import { getUserBaseFiles } from '@/app/file-requests/files';
import { getUserBaseFolders } from '@/app/file-requests/folders';
import Link from 'next/link';
import RenamePopup from './_components/RenamePopup';
import PasswordPopup from './_components/PasswordPopup';
import FolderNavigation from './_components/FolderNavigation';
import DeletePopup from './_components/DeletePopup';
import MoveSelectedPopup from './_components/MoveSelectedPopup';
import UploadFilesPopup from './_components/UploadFilesPopup';


function Page() {
    const { setCurrentIndex, navigatePage } = useNavigation();
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [selectedObjects, setSelectedObjects] = useState([]);
    const [createFolder, setCreateFolder] = useState(false);
    const [renamePopup, setRenamePopup] = useState(false);
    const [passwordPopup, setPasswordPopup] = useState(false)
    const [deletePopup, setDeletePopup] = useState(false);
    const [movePopup, setMovePopup] = useState(false);
    const [uploadPopup, setUploadPopup] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState(null);
    const [view, setView] = useState('grid');
    const { user, isLoaded } = useUser();
    const { showAlert } = useAlert();


    useEffect(() => {
        const fetchFolders = async () => {
            if (isLoaded && user) {
                try {
                    const [foldersResponse, filesResponse] = await Promise.all([
                        getUserBaseFolders(user.id),
                        getUserBaseFiles(user.id),
                    ]);
    
                    if (foldersResponse.success) {
                        setFolders(foldersResponse.folders);
                    } else {
                        throw new Error(foldersResponse.message || 'Virhe kansioiden hakemisessa.');
                    }
    
                    if (filesResponse.success) {
                        setFiles(filesResponse.files);
                    } else {
                        throw new Error(filesResponse.message || 'Virhe tiedostojen hakemisessa.');
                    }
                } catch (error) {
                    setPageError('Palvelinvirhe! Yritä uudelleen.');
                    showAlert(error.message || 'Palvelinvirhe! Yritä uudelleen.', 'error');
                } finally {
                    setLoading(false);
                }
            } else if (isLoaded && !user) {
                setLoading(false);
                navigatePage('/sign-in');
            }
        };
    
        setCurrentIndex('/kansiot');
        fetchFolders();
    
        return () => {
            setCurrentIndex('');
        };
    }, [isLoaded, user, setCurrentIndex, navigatePage]);


    if (loading) return <PageLoading />;
    if (pageError) return <ErrorView message={pageError} />;

    return (
        <main>
            <div className='flex items-end min-h-72 bg-[url(/images/folders_hero.png)] bg-center bg-contain rounded-lg overflow-hidden'>
                <div className='flex flex-col gap-2 px-6 py-4 w-full bg-black/50 text-white'>
                    <h1 className="text-3xl font-black truncate">Kansiot</h1>
                    <p className='text-sm'>Luo kansioita ja lisää tiedostoja.</p>
                </div>
            </div>

            <div className='flex items-center justify-between gap-1 flex-wrap'>
                <nav className='flex items-center gap-1'>
                    <button 
                        onClick={() => setUploadPopup(true)}
                        className='flex flex-1 sm:flex-none items-center justify-center w-fit whitespace-nowrap gap-2 px-3 py-2 rounded-lg text-sm text-white bg-primary 
                            hover:bg-primary/75  transition-colors'
                    >
                        <FilePlus />
                        Lisää tiedostoja
                    </button>
                    <button 
                        onClick={() => setCreateFolder(true)} 
                        className='flex flex-1 sm:flex-none items-center justify-center w-fit whitespace-nowrap gap-2 px-3 py-2 rounded-lg text-sm text-white bg-primary 
                            hover:bg-primary/75  transition-colors'
                    >
                        <FolderPlus />
                        Uusi kansio
                    </button>
                </nav>

                <nav className='flex items-center gap-1'>
                    <button 
                        title='Ruudukko' 
                        className={`p-2 rounded-lg  hover:bg-primary hover:text-white transition-colors
                            ${view === 'grid' ? 'bg-primary text-white' : 'text-foreground bg-transparent'}` } 
                        onClick={() => setView('grid')}>
                            <Grid />
                    </button>
                    <button 
                        title='Lista' 
                        className={`p-2 rounded-lg  hover:bg-primary hover:text-white transition-colors
                            ${view === 'list' ? 'bg-primary text-white' : 'text-foreground bg-transparent'}` } 
                        onClick={() => setView('list')}>
                            <List />
                    </button>
                </nav>
            </div>

            {selectedObjects.length > 0 && 
                <FolderNavigation 
                    files={files}
                    folders={folders}
                    setFolders={setFolders} 
                    setFiles={setFiles}
                    setCreateFolder={setCreateFolder}
                    selectedObjects={selectedObjects}
                    setSelectedObjects={setSelectedObjects}
                    setRenamePopup={setRenamePopup}
                    setMovePopup={setMovePopup}
                    setPasswordPopup={setPasswordPopup}
                    setDeletePopup={setDeletePopup}
                />
            }

            <FolderContainer 
                view={view}
                folders={folders}
                files={files}
                setFolders={setFolders} 
                setFiles={setFiles}
                setCreateFolder={setCreateFolder}
                selectedObjects={selectedObjects}
                setSelectedObjects={setSelectedObjects}
            />

            {movePopup && 
                <MoveSelectedPopup 
                    selectedObjects={selectedObjects} 
                    setSelectedObjects={setSelectedObjects}
                    setFolders={setFolders}
                    setFiles={setFiles} 
                    setMovePopup={setMovePopup} 
                />
            }

            {createFolder && <CreateFolder folders={folders} setFolders={setFolders} setCreateFolder={setCreateFolder} />}
            {uploadPopup && <UploadFilesPopup files={files} setFiles={setFiles} setUploadPopup={setUploadPopup} />}
            {renamePopup && <RenamePopup selectedObject={selectedObjects[0]} setFolders={setFolders} setFiles={setFiles} setSelectedObjects={setSelectedObjects} setRenamePopup={setRenamePopup} />}
            {passwordPopup && <PasswordPopup selectedObject={selectedObjects[0]} setFolders={setFolders} setFiles={setFiles} setSelectedObjects={setSelectedObjects} setPasswordPopup={setPasswordPopup} />}
            {deletePopup && <DeletePopup selectedObjects={selectedObjects} setSelectedObjects={setSelectedObjects} setFolders={setFolders} setFiles={setFiles} setDeletePopup={setDeletePopup} />}
        </main>
    );
}

export default Page;