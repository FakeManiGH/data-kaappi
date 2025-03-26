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
        <div className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 px-4 py-2'>
            <div className='relative flex flex-col w-full max-w-xl rounded-xl p-4 mt-2 z-50 bg-gradient-to-br from-contrast to-secondary 
                shadow-lg shadow-black/25 max-h-full border border-contrast overflow-y-auto'
            >
                <h2 className="text-2xl md:text-3xl mb-6 text-center font-bold">Vahvista poistaminen</h2>
                <p className='text-center text-sm'>Haluatko varmasti poistaa valitut kohteet?</p>
                <p className='text-center text-sm'>Poistettuja kohteita ei voi palauttaa.</p>

                <div className='flex items-center justify-center gap-1 mt-4 text-sm'>
                    <button 
                        onClick={handleDeletingObjects} 
                        className='text-white bg-red-500 py-2.5 px-3 rounded-full hover:bg-red-600 shadow-md shadow-black/25'
                    >
                        Kyllä, poista
                    </button>
                    <button 
                        className='text-foreground bg-contrast py-2.5 px-3 rounded-full shadow-md shadow-black/25'
                        onClick={() => setDeleteConfirm(false)}
                    >
                        Peruuta
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmPopup;