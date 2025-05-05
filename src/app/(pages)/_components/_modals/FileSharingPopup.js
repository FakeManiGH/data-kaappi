import PopupLoader from '@/app/_components/_common/PopupLoader';
import { useAlert } from '@/app/contexts/AlertContext';
import { getUserGroups } from '@/app/file-requests/groups';
import { useUser } from '@clerk/nextjs';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import FileGroupSharingForm from '../_forms/FileGroupSharingForm';
import SimpleLoading from '@/app/_components/_common/SimpleLoading';
import { changeFileLinkSharing } from '@/app/file-requests/files';
import CopyClipboard from '@/app/_components/_common/CopyClipboard';
import FileLinkSharingForm from '../_forms/FileLinkSharingForm';

function FileSharingPopup({ selectedFile, setFiles, setSharingPopup, setSelectedObjects }) {
    const [loading, setLoading] = useState(true);
    const [apiLoading, setApiLoading] = useState(false);
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
            <div className='relative flex flex-col w-full max-w-2xl rounded-xl p-4 z-50 bg-gradient-to-br from-contrast to-secondary 
                shadow-lg shadow-black/25 max-h-full border border-contrast overflow-y-auto'
            >
                <button 
                    onClick={() => setSharingPopup(false)} 
                    className='absolute top-2 right-2 p-1 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors'
                >
                    <X />
                </button>

                <h2 className="text-2xl md:text-3xl mb-2 text-center font-bold">Jaa tiedosto</h2>
                <p className='text-sm'>Voit jakaa tiedoston <strong className='text-success'>{selectedFile.name}</strong> seuraavasti:</p>

                <FileLinkSharingForm file={selectedFile} setFiles={setFiles} />

                <FileGroupSharingForm groups={groups} file={selectedFile} setFiles={setFiles} setSelectedObjects={setSelectedObjects} />
            </div>
        </span>
    )
}

export default FileSharingPopup