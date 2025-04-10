import { LockKeyhole, X } from 'lucide-react'
import React, { useEffect } from 'react'
import PasswordForm from './PasswordForm'
import { useUser } from '@clerk/nextjs'
import { removeFolderPassword } from '@/app/file-requests/folders';
import { useAlert } from '@/app/contexts/AlertContext';
import { removeFilePassword } from '@/app/file-requests/files';

function PasswordPopup({ selectedObject, setFolders, setFiles, setSelectedObjects, setPasswordPopup }) {
    const { user } = useUser();
    const { showAlert } = useAlert();

    // Remove folder password
    const removePasswordFromFolder = async () => {
        try {
            const response = await removeFolderPassword(user.id, selectedObject.id);
            if (response.success) {
                showAlert(response.message, 'success');
                const updatedFolder = {
                    ...selectedObject,
                    passwordProtected: false
                }
                setFolders(prevFolders => prevFolders.map(folder => 
                    folder.id === updatedFolder.id ? updatedFolder : folder
                ));
                setSelectedObjects([updatedFolder]);
            } else {
                showAlert(response.message, 'error');
            }
        } catch (error) {
            console.error('Error removing password: ' + error);
            showAlert('Virhe kansion salasanan poistamisessa käytöstä, yritä uudelleen.', 'error');
        }
    }

    // Remove file password
    const removePasswordFromFile = async () => {
        try {
            const response = await removeFilePassword(user.id, selectedObject.id);
            if (response.success) {
                showAlert(response.message, 'success');
                const updatedFile = {
                    ...selectedObject,
                    passwordProtected: false
                }
                setFiles(prevFiles => prevFiles.map(file =>
                    file.id === updatedFile.id ? updatedFile : file
                ));
                setSelectedObjects([updatedFile]);
            } else {
                showAlert(response.message, 'error');
            }
        } catch (error) {
            console.error('Error removing password: ' + error);
            showAlert('Virhe tiedoston salasanan poistamisessa käytöstä, yritä uudelleen.', 'error');
        }
    }


    return (
        <span className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 px-4 py-2'>
            <div className='relative flex flex-col w-full max-w-2xl rounded-xl p-4 z-50 bg-gradient-to-br from-contrast to-secondary 
                shadow-lg shadow-black/25 max-h-full border border-contrast overflow-y-auto'
            >
                <button
                    className="absolute top-2 right-2 p-1 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors"
                    onClick={() => setPasswordPopup(false)}
                >
                    <X />
                </button>

                <h2 className="text-2xl md:text-3xl mb-2 text-center font-bold">Salasana</h2>

                {selectedObject.passwordProtected ? (
                    <div className="flex items-center justify-between gap-2 p-2 mb-4 border-b border-dashed border-navlink">
                        <div className='flex items-center gap-1 w-full '>
                            <LockKeyhole className='text-success' size={18} />
                            <p className="text-sm font-bold">Kohde on suojattu salasanalla.</p>
                        </div>

                        <button 
                            onClick={selectedObject.docType === 'folder' ? removePasswordFromFolder : removePasswordFromFile} 
                            className='text-sm font-semibold text-red-500 hover:text-red-600 whitespace-nowrap'
                            title='Poista salasana käytöstä'
                        >
                            Poista
                        </button>
                    </div>
                ) : (
                    <p className='text-sm p-2 mb-4 border-b border-dashed border-navlink font-semibold'>
                        Suojaa kohde <span className='text-primary text-base font-bold'>{selectedObject.name}</span> salasanalla.
                    </p>
                )}

                <ul className='flex flex-col gap-1 list-disc list-inside text-sm'>
                    <li>
                        Suojaa 
                        {selectedObject.docType === 'folder' ? ' kansio ' : ' tiedosto '} 
                        antamalla sille salasana.
                    </li>
                    <li>
                        Kun 
                        {selectedObject.docType === 'folder' ? ' kansio ' : ' tiedosto '} 
                        on suojattu, vain sinä näet sen ilman salasanaa.
                    </li>
                </ul>

                <PasswordForm 
                    selectedObject={selectedObject} 
                    setFolders={setFolders}
                    setFiles={setFiles}
                    setSelectedObjects={setSelectedObjects}
                    setPasswordPopup={setPasswordPopup} 
                />
            </div>
        </span>
    )
}

export default PasswordPopup