"use client"
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@/app/contexts/NavigationContext';
import GroupInvites from './_components/GroupInvites'
import CreateGroupPopup from './_components/CreateGroupPopup';
import { PlusCircle, Search } from 'lucide-react';
import GroupContainer from './_components/GroupContainer';
import { useUser } from '@clerk/nextjs';
import { useAlert } from '@/app/contexts/AlertContext';
import { getUserGroups } from '@/app/file-requests/groups';
import PageLoading from '@/app/_components/_common/PageLoading';
import ErrorView from '../_components/ErrorView';
import ContentNotFound from '@/app/_components/_common/ContentNotFound';


function Page() {
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState(null);
    const [createGroup, setCreateGroup] = useState(false);
    const [dataError, setDataError] = useState(null);
    const [serverError, setServerError] = useState(null);
    const { isLoaded, user } = useUser();
    const { showAlert } = useAlert();
    const { setCurrentIndex, navigatePage } = useNavigation();

    useEffect(() => {
        const fetchGroups = async () => {
            if (isLoaded && user) {
                try {
                    const response = await getUserGroups(user.id);
                    if (response.success) {
                        setGroups(response.groups);
                    } else {
                        setDataError(response.message || 'Ryhmien hakeminen epäonnistui.');
                    }
                } catch (error) {
                    console.error("Error fetching groups: " + error);
                    setServerError('Ryhmien hakeminen epäonnistui. Yritä uudelleen.');
                    showAlert('Palvelinvirhe, tietojen hakeminen epäoonistui.', 'error');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
                navigatePage('/sign-in');
            }
        }

        fetchGroups();
        setCurrentIndex('/ryhmat');
    }, [setCurrentIndex, isLoaded, user, navigatePage, showAlert]);


    if (loading) return <PageLoading />
    if (serverError) return <ErrorView message={serverError} />
    if (dataError) return <ContentNotFound message={dataError} />

    return (
        <main>
            <h1 className='text-4xl md:text-4xl font-black'>Ryhmät</h1>

            <div 
                className='flex items-center justify-center min-h-96 px-4 py-8 pr-4 bg-[url(/images/sharing.png)] bg-center bg-contain mr-[-1rem] md:mr-[-2rem]
                rounded-l-full'
            />

            <GroupInvites />

            <div className='flex flex-row items-center flex-wrap gap-2 mt-2 text-sm'>
                <button
                    onClick={() => setCreateGroup(true)}
                    className='flex gap-2 items-center justify-center w-fit flex-nowrap py-3 px-5 whitespace-nowrap bg-primary text-white 
                        hover:bg-primary/75 rounded-full '
                >
                    <PlusCircle size={20} />
                    Luo uusi ryhmä
                </button>

                <button 
                    className='flex gap-2 py-2 px-3 items-center w-fit justify-center flex-nowrap whitespace-nowrap hover:text-primary'
                >
                    <Search size={20} />
                    Etsi avointa ryhmää
                </button>
            </div>
           
            <h2 className='text-2xl md:text-3xl font-semibold'>Omat ryhmät</h2>
            <GroupContainer groups={groups} />

            {createGroup && <CreateGroupPopup setGroups={setGroups} setCreateGroup={setCreateGroup} />}
        </main>
    )
}

export default Page;