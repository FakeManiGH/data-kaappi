import { X, } from 'lucide-react'
import React from 'react';
import LocalUploadForm from '../_forms/LocalUploadForm';

function FileUploadPopup({ setFiles, currentFolder, setUploadPopup }) {

    return (
        <span className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 px-4 py-2'>
            <div className='relative flex flex-col w-full max-w-3xl rounded-xl p-4 z-50 bg-gradient-to-br from-contrast to-secondary 
                shadow-lg shadow-black/25 max-h-full border border-contrast overflow-y-auto'
            >
                <button 
                    onClick={() => setUploadPopup(false)} 
                    className='absolute top-2 right-2 p-1 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors'
                >
                    <X />
                </button>

                <h2 className="text-2xl md:text-3xl mb-2 text-center font-bold">Tallenna tiedostoja</h2>
                <p className='text-sm'>Lisää tiedostoja kaappiisi.</p>
                
                <LocalUploadForm setFiles={setFiles} currentFolder={currentFolder} setUploadPopup={setUploadPopup} />
            </div>
        </span>
    )
}

export default FileUploadPopup