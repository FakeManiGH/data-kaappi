import PopupLoader from '@/app/_components/_common/PopupLoader';
import { useAlert } from '@/app/contexts/AlertContext';
import { deleteFile } from '@/app/file-requests/files';
import { useUser } from '@clerk/nextjs';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react'

function FileDeletePopup({ file, setDeleted, setDeletePopup }) {
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [apiLoading, setApiLoading] = useState(false);
    const { user } = useUser();
    const { showAlert } = useAlert();

    const handleFileDeleting = async () => {
        if (apiLoading) {
            showAlert('Ladataan... Odota hetki.', 'info');
            return;
        }

        setApiLoading(true);

        try {
            const response = await deleteFile(user.id, file.id);
            if (response.success) {
                showAlert(response.message || 'Tiedosto poistettu onnistuneesti.', 'success');
                setDeleted(true);
                setDeletePopup(false);
            } else {
                showAlert(response.message || 'Tiedoston poistaminen epäonnistu, yritä uudelleen.', 'error');
            }
        } catch (error) {
            console.error("Error deleting file: " + error.message);
            showAlert('Tiedoston poistaminen epäonnistui, yritä uudelleen.', 'error');
        } finally {
            setApiLoading(false);
        }
    }

    if (apiLoading) return <PopupLoader />

    return (
        <span className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 px-4 py-2'>
        <div className='relative flex flex-col w-full max-w-2xl rounded-xl p-4 z-50 bg-gradient-to-br from-contrast to-secondary 
            shadow-lg shadow-black/25 max-h-full border border-contrast overflow-y-auto'
        >
            <button 
            onClick={() => setDeletePopup(false)} 
            className='absolute top-2 right-2 p-1 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors'
            >
            <X />
            </button>

        {!deleteConfirm ? (
            <>
                <h2 className="text-2xl md:text-3xl text-center font-bold">Poista tiedosto</h2>
                <p className='text-sm text-center mt-2'>
                    Haluatko poistaa tiedoston 
                    <strong className='text-base text-success'> {file.name} </strong>
                    ?
                </p>
            
                <button 
                    onClick={() => setDeleteConfirm(true)} 
                    className='text-white text-sm bg-red-500 mt-4 py-2.5 px-3 rounded-lg hover:bg-red-600 '
                >
                    Poista
                </button>
            </>
        ) : (
            <>
                <h2 className="text-2xl md:text-3xl text-center font-bold">Vahvista poisto</h2>
                <p className='mt-4 text-center text-sm'>Haluatko varmasti poistaa tämän tiedoston?</p>
                <p className='mt-2 text-xs text-orange-500 text-center'>Poistettuja kohteita ei voi palauttaa.</p>

                <div className='flex items-center justify-center gap-1 mt-4 text-sm'>
                    <button 
                        className='px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600'
                        onClick={handleFileDeleting}
                    >
                        Kyllä, poista    
                    </button>
                    <button 
                        className='px-3 py-2 rounded-lg bg-gray-400 dark:bg-gray-600 text-foreground dark:text-white hover:bg-gray-500 dark:hover:bg-gray-700'
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

export default FileDeletePopup