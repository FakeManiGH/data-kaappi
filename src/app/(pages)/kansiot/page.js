"use client"
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@/app/contexts/NavigationContext';
import FolderView from './_components/FolderView';
import BreadGrumps from './_components/BreadGrumps';
import CreateFolder from './_components/CreateFolder';
import { FolderPlus } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useAlert } from '@/app/contexts/AlertContext';
import PageLoading from '@/app/_components/_common/PageLoading';
import ErrorView from '../_components/ErrorView';
import OptionsPopup from './_components/OptionsPopup';
import { getUserRogueFiles } from '@/app/file-requests/files';
import { getUserFolders } from '@/app/file-requests/folders';


function Page() {
    const { setCurrentIndex, navigatePage } = useNavigation();
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [selectedObjects, setSelectedObjects] = useState([]);
    const [createFolder, setCreateFolder] = useState(false);
    const [objectOptions, setObjectOptions] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState(null);
    const { user, isLoaded } = useUser();
    const { showAlert } = useAlert();

    useEffect(() => {
        const fetchFolders = async () => {
            if (isLoaded && user) {
                try {
                    const folders = await getUserFolders(user.id);
                    const files = await getUserRogueFiles(user.id);
                    setFiles(files);
                    setFolders(folders);
                } catch (error) {
                    setPageError('Palvelinvirhe! Yritä uudelleen.');
                    showAlert('Palvelinvirhe! Yritä uudelleen.', 'error');
                } finally {
                    setLoading(false);
                }
            } else if (isLoaded && !user) {
                navigatePage('/sign-in');
            }
        };

        setCurrentIndex('/kansiot');
        fetchFolders();

        return () => {
            setCurrentIndex('');
        };
    }, [isLoaded, user, setCurrentIndex, navigatePage ]);

    if (loading) return <PageLoading />;
    if (pageError) return <ErrorView message={pageError} />;

    return (
        <main>
            <div className='flex items-center justify-between gap-4'>
                <h1 className="text-2xl md:text-3xl"><strong>Kansiot</strong></h1>
                <button 
                    onClick={() => setCreateFolder(true)} 
                    className='flex items-center w-fit gap-2 p-3 text-sm bg-primary text-white hover:bg-primary/75 transition-colors'
                >
                    <FolderPlus />
                    Uusi kansio
                </button>
            </div>
            <BreadGrumps />
            <FolderView 
                folders={folders}
                files={files}
                setFolders={setFolders} 
                setFiles={setFiles}
                setCreateFolder={setCreateFolder}
                selectedObjects={selectedObjects}
                setSelectedObjects={setSelectedObjects}
                setObjectOptions={setObjectOptions}
            />
            {createFolder && <CreateFolder folders={folders} setFolders={setFolders} setCreateFolder={setCreateFolder} />}
            {objectOptions && <OptionsPopup selectedObject={selectedObjects[0]} setFolders={setFolders} setFiles={setFiles} setObjectOptions={setObjectOptions} />}
        </main>
    );
}

export default Page;