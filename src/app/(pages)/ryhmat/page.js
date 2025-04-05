"use client"
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@/app/contexts/NavigationContext';
import GroupInvites from './_components/GroupInvites'
import CreateGroupPopup from './_components/CreateGroupPopup';
import { PlusCircle, Search } from 'lucide-react';

function Page() {
    const { setCurrentIndex } = useNavigation();
    const [groups, setGroups] = useState(null);
    const [createGroup, setCreateGroup] = useState(false);

    useEffect(() => {
        setCurrentIndex('/ryhmat');
    }, [setCurrentIndex]);

    return (
        <main>
            <h1 className='text-4xl md:text-4xl font-bold'>Ryhmät</h1>
            
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

            {createGroup && <CreateGroupPopup setGroups={setGroups} setCreateGroup={setCreateGroup} />}
        </main>
    )
}

export default Page;