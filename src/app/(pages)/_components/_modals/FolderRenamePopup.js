import { useAlert } from '@/app/contexts/AlertContext';
import { updateFolderName } from '@/app/file-requests/folders';
import { folderNameRegex } from '@/utils/Regex';
import { useUser } from '@clerk/nextjs';
import { X } from 'lucide-react';
import React, { useState } from 'react'
import FolderRenameForm from '../_forms/FolderRenameForm';

function FolderRenamePopup({ selectedFolder, setFolders, setRenamePopup, setSelectedObjects }) {
    const [newName, setNewName] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [apiLoading, setApiLoading] = useState(false);
    const { showAlert} = useAlert();
    const { user } = useUser();

    

    return (
    <span className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 px-4 py-2'>
        <div className='relative flex flex-col w-full max-w-2xl  p-4 z-50 bg-background
            shadow-lg shadow-black/25 max-h-full overflow-y-auto'
        >
            <button 
                onClick={() => setRenamePopup(false)} 
                className='absolute top-2 right-2 p-1  text-white bg-red-500 hover:bg-red-600 transition-colors'
            >
                <X />
            </button>

            <h2 className="text-2xl md:text-3xl mb-2 text-center font-bold">Kansion nimi</h2>

            <FolderRenameForm 
                selectedFolder={selectedFolder} 
                setFolders={setFolders} 
                setSelectedObjects={setSelectedObjects} 
                setRenamePopup={setRenamePopup} 
            />
        </div>
    </span>
    )
}

export default FolderRenamePopup