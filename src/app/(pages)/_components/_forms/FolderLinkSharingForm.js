import CopyClipboard from '@/app/_components/_common/CopyClipboard';
import SimpleLoading from '@/app/_components/_common/SimpleLoading';
import { useAlert } from '@/app/contexts/AlertContext';
import { changeFolderLinkSharing } from '@/app/file-requests/folders';
import { useUser } from '@clerk/nextjs';
import React, { useState } from 'react'

function FolderLinkSharingForm({ folder, setFolder, setFolders, setSelectedObjects }) {
    const [apiLoading, setApiLoading] = useState(false);
    const [linkSharing, setLinkSharing] = useState(folder.sharing.link);
    const { user } = useUser();
    const { showAlert } = useAlert();

    // Link sharing
    const handleLinkSharing = async (e) => {
        if (apiLoading) {
            showAlert('Ladataan... Odota hetki.', 'info');
            return;
        }

        e.preventDefault();
        setApiLoading(true);

        try {
            const newShareValue = e.target.checked;
            const response = await changeFolderLinkSharing(user.id, folder.id, newShareValue);
            if (response.success) {
                if (newShareValue === true) showAlert('Kansion jakaminen linkillä otettu käyttöön.', 'info');
                else showAlert('Kansion jakaminen linkillä poistettu käytöstä.', 'info');

                // Client updates
                setLinkSharing(newShareValue); 
                const updatedFolder = {
                    ...folder,
                    sharing: {
                        ...folder.sharing,
                        link: newShareValue
                    }
                }
                setFolders(prevFolders => prevFolders.map(f => f.id === folder.id ? updatedFolder : f));
                setSelectedObjects(prevObjs => prevObjs.map(obj => obj.id === folder.id ? updatedFolder : obj));
            } else {
                showAlert(response.message, 'error');
            }
        } catch (error) {
            console.error("Error changing folder link sharing: " + error);
            showAlert('Kansion linkillä jakamisen muutokset epäonnistuivat, yritä uudelleen.', 'error');
        } finally {
            setApiLoading(false);
        }
    };

    return (
        <div className='flex flex-col gap-2 mt-2 p-2 bg-gradient-to-r from-contrast to-neutral-400 dark:to-neutral-700 rounded-lg'>
            <h3 className='text-lg font-semibold mt-2'>Jaa linkillä</h3>

            {apiLoading ? (
                <SimpleLoading />
            ) : (
                <>
                <label className='flex items-center cursor-pointer w-fit'>
                    <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={linkSharing}
                        onChange={handleLinkSharing} 
                    />
                    <div className="relative w-11 h-6 bg-gray-400 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                        dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full 
                        rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                        after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                        dark:border-gray-600 peer-checked:bg-primary"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        { linkSharing ? 'Jaettu' : 'Ei jaettu' }
                    </span>
                </label>

                {linkSharing && (
                    <>
                        <CopyClipboard content={folder.sharing.url} />

                        <p className='text-xs text-orange-500'>
                            <strong>Huom!</strong> Osoite on julkinen ja kaikki osoitteen tietävät pääsevät näkemään kansion sisällön. 
                            Jaa linkkiä harkiten ja aseta tarvittaessa salasana.
                        </p>
                    </>
                )}
                </>
            )}
        </div>
    )
}

export default FolderLinkSharingForm