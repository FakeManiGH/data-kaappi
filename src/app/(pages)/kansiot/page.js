"use client"
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@/app/contexts/NavigationContext';
import FolderView from './_components/FolderView';
import BreadGrumps from './_components/BreadGrumps';
import CreateFolder from './_components/CreateFolder';
import { FilePlus, FolderPlus } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useAlert } from '@/app/contexts/AlertContext';
import PageLoading from '@/app/_components/_common/PageLoading';
import ErrorView from '../_components/ErrorView';
import OptionsPopup from './_components/OptionsPopup';
import { getUserFilesByFolder } from '@/app/file-requests/files';
import { getUserFolders } from '@/app/file-requests/folders';
import Link from 'next/link';


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
                    const folders = await getUserFolders(user.id, '');
                    const files = await getUserFilesByFolder(user.id, '');
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
            <h1 className="text-3xl"><strong>Kansiot</strong></h1>

            <div className='flex items-center justify-end gap-2'>
                <Link href='/tallenna' className='flex flex-1 sm:flex-none items-center justify-center w-fit gap-2 p-3 text-sm bg-primary text-white hover:bg-primary/75 transition-colors'>
                    <FilePlus />
                    Lisää tiedosto
                </Link>
                <button 
                    onClick={() => setCreateFolder(true)} 
                    className='flex flex-1 sm:flex-none items-center justify-center w-fit gap-2 p-3 text-sm bg-primary text-white hover:bg-primary/75 transition-colors'
                >
                    <FolderPlus />
                    Uusi kansio
                </button>
            </div>
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
            {objectOptions && <OptionsPopup selectedObject={selectedObjects[0]} setFolders={setFolders} setFiles={setFiles} setSelectedObjects={setSelectedObjects} setObjectOptions={setObjectOptions} />}
        </main>
    );
}

export default Page;