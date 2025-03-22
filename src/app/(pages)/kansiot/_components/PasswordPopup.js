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

    useEffect(() => {
        // close popup when clicked outside
        const handleClick = (e) => {
            let overlay = document.getElementById('overlay');
            if (e.target === overlay) {
                setPasswordPopup(false);
            }
        }

        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [])

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
            showAlert(response.message, 'error');
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
            showAlert(response.message, 'error');
        }
    }


    return (
        <span className='fixed z-50 inset-0 flex justify-center items-start bg-black/50 px-4 py-2'>
            <div className='relative flex flex-col w-full max-w-2xl top-52 p-4 z-50 bg-gradient-to-br from-background to-contrast 
                shadow-md max-h-full overflow-y-auto border border-contrast'>
                <button
                    className="absolute top-2 right-2 p-2 text-white bg-red-500 hover:bg-red-600 transition-colors"
                    onClick={() => setPasswordPopup(false)}
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl md:text-3xl mb-2 text-center font-bold">Salasana</h2>

                {selectedObject.passwordProtected ? (
                    <>
                    <div className="flex items-center justify-between gap-2 py-2 mb-2 border-b border-dashed border-contrast">
                        <div className='flex items-center gap-2 w-full '>
                            <LockKeyhole className='text-success' size={20} />
                            <p className="text-sm">
                                {selectedObject.docType === 'folder' ? 'Kansio ' : 'Tiedosto'} 
                                on suojattu salasanalla.
                            </p>
                        </div>

                        <button 
                            onClick={selectedObject.docType === 'folder' ? removePasswordFromFolder : removePasswordFromFile} 
                            className='text-sm text-red-500 hover:text-red-600 whitespace-nowrap'
                        >
                            Poista käytöstä
                        </button>
                    </div>

                    
                    </>
                ) : null}

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