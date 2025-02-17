import { Trash2, X } from 'lucide-react'
import { deleteFile } from '@/api/api'
import { useNavigation } from '@/app/contexts/NavigationContext'
import { useAlert } from '@/app/contexts/AlertContext'
import React from 'react'

function DeleteConfirmPopup({ file, setDeletePopup }) {
    const { navigatePage } = useNavigation()
    const { showAlert } = useAlert()

    const handleFileDelete = async () => {
        try {
            await deleteFile(file)
            showAlert('Tiedosto poistettu onnistuneesti.', 'success')
            setDeletePopup(false)
            navigatePage('/omat-tiedostot')
        } catch (error) {
            console.error("Error deleting file: ", error)
            showAlert('Tiedoston poistaminen epäonnistui.', 'error')
        }
    }

    return (
        <div id="overlay" onClick={() => setDeletePopup(false)} tabIndex="-1" aria-hidden="true" className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="relative w-full max-w-lg mx-4 bg-background shadow-black/25 shadow-lg rounded-xl">
                <div className="relative flex flex-col w-full bg-background rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between p-3 px-4">
                        <h2 className="text-2xl font-bold">Poista tiedosto</h2>
                        <Trash2 size={24} className='text-red-500' />
                    </div>

                    <div className="flex flex-col items-center gap-2 p-4">
                        <p>Haluatko varmasti poistaa tiedoston?</p>
                        <p className='font-bold text-lg text-primary'>{file.fileName}</p>
                    </div>

                    <div className="flex items-center justify-center gap-2 p-4">
                        <button 
                            className='block p-2 px-3 bg-secondary text-white rounded-full hover:bg-secondary/90'
                            onClick={() => setDeletePopup(false)}
                        >
                            Peruuta
                        </button>
                        <button 
                            className='block p-2 px-3 bg-red-600 dark:bg-red-500 text-white rounded-full hover:bg-red-700 active:bg-red-700'
                            onClick={handleFileDelete}
                        >
                            Kyllä, poista
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirmPopup