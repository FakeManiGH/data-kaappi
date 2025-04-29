import { useAlert } from '@/app/contexts/AlertContext';
import { updateFolderName } from '@/app/file-requests/folders';
import { folderNameRegex } from '@/utils/Regex';
import { useUser } from '@clerk/nextjs';
import { X } from 'lucide-react';
import React, { useState } from 'react'

function FolderRenamePopup({ selectedFolder, setFolders, setRenamePopup, setSelectedObjects }) {
    const [newName, setNewName] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [apiLoading, setApiLoading] = useState(false);
    const { showAlert} = useAlert();
    const { user } = useUser();

    // Input change
    const handleNameChange = (e) => {
        setNewName(e.target.value);
    }

    // File renaming (api)
    const handleFolderRenaming = async (e) => {
        if (apiLoading) {
        showAlert('Ladataan... Odota hetki.', 'info');
        return;
    }

    e.preventDefault();
    setApiLoading(true);
    
    if (!newName || !newName.length || newName === selectedFolder.name) {
        showAlert('Anna kansiolle ensin uusi nimi.', 'info');
        setApiLoading(false);
        return;
    }

    if (!folderNameRegex.test(newName)) {
        setNameError('Kansion nimen tulee olla 2-50 merkkiä pitkä, eikä se saa sisältää <, >, /, \\ -merkkejä.');
        setApiLoading(false);
        return;
    }

    try {
        const response = await updateFolderName(user.id, selectedFolder.id, newName);
        if (response.success) {
            const updatedFolder = {...selectedFolder, name: newName}
            setFolders(prevFolders => prevFolders.map(folder => 
            folder.id === updatedFolder.id ? updatedFolder : folder
            ));
            setRenamePopup(false); 
            setSelectedObjects([]);
            showAlert(response.message || 'Kansion nimi vaihdettu.' , 'success');
        } else {
            showAlert(response.message || 'Kansion uudelleennimeäminen epäonnistui.' , 'error');
        }
    } catch (error) {
        console.error("Error updating file: ", error);
        showAlert('Virhe kansion päivittämisessä.', 'error');
        }
    };

  return (
    <span className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 px-4 py-2'>
        <div className='relative flex flex-col w-full max-w-2xl rounded-xl p-4 z-50 bg-gradient-to-br from-contrast to-secondary 
            shadow-lg shadow-black/25 max-h-full border border-contrast overflow-y-auto'
        >
            <button 
                onClick={() => setRenamePopup(false)} 
                className='absolute top-2 right-2 p-1 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors'
            >
                <X />
            </button>

            <h2 className="text-2xl md:text-3xl mb-2 text-center font-bold">Nimeä uudelleen</h2>
            <p className='text-sm'>Nimeä kansio uudelleen. Nimen tulee olla 2-50 merkkiä pitkä, eikä se saa sisältää &lt;, &gt;, \ ja / -merkkejä.</p>

            <form className="flex flex-col mt-4" onSubmit={handleFolderRenaming}>
                <div>
                <label htmlFor="foldername" className="block text-sm font-bold">Kansion nimi</label>
                <input 
                    type="text" 
                    id="foldername" 
                    name="foldername"
                    defaultValue={selectedFolder.name}
                    onChange={handleNameChange}
                    placeholder='Anna tiedostolle nimi...'
                    className="relative w-full py-2.5 px-3 bg-background text-sm border border-transparent outline-none focus:border-primary focus:ring-1"
                    autoFocus
                />
                </div>

                {nameError && 
                    <div className='flex items-center justify-between gap-4 px-3 py-2.5 mt-2 rounded-lg text-white text-sm bg-red-500'>
                    <p>{nameError}</p>
                    <button onClick={() => setNameError('')}><X size={20} /></button>
                    </div>
                }

                <button 
                    type="submit" 
                    className="w-full mt-2 py-2.5 px-3 rounded-lg bg-primary text-white 
                    text-sm hover:bg-primary/75  transition-colors"
                >
                    Tallenna
                </button>
            </form>
        </div>
    </span>
  )
}

export default FolderRenamePopup