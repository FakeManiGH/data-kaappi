import { useUser } from '@clerk/nextjs';
import { MailPlus, Users2 } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

function NavigationBar({ memberList, setMemberList }) {
    const { user } = useUser();

    useEffect(() => {

    }, []);


    return (
        <div className='relative flex gap-2 items-center justify-between w-full'>
            <button 
                className='flex items-center gap-1 px-3 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary/75'
                onClick={() => setMemberList(!memberList)}
            >
                <Users2 />
                Jäsenet
            </button>
        </div>
    )
}

export default NavigationBar
