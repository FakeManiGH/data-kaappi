import PopupLoader from '@/app/_components/_common/PopupLoader';
import { useAlert } from '@/app/contexts/AlertContext';
import { deleteFolder } from '@/app/file-requests/folders';
import { useUser } from '@clerk/nextjs';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react'

function FolderDeletePopup({ folder, setDeleted, setDeletePopup }) {
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [apiLoading, setApiLoading] = useState(false);
    const { user } = useUser();
    const { showAlert } = useAlert();

    const handleFolderDeleting = async () => {
        if (apiLoading) {
            showAlert('Ladataan... odota hetki.', 'info');
            return;
        }

        setApiLoading(true);

        try {
            const response = await deleteFolder(user.id, file.id);
            if (response.success) {
                showAlert(response.message || 'Kansio poistettu onnistuneesti.', 'success');
                setDeleted(true);
                setDeletePopup(false);
            } else {
                showAlert(response.message || 'Kansion poistaminen epäonnistu, yritä uudelleen.', 'error');
            }
        } catch (error) {
            console.error("Error deleting file: " + error.message);
            showAlert('Kansion poistaminen epäonnistui, yritä uudelleen.', 'error');
        } finally {
            setApiLoading(false);
        }
    }

    if (apiLoading) return <PopupLoader />

    return (
        <span className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 px-4 py-2'>
        <div className='relative flex flex-col w-full max-w-2xl  p-4 z-50 bg-background
            shadow-lg shadow-black/25 max-h-full overflow-y-auto'
        >
            <button 
            onClick={() => setDeletePopup(false)} 
            className='absolute top-2 right-2 p-1  text-white bg-red-500 hover:bg-red-600 transition-colors'
            >
            <X />
            </button>

        {!deleteConfirm ? (
            <>
                <h2 className="text-2xl md:text-3xl text-center font-bold">Poista kansio</h2>
                
                <p className='text-sm text-center mt-2'>
                    Haluatko poistaa kansion
                    <strong className='text-base text-success'> {folder.name} </strong>
                    ja sen sisällön?
                </p>
            
                <button 
                    onClick={() => setDeleteConfirm(true)} 
                    className='text-white text-sm bg-red-500 mt-4 py-2 px-3 w-fit  hover:bg-red-600 m-auto'
                >
                    Poista kansio
                </button>
            </>
        ) : (
            <>
                <h2 className="text-2xl md:text-3xl text-center font-bold">Vahvista poisto</h2>
                <p className='mt-4 text-center text-sm'>Haluatko varmasti poistaa kansion?</p>
                <p className='mt-2 text-xs text-orange-500 text-center'>Kansiota tai sen sisältöä ei voi palauttaa poiston jälkeen.</p>

                <div className='flex items-center justify-center gap-1 mt-4 text-sm'>
                    <button 
                        className='px-3 py-2  bg-red-500 text-white hover:bg-red-600'
                        onClick={handleFolderDeleting}
                    >
                        Kyllä, poista    
                    </button>
                    <button 
                        className='px-3 py-2  bg-gray-400 dark:bg-gray-600 text-foreground dark:text-white hover:bg-gray-500 dark:hover:bg-gray-700'
                        onClick={() => setDeleteConfirm(false)}
                    >
                        Peruuta
                    </button>
                </div>
            </>
        )}
        </div>
        </span>
    )
}

export default FolderDeletePopup