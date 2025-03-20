import { X } from 'lucide-react';
import React from 'react';
import { useUser } from '@clerk/nextjs';
import { deleteFolder } from '@/app/file-requests/folders';
import { deleteFile } from '@/app/file-requests/files';
import { useAlert } from '@/app/contexts/AlertContext';

function DeleteConfirmPopup({ selectedObjects, setSelectedObjects, setFolders, setFiles, setDeletePopup, setDeleteConfirm }) {
    const { user } = useUser();
    const { showAlert } = useAlert();

    const handleDeletingObjects = async () => {
        try {
            const failedDeletions = [];
    
            const deletionPromises = selectedObjects.map(async (object) => {
                let response;
    
                if (object.docType === 'folder') {
                    response = await deleteFolder(user.id, object.id);
                    if (response.success) {
                        setFolders((prevFolders) => prevFolders.filter((folder) => folder.id !== object.id));
                    }
                } else if (object.docType === 'file') {
                    response = await deleteFile(user.id, object.id);
                    if (response.success) {
                        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== object.id));
                    }
                }
    
                // Track failed deletions
                if (!response.success) {
                    failedDeletions.push(object.name);
                }
            });
    
            // Wait for all deletions
            await Promise.all(deletionPromises);
    
            // Handle failed deletions
            if (failedDeletions.length > 0) {
                showAlert(
                    `Virhe poistettaessa seuraavia kohteita: ${failedDeletions.join(', ')}`,
                    'error'
                );
                return;
            }
    
            showAlert('Kaikki valitut kohteet on poistettu onnistuneesti.', 'success');
            setSelectedObjects([]);
            setDeleteConfirm(false); 
            setDeletePopup(false); 
        } catch (error) {
            console.error('Error deleting objects: ', error);
            showAlert('Virhe poistettaessa kohteita. Yritä uudelleen.', 'error');
        }
    };

    return (
        <div className='fixed z-50 inset-0 flex justify-center items-start bg-black/50 px-4 py-2'>
            <div className='relative flex flex-col w-full max-w-xl mt-2 top-52 p-4 z-50 text-sm bg-gradient-to-br from-background to-contrast 
                shadow-md max-h-full overflow-y-auto border border-contrast'
            >
                <button 
                    onClick={() => setDeleteConfirm(false)} 
                    className='absolute top-2 right-2 p-1 text-lg text-white bg-red-500 hover:bg-red-600 transition-colors'
                >
                    <X />
                </button>

                <h2 className="text-2xl md:text-3xl mb-6 text-center font-bold">Vahvista poistaminen</h2>
                <p className='text-center text-base'>Haluatko varmasti poistaa valitut kohteet?</p>
                <p className='text-center text-base'>Poistettuja kohteita ei voi palauttaa.</p>

                <button 
                    onClick={handleDeletingObjects} 
                    className='text-white bg-red-500 mt-4 py-2.5 px-3 hover:bg-red-600'
                >
                    Kyllä, poista
                </button>
            </div>
        </div>
    );
}

export default DeleteConfirmPopup;