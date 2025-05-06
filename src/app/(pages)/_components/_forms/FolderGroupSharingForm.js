import SimpleLoading from '@/app/_components/_common/SimpleLoading';
import { useAlert } from '@/app/contexts/AlertContext';
import { changeFileGroupSharingStatus } from '@/app/file-requests/files';
import { updateFolderGroupSharingStatus } from '@/app/file-requests/folders';
import { useUser } from '@clerk/nextjs';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react'

function FolderGroupSharingForm({ folder, setFolder, setFolders, setSelectedObjects, groups }) {
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [currentSelected, setCurrentSelected] = useState(null)
    const [availableGroups, setAvailableGroups] = useState([]);
    const [shareErrors, setShareErrors] = useState(null);
    const [apiLoading, setApiLoading] = useState(false);
    const { showAlert } = useAlert();
    const { user } = useUser();

    useEffect(() => {
        if (!folder || !groups) return;
    
        const shareGroups = folder.sharing.groups || [];
        const { selected, available } = sortGroups(shareGroups, groups);
    
        setAvailableGroups(available);
        setSelectedGroups(selected);
    }, [groups, folder]);

    // Sorts groups in 2 cathegory
    const sortGroups = (folderSharingGroups, allGroups) => {
        const normalizedGroups = new Set(folderSharingGroups.map(group => String(group))); // Normalize IDs
    
        const available = allGroups.filter(group => !normalizedGroups.has(String(group.id))); // Not yet shared
        const selected = allGroups.filter(group => normalizedGroups.has(String(group.id))); // Already shared
    
        return { selected, available };
    };

    // Set current selected group (select element)
    const handleCurrentSelected = (e) => {
        setCurrentSelected(e.target.value);
    };

    // Add new selected group
    const handleAddGroup = () => {
        const group = availableGroups?.find(g => g.id === currentSelected);
        if (group) {
            setSelectedGroups((prevSelected) => [...prevSelected, group]);
            setAvailableGroups(prevAvailable => prevAvailable.filter(g => g.id !== currentSelected));
        }
    }

    // Remove selected group
    const handleRemoveGroup = (groupId) => {
        const group = selectedGroups?.find(g => g.id === groupId);
        if (group) {
            setSelectedGroups(prevSelected => prevSelected.filter(g => g.id !== groupId));
            setAvailableGroups(prevAvailable => [...prevAvailable, group]);
        }
    };

    // Handle changing groupSharing status
    const handleChangingFolderGroupSharing = async (e) => {
        e.preventDefault();
        if (apiLoading) {
            showAlert('Ladataan... Odota hetki.', 'info');
            return;
        }
    
        setApiLoading(true);
        const groupIDarray = selectedGroups.map(group => group.id);
    
        try {
            const response = await updateFolderGroupSharingStatus(user.id, folder.id, groupIDarray);
            if (response.success) {
                showAlert(response.message, 'success');

                // Conditional client side updating
                const updatedFolder = { ...folder, sharing: { ...folder.sharing, groups: groupIDarray }}
                
                if (setFolder) {
                    setFolder(updatedFolder);
                }
                if (setFolders) {
                    setFolders(prevFolders => prevFolders.map(folder => folder.id === updatedFolder.id ? updatedFolder: folder));
                }
                if (setSelectedObjects) {
                    setSelectedObjects(prevObjects => prevObjects.map(obj => obj.id === updatedFolder.id ? updatedFolder : obj));
                }
    
                // Re-synchronize selectedGroups and availableGroups
                const { selected, available } = sortGroups(updatedFolder.sharing.groups, groups);
                setAvailableGroups(available);
                setSelectedGroups(selected);
    
                if (response.errors) {
                    setShareErrors(response.errors);
                }
            } else {
                if (response.errors) {
                    setShareErrors(response.errors);
                }
                showAlert(response.message || 'Tiedoston ryhmässä jakamisen muutokset epäonnistuivat, yritä uudelleen.', 'error');
            }
        } catch (error) {
            console.error("Error changing file group-sharing status: " + error);
            showAlert('Tiedoston ryhmässä jakamisen muutokset epäonnistuivat, yritä uudelleen.', 'error');
        } finally {
            setApiLoading(false);
        }
    };

    return (
        <div className='flex flex-col gap-2 mt-2 p-2 bg-gradient-to-r from-contrast to-neutral-400 dark:to-neutral-700 rounded-lg'>
            <h3 className='text-lg font-semibold'>Jaa ryhmässä</h3>
            {apiLoading ? (
                <SimpleLoading />
            ) : (
                <form className='flex flex-col gap-2' onSubmit={handleChangingFolderGroupSharing}>
                    <div>
                        <label htmlFor="groupSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Lisää ryhmä:</label>
                        <span className='flex items-center gap-1'>
                            <select
                                id="groupSelect"
                                className="w-full py-2.5 px-3 rounded-md bg-background text-sm border border-transparent outline-none focus:border-primary focus:ring-1"
                                onChange={handleCurrentSelected}
                                defaultValue=""
                            >
                                <option value="" disabled>Valitse ryhmä</option>
                                {availableGroups.map(group => (
                                    <option key={group.id} value={group.id}>{group.name}</option>
                                ))}
                            </select>
                            <button 
                                type='button'
                                className="w-fit h-fit px-3 py-2 rounded-lg text-white bg-primary text-sm hover:bg-primary/75 transition-colors"
                                onClick={handleAddGroup}
                            >
                                Lisää
                            </button>
                        </span>
                    </div>
                    
                    <div>
                        <p htmlFor="groupSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-400">Jaettu ryhmissä:</p>
                        <div className="flex items-center flex-wrap gap-2">
                            {selectedGroups.map(group => (
                                <div key={group.id} className="flex items-center text-white px-2 py-1 bg-black rounded-md">
                                    <span>{group.name}</span>
                                    <button
                                        type="button"
                                        className="ml-2 text-white hover:text-red-500"
                                        onClick={() => handleRemoveGroup(group.id)}
                                        title='Poista ryhmässä jakaminen'
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            ))}

                            {!selectedGroups.length &&
                                <p className='text-sm px-3'>Ei ryhmiä</p>
                            }
                        </div>
                    </div>

                    {shareErrors && shareErrors.length > 0 &&
                        shareErrors.map((error, index) => (
                            <div className='flex items-center justify-between gap-2 px-3 py-2 rounded-md text-white text-sm bg-red-500' key={index}>
                                <p>{error}</p>
                                <button onClick={() => setShareErrors(shareErrors.filter((_, i) => i !== index))}>
                                    <X size={20} />
                                </button>
                            </div>
                        ))
                    }

                    <button 
                        type="submit" 
                        className="w-fit py-2 px-3 rounded-lg text-white bg-primary hover:bg-primary/75 
                            text-sm transition-colors"
                    >
                        Tallenna muutokset
                    </button>
                </form>
            )}
        </div>
    )
}

export default FolderGroupSharingForm