import { ChevronRight, Trash2 } from 'lucide-react'
import React from 'react'

function DeleteConfirmPopup({ selectedFiles, handleDeleteFiles, setDeletePopup }) {

    return (
        <div id="overlay" onClick={() => setDeletePopup(false)} tabIndex="-1" aria-hidden="true" className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center py-3">
            <div className="relative flex flex-col max-w-lg max-h-full w-full m-4 bg-background rounded-xl overflow-auto">
                <div className="flex items-center justify-between p-3 px-4">
                    <h2 className="text-2xl font-bold">Poista tiedostot</h2>
                    <Trash2 size={24} className='text-red-500' />
                </div>

                <div className="relative flex flex-col items-center gap-2 p-4">
                    <p>Haluatko varmasti poistaa tiedostot?</p>

                    <div className="flex flex-col max-h-52 w-full overflow-y-scroll">
                        {selectedFiles.map((file) => (
                            <p key={file.fileID} className='flex items-center gap-1'><ChevronRight size={20} /> <span key={file.fileID} className='text-red-600 dark:text-red-500'>{file.fileName}</span></p>
                        ))}
                    </div>
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
                        onClick={() => handleDeleteFiles(selectedFiles)}
                    >
                        Kyllä, poista
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirmPopup