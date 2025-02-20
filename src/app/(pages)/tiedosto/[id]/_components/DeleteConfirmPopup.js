import { Trash2, X } from 'lucide-react'
import { deleteFile } from '@/app/file-requests/api'
import { useNavigation } from '@/app/contexts/NavigationContext'
import { useAlert } from '@/app/contexts/AlertContext'
import React, { useEffect } from 'react'

function DeleteConfirmPopup({ file, setDeletePopup }) {
    const { navigatePage } = useNavigation()
    const { showAlert } = useAlert()

    useEffect(() => {
        const handleClick = (e) => {
            let overlay = document.getElementById('overlay')
            if (e.target === overlay) {
                setDeletePopup(false)
            }
        }

        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [])

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
        <div id="overlay" tabIndex="-1" aria-hidden="true" className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="relative flex flex-col justify-between max-w-2xl w-full h-[calc(100%-2rem)] max-h-[calc(100%-2rem)] sm:h-fit bg-background rounded-xl overflow-y-auto m-4">

                <div className="flex items-center justify-between p-3 px-4">
                    <Trash2 size={24} />
                    <h2 className="text-xl font-bold">Poista tiedosto</h2>
                    <button
                        className="p-1 text-white bg-red-500 hover:bg-red-600 rounded-full"
                        onClick={() => setDeletePopup(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-col items-center gap-2 p-4">
                    <p>Haluatko varmasti poistaa tiedoston?</p>
                    <p className='text-red-600 dark:text-red-500'>
                        {file.fileName}
                    </p>
                </div>

                <div className="flex items-center justify-center gap-2 p-4">
                    <button 
                        className='block p-2 px-3 bg-secondary text-white rounded-full hover:bg-secondary/90'
                        onClick={() => setDeletePopup(false)}
                    >
                        Peruuta
                    </button>
                    <button 
                        className='block p-2 px-3 bg-red-500 text-white rounded-full hover:bg-red-600 active:bg-red-600'
                        onClick={handleFileDelete}
                    >
                        Kyllä, poista
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirmPopup