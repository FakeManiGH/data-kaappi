import React from 'react'
import FilePasswordForm from '../_forms/FilePasswordForm';
import { useUser } from '@clerk/nextjs';
import { useAlert } from '@/app/contexts/AlertContext';
import { Trash2, X } from 'lucide-react';
import { removeFilePassword } from '@/app/file-requests/files';
import { removeFolderPassword } from '@/app/file-requests/folders';
import FolderPasswordForm from '../_forms/FolderPasswordForm';

function FolderPasswordPopup({ selectedFolder, setFolders, setSelectedObjects, setPasswordPopup }) {
  
    return (
        <span className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 px-4 py-2'>
            <div className='relative flex flex-col w-full max-w-2xl  p-4 z-50 bg-background
                shadow-lg shadow-black/25 max-h-full overflow-y-auto'
            >
                <button
                    className="absolute top-2 right-2 p-1  text-white bg-red-500 hover:bg-red-600 transition-colors"
                    onClick={() => setPasswordPopup(false)}
                >
                    <X />
                </button>

                <h2 className="text-2xl md:text-3xl mb-2 text-center font-bold">Salasana</h2>

                <FolderPasswordForm 
                    selectedFolder={selectedFolder}
                    setFolders={setFolders}
                    setSelectedObjects={setSelectedObjects}
                    setPasswordPopup={setPasswordPopup}
                />
            </div>
        </span>
    )
}

export default FolderPasswordPopup