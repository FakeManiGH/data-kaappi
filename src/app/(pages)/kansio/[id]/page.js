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
import { FilePlus, FolderPlus, Grid, List, LockKeyhole, Settings, Share2, Users2, X } from 'lucide-react';
import MoveSelectedPopup from './_components/MoveSelectedPopup';
import FolderSettingsPage from './_components/FolderSettingsPage';
import { folderNameRegex } from '@/utils/Regex';
import { updateFolderName } from '@/app/file-requests/folders';
import { useAlert } from '@/app/contexts/AlertContext';
import UploadFilesPopup from './_components/UploadFilesPopup';


function Page({ params }) {
    const { id } = use(params);
    const { user, isLoaded } = useUser();
    const { showAlert } = useAlert();
    const { setCurrentIndex, navigatePage } = useNavigation();
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('grid');
    const [pwdVerified, setPwdVerified] = useState(true);
    const [folder, setFolder] = useState(null);
    const [folderSettings, setFolderSettings] = useState(false);
    const [newFolderName, setNewFolderName] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [folders, setFolders] = useState(null);
    const [files, setFiles] = useState([]);
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
            setCurrentIndex('/kansiot');
            getFolder();
        } else {
            navigatePage('/sign-in');
        }
    }, [isLoaded, user, id, setCurrentIndex, navigatePage]);

    // Folder name change
    const assignNewFolderName = (e) => {
        if (e.target.value === folder.name) {
            setNewFolderName(null);
        } else {
            setNewFolderName(e.target.value);
        }
    }

    // Handle renaming
    const handleFolderRenaming = async () => {
        setLoading(true);
        const newName = newFolderName;

        if (!newName) {
            setNameError('Anna kansiolle ensin nimi.');
        }

        if (!folderNameRegex.test(newName)) {
            setNameError('Kansion nimen tulee olla 2-50 merkkiä, eikä saa sisältää <, >, /, \\ -merkkejä.');
        }

        try {
            const response = await updateFolderName(user.id, folder.id, newFolderName);
    
            if (response.success) {
                setFolder({ ...folder, name: newName })
                showAlert(response.message, 'success');
            } else {
                showAlert(response.message, 'error');
            }
        } catch (error) {
            console.error("Error updating folder name: ", error);
            showAlert('Kansion nimen päivittämisessä tapahtui virhe.', 'error');
        } finally {
            setLoading(false);
        }
    }


    if (loading) return <PageLoading />;
    if (serverError) return <ErrorView message={serverError} />;
    if (dataError) return <ContentNotFound message={dataError} />;
    if (!pwdVerified) return <div>Folder is password-protected. Please enter the password.</div>;

    return (
        <main>
            <div className='flex items-center gap-2 justify-between'>
                <Breadcrumbs folder={folder} />
            </div>
            
            <div className='flex items-center max-w-full gap-2 justify-between'>   
            {folderSettings ? (
                <div className='flex flex-col w-full'>
                    <div className='flex items-center gap-2 flex-nowrap'>
                        <input 
                            defaultValue={folder.name} 
                            onChange={assignNewFolderName} 
                            placeholder='Anna kansiolle nimi...'
                            className='w-full font-bold text-3xl md:text-4xl border-b border-contrast bg-transparent outline-none focus:border-primary hover:border-primary' 
                        />
                        {newFolderName &&
                            <button
                                className='text-sm px-3 py-2 rounded-full text-white bg-primary hover:bg-primary/75'
                                onClick={handleFolderRenaming}
                            >
                                Tallenna
                            </button>
                        }
                    </div>

                    {nameError && 
                        <div className='flex items-center justify-between gap-4 px-3 py-2.5 mt-2 rounded-lg text-white text-sm bg-red-500'>
                            <p>{nameError}</p>
                            <button onClick={() => setNameError('')}><X size={20} /></button>
                        </div>
                    }
                </div>
            ) : (
                <h1 className='font-bold text-3xl md:text-4xl truncate'>{folder.name}</h1> 
            )}
                <button 
                    className={`relative flex items-center flex-wrap hover:text-primary transition-all
                        ${folderSettings ? 'rotate-[-90deg]' : 'rotate-0'}`} 
                    title='Kansion asetukset'
                    onClick={() => setFolderSettings(!folderSettings)}
                >   
                    <Settings className={folderSettings ? 'text-red-500 hover:text-red-600' : 'text-primary hover:text-primary/75'} size={28} />
                </button>
            </div>
            {folderSettings ? (
                <FolderSettingsPage folder={folder} setFolder={setFolder} folderSettings={folderSettings} setFolderSettings={setFolderSettings} />
            ) : (
                <>
                <ul className='flex items-center gap-x-4 gap-y-1 flex-wrap text-sm text-gray-600 dark:text-gray-400'>
                    <li className='flex gap-2 flex-nowrap whitespace-nowrap'>
                        <Share2 size={18} />
                        <p>Jaettu linkillä:</p>
                        {folder.sharing.link ? 'Kyllä' : 'Ei'}
                    </li>

                    <li className='flex gap-2'>
                        <Users2 size={18} />
                        <p>Jaettu rymässä:</p>
                        {folder.sharing.groups.length > 0 ?
                            folder.sharing.groups.map(group => (
                                <p key={group.id}>{group.name}</p>
                        )) : (
                            <p>Ei</p>
                        )}  
                    </li>

                    <li className='flex gap-2'>
                        <LockKeyhole size={18} />
                        <p>Salasana:</p>
                        {folder.passwordProtected ? 'Kyllä' : 'Ei'}
                    </li>
                </ul>

                <div className='flex items-center gap-2 justify-between flex-wrap'>
                    <nav className='flex items-center gap-1'>
                        <button 
                            onClick={() => setUploadPopup(true)} 
                            className='flex flex-1 sm:flex-none items-center justify-center w-fit whitespace-nowrap gap-2 px-3 py-2 rounded-full text-sm text-white bg-primary
                                hover:bg-primary/75  transition-colors'
                        >
                            <FilePlus />
                            Lisää tiedostoja
                        </button>
                        <button 
                            onClick={() => setCreateFolder(true)} 
                            className='flex flex-1 sm:flex-none items-center justify-center w-fit whitespace-nowrap gap-2 px-3 py-2 rounded-full text-sm text-white bg-primary
                                hover:bg-primary/75  transition-colors'
                        >
                            <FolderPlus />
                            Uusi kansio
                        </button>
                    </nav>

                    <nav className='flex items-center gap-1'>
                        <button 
                            title='Ruudukko' 
                            className={`p-2 rounded-full  hover:bg-primary hover:text-white transition-colors
                                ${view === 'grid' ? 'bg-primary text-white' : 'text-foreground bg-transparent'}` } 
                            onClick={() => setView('grid')}>
                                <Grid />
                        </button>
                        <button 
                            title='Lista' 
                            className={`p-2 rounded-full  hover:bg-primary hover:text-white transition-colors
                                ${view === 'list' ? 'bg-primary text-white' : 'text-foreground bg-transparent'}` } 
                            onClick={() => setView('list')}>
                                <List />
                        </button>    
                    </nav> 
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
                </>
            )}

            {movePopup && 
                <MoveSelectedPopup 
                    selectedObjects={selectedObjects} 
                    setSelectedObjects={setSelectedObjects}
                    setFolders={setFolders}
                    setFiles={setFiles} 
                    setMovePopup={setMovePopup} 
                />
            }
            {createFolder && <CreateFolder folder={folder} setFolder={setFolder} folders={folders} setFolders={setFolders} setCreateFolder={setCreateFolder} />}
            {uploadPopup && <UploadFilesPopup currentFolder={folder} files={files} setFiles={setFiles} setUploadPopup={setUploadPopup} />}
            {renamePopup && <RenamePopup selectedObject={selectedObjects[0]} setFolders={setFolders} setFiles={setFiles} setSelectedObjects={setSelectedObjects} setRenamePopup={setRenamePopup} />}
            {passwordPopup && <PasswordPopup selectedObject={selectedObjects[0]} setFolders={setFolders} setFiles={setFiles} setSelectedObjects={setSelectedObjects} setPasswordPopup={setPasswordPopup} />}
            {deletePopup && <DeletePopup selectedObjects={selectedObjects} setSelectedObjects={setSelectedObjects} setFolders={setFolders} setFiles={setFiles} setDeletePopup={setDeletePopup} />}
        </main>
    );
}

export default Page;