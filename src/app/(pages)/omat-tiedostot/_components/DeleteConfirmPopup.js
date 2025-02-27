import { Trash2, X } from 'lucide-react'
import React, { useEffect } from 'react'

function DeleteConfirmPopup({ selectedFiles, handleDeleteFiles, setDeletePopup }) {

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

    return (
        <div id="overlay" aria-hidden="true" className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="relative flex flex-col justify-between max-w-2xl w-full h-[calc(100%-2rem)] max-h-[calc(100%-2rem)] sm:h-fit bg-background rounded-xl overflow-y-auto m-4">

                <div className="flex items-center justify-between p-3 px-4">
                    <Trash2 size={24} />
                    <h2 className="text-xl font-bold">Poista tiedostoja</h2>
                    <button
                        className="p-1 text-white bg-red-500 hover:bg-red-600 rounded-full"
                        onClick={() => setDeletePopup(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="relative flex flex-col items-center gap-2 p-4">
                    <p>Haluatko varmasti poistaa tiedostot?</p>

                    <ul className="flex flex-col items-center max-h-52 w-full overflow-y-auto list-disc list-inside">
                        {selectedFiles.map((file) => (
                            <li key={file.fileID} className='text-red-600 dark:text-red-500'>{file.fileName}</li>
                        ))}
                    </ul>
                </div>

                <div className="flex items-center justify-center gap-2 p-4">
                    <button 
                        className='block p-2 px-3 bg-red-500 text-white rounded-full hover:bg-red-600 active:bg-red-600'
                        onClick={() => handleDeleteFiles(selectedFiles)}
                    >
                        Kyllä, poista
                    </button>
                    <button 
                        className='block text-navlink hover:text-primary'
                        onClick={() => setDeletePopup(false)}
                    >
                        Peruuta
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirmPopup