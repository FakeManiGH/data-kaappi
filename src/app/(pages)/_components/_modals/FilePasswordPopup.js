import React from 'react'
import FilePasswordForm from '../_forms/FilePasswordForm';
import { useUser } from '@clerk/nextjs';
import { useAlert } from '@/app/contexts/AlertContext';
import { Trash2, X } from 'lucide-react';
import { removeFilePassword } from '@/app/file-requests/files';

function FilePasswordPopup({ selectedFile, setFiles, setSelectedObjects, setPasswordPopup }) {
    const { user } = useUser();
    const { showAlert } = useAlert();

    // Remove password (API)
    const handlePasswordRemoving = async () => {
        try {
            const response = await removeFilePassword(user.id, selectedFile.id);
            if (response.success) {
                showAlert(response.message, 'success');
                const updatedFile = {
                    ...selectedFile,
                    passwordProtected: false
                }
                setFiles(prevFiles => prevFiles.map(file =>
                    file.id === updatedFile.id ? updatedFile : file
                ));
                setSelectedObjects([updatedFile]);
            } else {
                showAlert(response.message || 'Salasanan poistaminen käytöstä epäonnistui.', 'error');
            }
        } catch (error) {
            console.error('Error removing password: ' + error);
            showAlert('Salasanan poistaminen käytöstä epäonnistui, yritä uudelleen.', 'error');
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

                {selectedFile.passwordProtected ? (
                    <div className="flex items-center justify-between gap-2 p-4 rounded-lg bg-contrast border border-gray-400 dark:border-gray-600 shadow-md">
                        <div className='flex items-center gap-2 w-full'>
                            <p className='text-sm'>Tiedosto <strong>{selectedFile.name}</strong> on suojattu salasanalla.</p>
                        </div>

                        <button 
                            onClick={handlePasswordRemoving} 
                            className='flex items-center gap-1 px-2 text-sm text-red-500 hover:text-red-600'
                            title='Poista salasana käytöstä'
                        >
                            Poista käytöstä
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between gap-2 p-4 mb-4 rounded-lg bg-contrast border border-gray-400 dark:border-gray-600 shadow-md">
                        <p className='text-sm'>Suojaa tiedosto <strong>{selectedFile.name}</strong> salasanalla.</p>
                    </div>
                )}

                <ul className='flex flex-col gap-1 list-disc list-inside text-sm mt-4'>
                    <li>Vain tiedoston omistaja näkee tiedoston ilman salasanaa.</li>
                    <li>Salasanan tulee olla vähintään 4 merkkiä pitkä, eikä se saa sisältää &lt;, &gt;, /, \ -merkkejä.</li>
                </ul>

                <FilePasswordForm 
                    selectedFile={selectedFile}
                    setFiles={setFiles}
                    setSelectedObjects={setSelectedObjects}
                    setPasswordPopup={setPasswordPopup}
                />
            </div>
        </span>
    )
}

export default FilePasswordPopup