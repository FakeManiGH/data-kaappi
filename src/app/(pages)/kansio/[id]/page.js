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
import { ArrowBigLeft, ArrowBigLeftDash, ArrowLeft, FilePlus, Folder, FolderPlus, Pen, Settings } from 'lucide-react';
import Link from 'next/link';
import MoveSelectedPopup from './_components/MoveSelectedPopup';
import FolderSettingsPage from './_components/FolderSettingsPage';


function Page({ params }) {
    const { id } = use(params);
    const { user, isLoaded } = useUser();
    const { setCurrentIndex, navigatePage } = useNavigation();
    const [loading, setLoading] = useState(true);
    const [pwdVerified, setPwdVerified] = useState(true);
    const [folder, setFolder] = useState(null);
    const [folderSettings, setFolderSettings] = useState(false);
    const [newFolderName, setNewFolderName] = useState(null);
    const [folders, setFolders] = useState(null);
    const [files, setFiles] = useState([]);
    const [selectedObjects, setSelectedObjects] = useState([]);
    const [movePopup, setMovePopup] = useState(false);
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


    const assignNewFolderName = (e) => {
        setNewFolderName(e.target.value);
    }


    if (loading) return <PageLoading />;
    if (serverError) return <ErrorView message={serverError} />;
    if (dataError) return <ContentNotFound message={dataError} />;
    if (!pwdVerified) return <div>Folder is password-protected. Please enter the password.</div>;

    return (
        <main>
            <Breadcrumbs folder={folder} />
            <div className='flex items-center max-w-full gap-2 justify-between'>
                {folderSettings ? (
                    <div className='relative overflow-hidden max-w-full group'>
                    <input 
                        defaultValue={folder.name} 
                        onChange={assignNewFolderName} 
                        placeholder='Anna kansiolle nimi...'
                        className='font-bold text-2xl max-w-full md:text-4xl w-fit border-b border-contrast bg-transparent outline-none focus:border-primary group-hover:border-primary' 
                    />
                    <Pen size={18} className='absolute right-0 bottom-1 text-contrast group-hover:text-primary group-focus-within:text-primary'/>
                    </div>
                ) : (
                    <h1 className='font-bold text-3xl md:text-4xl truncate'>{folder.name}</h1>
                )}
                
                <button 
                    className={`relative flex items-center p-2 hover:text-primary transition-all
                        ${folderSettings ? 'rotate-[-90deg]' : 'rotate-0'}`} 
                    title='Kansion asetukset'
                    onClick={() => setFolderSettings(!folderSettings)}
                >   
                    <ArrowBigLeftDash className='absolute left-[-10px]' />
                    <Settings size={28} />
                </button>
            </div>

            {folderSettings ? (
                <FolderSettingsPage folder={folder} setFolder={setFolder} folderSettings={folderSettings} setFolderSettings={setFolderSettings} />
            ) : (
                <>
                <div className='flex items-center gap-1'>
                    <Link 
                        href='/tallenna' 
                        className='flex flex-1 sm:flex-none items-center justify-center w-fit gap-2 px-3 py-2 rounded-full text-sm bg-gradient-to-br 
                            from-primary to-blue-800 text-white hover:to-primary shadow-md shadow-black/25 transition-colors'
                    >
                        <FilePlus />
                        Lisää tiedosto
                    </Link>
                    <button 
                        onClick={() => setCreateFolder(true)} 
                        className='flex flex-1 sm:flex-none items-center justify-center w-fit gap-2 px-3 py-2 rounded-full text-sm bg-gradient-to-br 
                            from-primary to-blue-800 text-white hover:to-primary shadow-md shadow-black/25 transition-colors'
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
                        setMovePopup={setMovePopup}
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
            {renamePopup && <RenamePopup selectedObject={selectedObjects[0]} setFolders={setFolders} setFiles={setFiles} setSelectedObjects={setSelectedObjects} setRenamePopup={setRenamePopup} />}
            {passwordPopup && <PasswordPopup selectedObject={selectedObjects[0]} setFolders={setFolders} setFiles={setFiles} setSelectedObjects={setSelectedObjects} setPasswordPopup={setPasswordPopup} />}
            {deletePopup && <DeletePopup selectedObjects={selectedObjects} setSelectedObjects={setSelectedObjects} setFolders={setFolders} setFiles={setFiles} setDeletePopup={setDeletePopup} />}
        </main>
    );
}

export default Page;