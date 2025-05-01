"use client"
import React, { useEffect, useState, use } from 'react';
import { useUser } from '@clerk/nextjs';
import ErrorView from '@/app/(pages)/_components/ErrorView';
import ContentNotFound from '@/app/_components/_common/ContentNotFound';
import PageLoading from '@/app/_components/_common/PageLoading';
import { useNavigation } from '@/app/contexts/NavigationContext';
import { getFolderContent, getFolderShareGroupsInfo } from '@/app/file-requests/folders';
import Breadcrumbs from './_components/BreadGrumps';
import FolderContainer from './_components/FolderContainer';
import FolderNavigation from './_components/FolderNavigation';
import { FilePlus, FolderPlus, Grid, List, LockKeyhole, Settings, Share2, Users2, X } from 'lucide-react';
import { useAlert } from '@/app/contexts/AlertContext';
import FolderInfoContainer from './_components/FolderInfoContainer';
import FolderSettings from './_components/FolderSettings';
import MoveSelectedObjectsPopup from '../../_components/_modals/MoveSelectedObjectsPopup';
import CreateNewFolder from '../../_components/_modals/CreateNewFolderPopup';
import FileRenamePopup from '../../_components/_modals/FileRenamePopup';
import FolderRenamePopup from '../../_components/_modals/FolderRenamePopup';
import FileUploadPopup from '../../_components/_modals/FileUploadPopup';
import FilePasswordPopup from '../../_components/_modals/FilePasswordPopup';
import FolderPasswordPopup from '../../_components/_modals/FolderPasswordPopup';
import DeleteSelectedObjects from '../../_components/_modals/DeleteSelectedObjectsPopup';


function Page({ params }) {
    const { id } = use(params);
    const { user, isLoaded } = useUser();
    const { showAlert } = useAlert();
    const { setCurrentIndex, navigatePage } = useNavigation();
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('grid');
    const [folder, setFolder] = useState(null);
    const [settings, setSettings] = useState(false);
    const [folders, setFolders] = useState(null);
    const [files, setFiles] = useState([]);
    const [shareGroups, setShareGroups] = useState([]);
    const [selectedObjects, setSelectedObjects] = useState([]);
    const [movePopup, setMovePopup] = useState(false);
    const [createFolder, setCreateFolder] = useState(false);
    const [uploadPopup, setUploadPopup] = useState(false);
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
                    setFolder(response.folder);
                    setFolders(response.folders);
                    setFiles(response.files);
    
                    // Fetch share group info
                    if (response.folder.sharing.groups.length > 0) {
                        try {
                            const shareGroupsResponse = await getFolderShareGroupsInfo(response.folder.sharing.groups);
                            if (shareGroupsResponse.success) {
                                setShareGroups(shareGroupsResponse.groups);
                            } else {
                                console.error("Error fetching share groups:", shareGroupsResponse.errors);
                                showAlert(shareGroupsResponse.message || 'Virhe ryhmien jakamistietojen hakemisessa.', 'error');
                            }
                        } catch (error) {
                            console.error("Error fetching folder share groups info:", error);
                            showAlert('Virhe ryhmien jakamistietojen hakemisessa.', 'error');
                        }
                    }
                } else {
                    setDataError(response.message || 'Sisällön h');
                }
            } catch (error) {
                console.error("Error fetching folder data:", error);
                setServerError('Tietojen hakemisessa tapahtui virhe: ' + error);
            } finally {
                setLoading(false);
            }
        };
    
        if (isLoaded && user) {
            setCurrentIndex('/kansiot');
            getFolder();
        } else {
            navigatePage('/sign-in');
        }
    }, [isLoaded, user, id, setCurrentIndex, navigatePage]);


    if (loading) return <PageLoading />
    if (serverError) return <ErrorView message={serverError} />
    if (dataError) return <ContentNotFound message={dataError} />
    if (settings) return (
        <FolderSettings 
            folder={folder} 
            setFolder={setFolder} 
            shareGroups={shareGroups} 
            setShareGroups={setShareGroups}
            settings={settings} 
            setSettings={setSettings} 
        />
    )

    return (
        <main>
            <div className='flex items-center gap-2 justify-between'>
                <Breadcrumbs folder={folder} />
            </div>

            <h1 className='text-3xl md:text-4xl font-black truncate'>{folder.name}</h1> 
            
            <div className='relative flex items-center max-w-full gap-2 justify-between'>   
                <FolderInfoContainer files={files} folder={folder} folders={folders} shareGroups={shareGroups} />

                <button 
                    className={`relative flex items-center flex-wrap hover:text-primary transition-all
                        ${settings ? 'rotate-[0deg]' : 'rotate-[-90deg]'}`} 
                    title='Kansion asetukset'
                    onClick={() => setSettings(!settings)}
                >   
                    <Settings className={settings ? 'text-red-500 hover:text-red-600' : 'text-foreground hover:text-primary'} size={28} />
                </button>
            </div>
            
            <div className='flex'>
                <div className='flex items-center gap-2 w-full justify-between flex-wrap'>
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
            </div>

            {selectedObjects.length > 0 && 
            <FolderNavigation
                folders={folders}
                files={files}
                setFolders={setFolders} 
                setFiles={setFiles}
                setCreateFolder={setCreateFolder}
                setMovePopup={setMovePopup}
                selectedObjects={selectedObjects}
                setSelectedObjects={setSelectedObjects}
                setRenamePopup={setRenamePopup}
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


            {/* POPUPS / MODALS */}
            {movePopup && 
                <MoveSelectedObjectsPopup
                    currentFolder={folder}
                    selectedObjects={selectedObjects} 
                    setSelectedObjects={setSelectedObjects}
                    setFolders={setFolders}
                    setFiles={setFiles} 
                    setMovePopup={setMovePopup} 
                />
            }

            {createFolder && 
                <CreateNewFolder
                    currentFolder={folder}
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
                    currentFolder={folder} 
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