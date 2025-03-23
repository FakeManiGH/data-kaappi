import { getFileIcon } from '@/utils/GetFileIcon'
import { CircleMinus, SquareMinus, TriangleAlert, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import DeleteConfirmPopup from './DeleteConfirmPopup';

function DeletePopup({ selectedObjects, setSelectedObjects, setFolders, setFiles, setDeletePopup }) {
    const [deleteConfirm, setDeleteConfirm] = useState(false);

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
        <div className='fixed z-50 inset-0 flex justify-center items-start bg-black/50 px-4 py-2'>
            <div className='relative flex flex-col w-full max-w-2xl top-52 p-4 rounded-lg z-50 bg-gradient-to-br from-background to-contrast 
                shadow-md shadow-black/25 max-h-full overflow-y-auto'
            >
                <button 
                    onClick={() => setDeletePopup(false)} 
                    className='absolute top-2 right-2 p-1 rounded-full text-white bg-red-500 hover:bg-red-600 transition-colors'
                >
                    <X />
                </button>

                <h2 className="text-2xl md:text-3xl mb-6 text-center font-bold">Poista kohteet</h2>
                
                <ul className='flex flex-col gap-2 text-sm'>
                    {selectedObjects.map(object => (
                        <li key={object.id} className='relative flex items-center justify-between gap-2 py-1'>
                            <div className='flex items-center gap-2'>
                                {object.docType === 'folder' && object.fileCount > 0 && 
                                    <div className='relative flex items-center group'>
                                        <button><TriangleAlert size={20} className='text-orange-500' /></button>
                                        <p className='absolute scale-x-0 origin-left transition-transform top-[-5px] left-full ml-1 z-50 bg-white text-black whitespace-nowrap p-1 group-hover:scale-x-100'>Kansio sisältää tiedostoja.</p>
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

                <button onClick={() => setDeleteConfirm(true)} className='text-white text-sm bg-red-500 mt-4 py-2.5 px-3 rounded-full hover:bg-red-600'>
                    Poista
                </button>
            </div>

            {deleteConfirm && 
                <DeleteConfirmPopup 
                    selectedObjects={selectedObjects}
                    setSelectedObjects={setSelectedObjects} 
                    setFolders={setFolders} 
                    setFiles={setFiles} 
                    setDeletePopup={setDeletePopup} 
                    setDeleteConfirm={setDeleteConfirm} 
                />
            }
        </div>
    )
}

export default DeletePopup