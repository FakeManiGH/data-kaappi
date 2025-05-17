import React, { useEffect, useState } from 'react'
import { useAlert } from '@/app/contexts/AlertContext'
import { useUser } from '@clerk/nextjs'
import CopyClipboard from '@/app/_components/_common/CopyClipboard';
import { changeFolderLinkSharing, removeFolderPassword, updateFolderGroupSharingStatus, updateFolderName } from '@/app/file-requests/folders';
import { updateFolderPassword } from '@/app/file-requests/folders';
import { ArrowRight, Eye, EyeOff, LockKeyhole, X } from 'lucide-react';
import { folderNameRegex, passwordRegex } from '@/utils/Regex';
import { getUserGroups } from '@/app/file-requests/groups';
import PopupLoader from '@/app/_components/_common/PopupLoader';
import PageLoading from '@/app/_components/_common/PageLoading';
import FolderGroupSharingForm from '@/app/(pages)/_components/_forms/FolderGroupSharingForm';
import FolderLinkSharingForm from '@/app/(pages)/_components/_forms/FolderLinkSharingForm';
import FolderPasswordForm from '@/app/(pages)/_components/_forms/FolderPasswordForm';
import FolderRenameForm from '@/app/(pages)/_components/_forms/FolderRenameForm';
import FolderDeleteButton from '@/app/(pages)/_components/_buttons/FolderDeleteButton';


function FolderSettings({ folder, setFolder, shareGroups, setShareGroups,  settings, setSettings, setDeletePopup }) {
    const [groups, setGroups] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showAlert } = useAlert();
    const { user } = useUser();

    useEffect(() => {
        const fetchUserGroups = async () => {
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
        };
    
        fetchUserGroups();
    }, [shareGroups]);


    if (loading) return <PageLoading />

    return (
        <>
        {/* Overlay */}
        {settings &&
            <span className='fixed inset-0 z-40 bg-black/50 w-full h-full' onClick={() => setSettings(false)} />
        }

        <div className={`fixed top-0 right-0 z-50 flex flex-col gap-4 p-4 transition-transform origin-right w-full h-full max-w-xl
            bg-white dark:bg-background overflow-y-auto ${settings ? 'scale-x-100' : 'scale-x-0'}`}
        >   
            <button 
                onClick={() => setSettings(false)}
                className='text-red-500 hover:text-red-600'
            >
                <ArrowRight />
            </button>

            <h2 className='text-2xl font-semibold'>Kansion asetukset</h2>
            
            <p className='text-xs text-orange-500'>* Muista tallentaa tallennusta vaativat muutokset.</p>    

            <FolderRenameForm selectedFolder={folder} setFolder={setFolder} />

            <hr />

            {/* SHARING */}
            <FolderLinkSharingForm folder={folder} setFolder={setFolder} />

            <hr />

            <FolderGroupSharingForm folder={folder} setFolder={setFolder} groups={groups} />

            <hr />
            
            {/* PASSWORD */}
            <FolderPasswordForm selectedFolder={folder} setFolder={setFolder} />

            <hr />
            
            {/* DELETE */}
            <div className='flex flex-col gap-2'>
                <h3 className='text-xl font-semibold'>Poista kansio</h3>
                <p className='text-sm'>Halutako poistaa tämän kansion?</p>
                <button
                    className='flex items-center gap-1 px-3 py-2 w-fit text-sm  text-white bg-red-500 hover:bg-red-600'
                    onClick={() => setDeletePopup(true)}
                >
                    Poista kansio
                </button>
            </div>
        </div>
        </>
    )
}

export default FolderSettings