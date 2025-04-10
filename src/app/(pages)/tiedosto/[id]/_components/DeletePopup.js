import { X } from 'lucide-react'
import { deleteFile } from '@/app/file-requests/files'
import { useNavigation } from '@/app/contexts/NavigationContext'
import { useAlert } from '@/app/contexts/AlertContext'
import { useUser } from '@clerk/nextjs'
import React from 'react'

function DeletePopup({ file, setDeletePopup, setDeleted }) {
    const { navigatePage } = useNavigation();
    const { showAlert } = useAlert();
    const { user } = useUser();

    // Delete file
    const handleFileDelete = async () => {
        try {
            const response = await deleteFile(user.id, file.id);

            if (response.success) {
                showAlert(response.message, 'success');
                setDeleted(true);
                setDeletePopup(false);
            } else {
                showAlert(response.message, 'error');
            }
        } catch (error) {
            console.error("Error deleting file: ", error)
            showAlert('Tiedoston poistaminen epäonnistui.', 'error')
        }
    }

    return (
        <span className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 px-4 py-2'>
            <div className='relative flex flex-col w-full max-w-xl rounded-xl p-4 z-50 bg-gradient-to-br from-contrast to-secondary 
                shadow-lg shadow-black/25 max-h-full border border-contrast overflow-y-auto'
            >
                <button 
                    onClick={() => setDeletePopup(false)} 
                    className='absolute top-2 right-2 p-1 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors'
                >
                    <X />
                </button>

                <h2 className="text-2xl md:text-3xl mb-4 text-center font-bold">Poista tiedosto</h2>
                <p className='text-sm text-center'>Haluatko varmasti poistaa tiedoston <strong className='text-base'>{file.name}</strong>?</p>

                <div className='flex items-center justify-center gap-1 mt-4'>
                    <button 
                        className='px-3 py-2 rounded-lg text-sm text-white bg-red-500 hover:bg-red-600'
                        onClick={handleFileDelete}
                    >
                        Kyllä, poista
                    </button>
                    <button 
                        className='px-3 py-2 rounded-lg text-sm text-white bg-gray-500 hover:bg-gray-600'
                        onClick={() => setDeletePopup(false)}
                    >
                        Peruuta
                    </button>
                </div>
            </div>
        </span>
    )
}

export default DeletePopup