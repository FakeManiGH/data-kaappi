import { getFileIcon } from '@/utils/GetFileIcon'
import { CircleMinus, SquareMinus, TriangleAlert, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import DeleteConfirmPopup from './DeleteConfirmPopup';

function DeletePopup({ selectedObjects, setSelectedObjects, setFolders, setFiles, setDeletePopup }) {
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteErrors, setDeleteErrors] = useState([]);

    useEffect(() => {
        if (selectedObjects.length === 0) {
            setDeletePopup(false);
        }
    }), []

    const removeObjectSelection = (object) => {
        setSelectedObjects((prevSelectedObjects) => 
            prevSelectedObjects.filter((selectedObject) => selectedObject.id !== object.id)
        );
    };

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

                <h2 className="text-2xl md:text-3xl mb-2 text-center font-bold">Poista kohteet</h2>
                
                <ul className='flex flex-col gap-2 text-sm'>
                    {selectedObjects.map(object => (
                        <li key={object.id} className='relative flex items-center justify-between gap-2 py-1'>
                            <div className='flex items-center gap-2'>
                                {object.docType === 'folder' && object.fileCount > 0 && 
                                    <div className='relative flex items-center group'>
                                        <button><TriangleAlert size={20} className='text-orange-500' /></button>
                                        <p 
                                            className='absolute scale-x-0 origin-left transition-transform top-[-5px] left-full ml-1 z-50 rounded-md bg-white 
                                            text-black whitespace-nowrap p-1 group-hover:scale-x-100'
                                        >
                                            Kansio sisältää tiedostoja.
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
                                            Kansio on jaettu ryhmässä.
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

                {/* Delete errors */}
                {deleteErrors?.map((error, index) => (
                    <div key={index} className='flex items-center gap-2 px-3 py-2 mt-2 rounded-lg justify-between text-sm text-white bg-red-500'>
                        <p>{error}</p>
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
            </div>

            {deleteConfirm && 
                <DeleteConfirmPopup 
                    selectedObjects={selectedObjects}
                    setSelectedObjects={setSelectedObjects} 
                    setFolders={setFolders} 
                    setFiles={setFiles}
                    setDeleteErrors={setDeleteErrors} 
                    setDeletePopup={setDeletePopup} 
                    setDeleteConfirm={setDeleteConfirm} 
                />
            }
        </div>
    )
}

export default DeletePopup