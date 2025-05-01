import PopupLoader from '@/app/_components/_common/PopupLoader';
import { useAlert } from '@/app/contexts/AlertContext';
import { deleteFile } from '@/app/file-requests/files';
import { deleteFolder } from '@/app/file-requests/folders';
import { getFileIcon } from '@/utils/GetFileIcon'
import { useUser } from '@clerk/nextjs';
import { CircleMinus, SquareMinus, TriangleAlert, Users2, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function DeleteSelectedObjects({ selectedObjects, setSelectedObjects, setFolders, setFiles, setDeletePopup }) {
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteErrors, setDeleteErrors] = useState([]);
    const [apiLoading, setApiLoading] = useState(false);
    const { user } = useUser();
    const { showAlert } = useAlert();

    useEffect(() => {
        if (selectedObjects.length === 0) {
            setDeletePopup(false);
        }
    }), [selectedObjects, setDeletePopup];

    const removeObjectSelection = (object) => {
        setSelectedObjects((prevSelectedObjects) => 
            prevSelectedObjects.filter((selectedObject) => selectedObject.id !== object.id)
        );
    };

     // Handle deletion
    const handleDeletingObjects = async () => {
        if (apiLoading) {
            showAlert('Ladataan... Odota hetki.', 'info');
            return;
        }

        try {
            setApiLoading(true);
            const failed = [];
            const deleted = [];
    
            const deletePromises = selectedObjects.map(async (object) => {
                if (object.docType === 'folder') {
                    const response = await deleteFolder(user.id, object.id);
                    if (!response.success) {
                        failed.push({ id: object.id, name: object.name, error: response.message });
                    } else {
                        deleted.push(object);
                    }
                } else if (object.docType === 'file') {
                    const response = await deleteFile(user.id, object.id);
                    if (!response.success) {
                        failed.push({ id: object.id, name: object.name, error: response.message});
                    } else {
                        deleted.push(object);
                    }
                } else {
                    failed.push({ id: object.id, name: object.name, error: 'Kohdetta ei pystytty määrittelemään.' })
                }
            });
    
            // wait for the process to finish
            await Promise.all(deletePromises);
    
            // Update folders
            setFolders((prevFolders) =>
                prevFolders.filter((folder) => !deleted.some((obj) => obj.id === folder.id))
            );
  
            // Update files
            setFiles((prevFiles) =>
                prevFiles.filter((file) => !deleted.some((obj) => obj.id === file.id))
            );
    
            // Update selectedObjects to remove successfully deleted items
            setSelectedObjects((prevObjects) =>
                prevObjects.filter(
                    (object) => !deleted.includes(object.id) && !deleted.includes(object.id)
                )
            );
    
            // Failed deletions?
            if (failed.length > 0) {
                setDeleteErrors(failed);
                showAlert('Joitakin kohteita ei voitu poistaa.', 'error');
                setDeleteConfirm(false);
            } else {
                showAlert('Kaikki kohteet on poistettu onnistuneesti.', 'success');
                setSelectedObjects([]);
                setDeleteConfirm(false);
                setDeletePopup(false);
            }
            
        } catch (error) {
            console.error('Error deleting objects: ', error);
            showAlert('Virhe poistettaessa kohteita. Yritä uudelleen.', 'error');
        } finally {
            setApiLoading(false);
        }
    };

    if (apiLoading) return <PopupLoader />

    return (
        <div className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 px-4 py-2'>
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
                <h2 className="text-2xl md:text-3xl text-center font-bold">Poista kohteet</h2>
                <ul className='flex flex-col gap-2 text-sm mt-4 max-h-[600px] overflow-y-auto'>
                    {selectedObjects.map(object => (
                        <li key={object.id} className='relative flex items-center justify-between gap-2 py-1'>
                            <div className='flex items-center gap-1'>
                                {object.docType === 'folder' && object.fileCount > 0 && 
                                    <div className='relative flex items-center group'>
                                        <button><TriangleAlert size={20} className='text-orange-500' /></button>
                                        <p 
                                            className='absolute scale-x-0 origin-left transition-transform top-[-5px] left-full ml-1 z-50 rounded-md bg-white 
                                            text-black whitespace-nowrap p-1 group-hover:scale-x-100'
                                        >
                                            Kansiossa on sisältöä.
                                        </p>
                                    </div>
                                }
                                {object.docType === 'folder' && object.sharing.groups.length > 0 && 
                                    <div className='relative flex items-center group'>
                                        <button><Users2 size={20} className='text-orange-500' /></button>
                                        <p 
                                            className='absolute scale-x-0 origin-left transition-transform top-[-5px] left-full ml-1 z-50 rounded-md bg-white 
                                            text-black whitespace-nowrap p-1 group-hover:scale-x-100'
                                        >
                                            Kansio on ryhmä-jaettu.
                                        </p>
                                    </div>
                                }
                                <img src={object.docType === 'folder' ? '/icons/folder.png' : getFileIcon(object.type)} alt='Kansio tai tiedosto' className="w-7 h-auto" />
                                <p className='truncate'>{object.name}</p>
                                {object.docType === 'folder' && <span className='text-navlink'>({object.fileCount} tiedostoa)</span>}
                            </div>

                            <button 
                                title='Poista valinta' 
                                className='text-navlink hover:text-foreground'
                                onClick={() => removeObjectSelection(object)}
                            >
                                <CircleMinus size={20} />
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Errors */}
                {deleteErrors?.map((error, index) => (
                    <div key={index} className='flex items-center gap-2 px-3 py-2 mt-2 rounded-lg justify-between text-sm text-white bg-red-500'>
                        <div className='flex gap-2 flex-wrap'>
                            <p>{error.name}</p>
                            <p>{error.error}</p>
                        </div>
                        
                        <button onClick={() => setDeleteErrors((prevErrors) => prevErrors.filter((_, i) => i !== index))}>
                            <X />
                        </button> 
                    </div>
                ))}

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
                <p className='mt-4 text-center'>Haluatko varmasti poistaa kaikki valitut kohteet?</p>
                <p className='mt-2 text-xs text-orange-500 text-center'>Poistettuja kohteita ei voi palauttaa.</p>

                <div className='flex items-center justify-center gap-1 mt-4'>
                    <button 
                        className='px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600'
                        onClick={handleDeletingObjects}
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
        </div>
    )
}

export default DeleteSelectedObjects