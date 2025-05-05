"use client"
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@/app/contexts/NavigationContext';
import FolderContainer from './_components/FolderContainer';
import { FilePlus, FolderPlus, Grid, List } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useAlert } from '@/app/contexts/AlertContext';
import PageLoading from '@/app/_components/_common/PageLoading';
import ErrorView from '../_components/ErrorView';
import { getUserBaseFiles } from '@/app/file-requests/files';
import { getUserBaseFolders } from '@/app/file-requests/folders';
import FolderNavigation from './_components/FolderNavigation';
import CreateNewFolder from '../_components/_modals/CreateNewFolderPopup';
import FileUploadPopup from '../_components/_modals/FileUploadPopup';
import FileRenamePopup from '../_components/_modals/FileRenamePopup';
import FolderRenamePopup from '../_components/_modals/FolderRenamePopup';
import FilePasswordPopup from '../_components/_modals/FilePasswordPopup';
import FolderPasswordPopup from '../_components/_modals/FolderPasswordPopup';
import MoveSelectedObjectsPopup from '../_components/_modals/MoveSelectedObjectsPopup';
import DeleteSelectedObjects from '../_components/_modals/DeleteSelectedObjectsPopup';
import FileSharingPopup from '../_components/_modals/FileSharingPopup';


function Page() {
    const { setCurrentIndex, navigatePage } = useNavigation();
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [selectedObjects, setSelectedObjects] = useState([]);
    const [createFolder, setCreateFolder] = useState(false);
    const [renamePopup, setRenamePopup] = useState(false);
    const [passwordPopup, setPasswordPopup] = useState(false);
    const [sharePopup, setSharePopup] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);
    const [movePopup, setMovePopup] = useState(false);
    const [uploadPopup, setUploadPopup] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState(null);
    const [view, setView] = useState('grid');
    const { user, isLoaded } = useUser();
    const { showAlert } = useAlert();


    useEffect(() => {
        const fetchPageData = async () => {
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
                    setPageError('Tietojen hakemisessa tapahtui virhe: ' + error.message);
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
        fetchPageData();
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
                    setSharePopup={setSharePopup}
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


            {/* POPUPS / MODALS */}
            {movePopup && 
                <MoveSelectedObjectsPopup
                    selectedObjects={selectedObjects} 
                    setSelectedObjects={setSelectedObjects}
                    setFolders={setFolders}
                    setFiles={setFiles} 
                    setMovePopup={setMovePopup} 
                />
            }

            {createFolder && 
                <CreateNewFolder 
                    folders={folders} 
                    setFolders={setFolders} 
                    setNewFolderPopup={setCreateFolder} 
                />
            }

            {renamePopup && (
                selectedObjects[0].docType === 'file' ? (
                    <FileRenamePopup
                        selectedFile={selectedObjects[0]}
                        setFiles={setFiles}
                        setSelectedObjects={setSelectedObjects}
                        setRenamePopup={setRenamePopup}
                    />
                ) : (
                    <FolderRenamePopup
                        selectedFolder={selectedObjects[0]}
                        setFolders={setFolders}
                        setSelectedObjects={setSelectedObjects}
                        setRenamePopup={setRenamePopup}
                    />
                )
            )}

            {uploadPopup && 
                <FileUploadPopup 
                    setFiles={setFiles} 
                    currentFolder={null} 
                    setUploadPopup={setUploadPopup} 
                />
            }

            {passwordPopup && (
                selectedObjects[0].docType === 'file' ? (
                    <FilePasswordPopup
                        selectedFile={selectedObjects[0]}
                        setFiles={setFiles}
                        setSelectedObjects={setSelectedObjects}
                        setPasswordPopup={setPasswordPopup}
                    />
                ) : (
                    <FolderPasswordPopup
                        selectedFolder={selectedObjects[0]}
                        setFolders={setFolders}
                        setSelectedObjects={setSelectedObjects}
                        setPasswordPopup={setPasswordPopup}
                    />
                )
            )}

            {sharePopup && (
                selectedObjects[0].docType === 'file' ? (
                    <FileSharingPopup
                        selectedFile={selectedObjects[0]}
                        setFiles={setFiles}
                        setSelectedObjects={setSelectedObjects}
                        setSharingPopup={setSharePopup}
                    />
                ) : (
                    null
                )
            )}
            
            {deletePopup && 
                <DeleteSelectedObjects 
                    selectedObjects={selectedObjects} 
                    setSelectedObjects={setSelectedObjects} 
                    setFolders={setFolders} 
                    setFiles={setFiles} 
                    setDeletePopup={setDeletePopup} 
                />
            }
        </main>
    );
}

export default Page;