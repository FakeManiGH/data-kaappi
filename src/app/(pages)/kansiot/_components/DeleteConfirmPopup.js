import { X } from 'lucide-react';
import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { deleteFolder } from '@/app/file-requests/folders';
import { deleteFile } from '@/app/file-requests/files';
import { useAlert } from '@/app/contexts/AlertContext';
import PopupLoader from '@/app/_components/_common/PopupLoader';

function DeleteConfirmPopup({ selectedObjects, setSelectedObjects, setFolders, setFiles, setDeleteErrors, setDeletePopup, setDeleteConfirm }) {
    const { user } = useUser();
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(false);

    // Handle deletion
    const handleDeletingObjects = async () => {
        try {
            setLoading(true);
            const failedDeletions = [];
            const deletedFolders = [];
            const deletedFiles = [];
    
            // Helper function for deletion
            const deleteObject = async (object) => {
                if (object.docType === 'folder') {
                    const response = await deleteFolder(user.id, object.id);
                    if (response.success) {
                        deletedFolders.push(object.id);
                    } else {
                        failedDeletions.push({ id: object.id, message: response.message });
                    }
                    return response.success;
                } else if (object.docType === 'file') {
                    const response = await deleteFile(user.id, object.id);
                    if (response.success) {
                        deletedFiles.push(object.id);
                    } else {
                        failedDeletions.push({ id: object.id, message: response.message });
                    }
                    return response.success;
                }
            };
    
            // Process deletions
            await Promise.allSettled(selectedObjects.map((object) => deleteObject(object)));
    
            // Update states
            setFolders((prevFolders) =>
                prevFolders.filter((folder) => !deletedFolders.includes(folder.id))
            );

            setFiles((prevFiles) =>
                prevFiles.filter((file) => !deletedFiles.includes(file.id))
            );
    
            // Update selectedObjects to remove successfully deleted items
            setSelectedObjects((prevObjects) =>
                prevObjects.filter(
                    (object) => !deletedFolders.includes(object.id) && !deletedFiles.includes(object.id)
                )
            );
    
            // Handle failed deletions
            if (failedDeletions.length > 0) {
                setDeleteErrors(failedDeletions.map((error) => error.message));
                setDeleteConfirm(false);
                return;
            }
    
            // Success message
            showAlert('Kaikki kohteet on poistettu onnistuneesti.', 'success');
            setDeletePopup(false);
            setDeleteConfirm(false);
        } catch (error) {
            console.error('Error deleting objects: ', error);
            showAlert('Virhe poistettaessa kohteita. Yritä uudelleen.', 'error');
        } finally {
            setLoading(false);
        }
    };


    if (loading) return <PopupLoader />

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
                        className='text-white bg-red-500 py-2.5 px-3 rounded-lg hover:bg-red-600 '
                    >
                        Kyllä, poista
                    </button>
                    <button 
                        className='text-foreground bg-contrast py-2.5 px-3 rounded-lg '
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