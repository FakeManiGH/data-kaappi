import PopupLoader from '@/app/_components/_common/PopupLoader';
import { useAlert } from '@/app/contexts/AlertContext';
import { getUserGroups } from '@/app/file-requests/groups';
import { useUser } from '@clerk/nextjs';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import FolderLinkSharingForm from '../_forms/FolderLinkSharingForm';
import FolderGroupSharingForm from '../_forms/FolderGroupSharingForm';


function FolderSharingPopup({ selectedFolder, setFolders, setSharingPopup, setSelectedObjects }) {
    const [loading, setLoading] = useState(true);
    const { showAlert} = useAlert();
    const { user } = useUser();
    const [groups, setGroups] = useState(null);
    
    useEffect(() => {
        const fetchUserGroupData = async () => {
            try {
                const response = await getUserGroups(user.id);
                if (response.success) {
                    setGroups(response.groups);
                } else {
                    showAlert(response.message || 'Virhe ryhmien hakemisessa, päivitä sivu ja yritä uudelleen.', 'error');
                }
            } catch (error) {
                console.error("Error fetching user groups: " + error);
                showAlert('Virhe ryhmien hakemisessa, päivitä sivu ja yritä uudelleen.', 'error');
            } finally {
                setLoading(false);
            }
        }

        fetchUserGroupData();
    }, [user, showAlert]);

    if (loading) return <PopupLoader />

    return (
        <span className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 px-4 py-2'>
            <div className='relative flex flex-col w-full max-w-2xl  p-4 z-50 bg-background
                shadow-lg shadow-black/25 max-h-full overflow-y-auto'
            >
                <button 
                    onClick={() => setSharingPopup(false)} 
                    className='absolute top-2 right-2 p-1  text-white bg-red-500 hover:bg-red-600 transition-colors'
                >
                    <X />
                </button>

                <h2 className="text-2xl md:text-3xl mb-2 text-center font-bold">Jaa kansio</h2>
                <p className='text-sm'>Voit jakaa kansion <strong className='text-success text-base'>{selectedFolder.name}</strong> seuraavasti:</p>

                <div className='my-4'>
                    <FolderLinkSharingForm folder={selectedFolder} setFolders={setFolders} setSelectedObjects={setSelectedObjects} />
                </div>

                <hr />

                <div className='my-2'>
                    <FolderGroupSharingForm folder={selectedFolder} setFolders={setFolders} setSelectedObjects={setSelectedObjects} groups={groups} />
                </div>
            </div>
        </span>
    )
}

export default FolderSharingPopup