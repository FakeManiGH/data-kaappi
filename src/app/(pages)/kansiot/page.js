"use client"
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@/app/contexts/NavigationContext';
import FolderView from './_components/FolderView';
import BreadGrumps from './_components/BreadGrumps';
import CreateFolder from './_components/CreateFolder';
import { FolderPlus } from 'lucide-react';

const exampleFolders = [
    { id: 1, name: 'Documents', fileCount: 10 },
    { id: 2, name: 'Pictures', fileCount: 25 },
    { id: 3, name: 'Music', fileCount: 15 },
    { id: 4, name: 'Videos', fileCount: 5 },
    { id: 5, name: 'Projects', fileCount: 8 },
    { id: 6, name: 'Downloads', fileCount: 20 },
];

function Page() {
    const { setCurrentIndex } = useNavigation();
    const [folders, setFolders] = useState(exampleFolders);
    const [createFolder, setCreateFolder] = useState(false);

    useEffect(() => {
        setCurrentIndex('/kansiot');

        return () => {
            setCurrentIndex('');
        };
    }, [setCurrentIndex]);

    return (
        <main>
            <div className='flex items-center justify-between gap-4'>
                <h1 className="text-2xl md:text-3xl"><strong>Kansiot</strong></h1>
                <button 
                    onClick={() => setCreateFolder(true)} 
                    className='flex gap-2 items-center rounded-full border border-navlink px-4 py-3 text-sm text-navlink shadow-md 
                    hover:border-primary hover:text-foreground hover:shadow-sm transition-all'
                >
                    <FolderPlus size={20} className='text-primary' />
                    Uusi kansio
                </button>
            </div>
            <BreadGrumps />
            <FolderView folders={folders} setFolders={setFolders} setCreateFolder={setCreateFolder} />
            {createFolder && <CreateFolder setCreateFolder={setCreateFolder} />}
        </main>
    );
}

export default Page;