import SimpleLoading from '@/app/_components/_common/SimpleLoading';
import { useAlert } from '@/app/contexts/AlertContext';
import { updateFolderName } from '@/app/file-requests/folders';
import { folderNameRegex } from '@/utils/Regex';
import { useUser } from '@clerk/nextjs';
import { X } from 'lucide-react';
import React, { useState } from 'react'

function FolderRenameForm({ selectedFolder, setFolder, setFolders, setSelectedObjects }) {
    const [apiLoading, setApiLoading] = useState(false);
    const [nameError, setNameError] = useState(null);
    const { user } = useUser();
    const { showAlert } = useAlert();

    // Save password API-call
    const handleFolderRenaming = async (e) => {
        if (apiLoading) {
            showAlert('Ladataan... odota hetki.', 'info');
            return;
        }

        e.preventDefault();
        setApiLoading(true);
        const newName = e.target.folderName.value;

        if (!newName || newName === folder.name) {
            showAlert('Anna kansiolle ensin uusi nimi.', 'info');
            setApiLoading(false);
            return;
        }

        if (!folderNameRegex.test(newName)) {
            setNameError('Kansion nimen tulee olla 2-50 merkkiä, eikä saa sisältää <, >, /, \\ -merkkejä.');
            setApiLoading(false);
            return;
        }

        try {
            const response = await updateFolderName(user.id, selectedFolder.id, newName);
    
            if (response.success) {
                setFolder({ ...folder, name: newName })
                showAlert(response.message, 'success');
            } else {
                showAlert(response.message, 'error');
            }
        } catch (error) {
            console.error("Error updating folder name: ", error);
            showAlert('Kansion nimen päivittämisessä tapahtui virhe.', 'error');
        } finally {
            setApiLoading(false);
        }
    }

    return (
        <section className='flex flex-col gap-2'>
            {apiLoading ? (
                <SimpleLoading />
            ) : (
            <>
            <h3 className='font-bold text-lg'>Nimi</h3>
            <p className='text-sm'>Muuta kansion nimeä. Nimen tulee olla 2-50 merkkiä pitkä ja se ei saa sisältää &lt;, &gt;, / tai \ merkkiä.</p>

            <form className='flex flex-col gap-2 text-sm' onSubmit={handleFolderRenaming}>
                <label htmlFor='folderName' className='sr-only'></label>
                <input
                    id='folderName'
                    name='folderName'
                    defaultValue={selectedFolder.name || ''}
                    className='relative w-full py-2 px-3 rounded-md bg-contrast text-sm border border-transparent 
                        outline-none focus:border-primary focus:ring-1'
                    placeholder='Anna kansiolle nimi...'
                />

                {nameError && 
                    <div className='flex items-center justify-between gap-2 px-3 py-2 rounded-md text-white text-sm bg-red-500'>
                        <p>{nameError}</p>
                        <button onClick={() => setNameError('')}><X size={20} /></button>
                    </div>
                }

                <button
                    type='submit'
                    className='w-fit py-2 px-3 rounded-lg text-white bg-primary hover:bg-primary/75 transition-colors'
                >
                    Tallenna nimi
                </button>
            </form>
            </>
            )}
        </section>
    )
}

export default FolderRenameForm
