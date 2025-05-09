import { MailPlus, Users2 } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

function NavigationBar({ members, setAddMembersPopup }) {
    const [showMembers, setShowMembers] = useState(false);
    const memberDrop = useRef(null);

    useEffect(() => {

    }, []);


    return (
        <div className='relative flex gap-2 items-center justify-between w-full'>
            <button 
                className='flex items-center gap-1 px-3 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary/75'
                onClick={() => setShowMembers(!showMembers)}
            >
                <Users2 />
                Jäsenet
            </button>

            <ul 
                ref={memberDrop}
                className={`absolute top-full z-50 mt-2 flex flex-col gap-1 w-full max-w-80 p-2 rounded-md text-sm border border-contrast bg-background
                    origin-top transition-all shadow-md ${showMembers ? 'scale-y-100' : 'scale-y-0'}`}
            >
                {members.map(member => (
                    <li 
                        key={member.id}
                        className='flex items-center gap-2 justify-between'
                    >
                        <p>{member.name}</p>
                        <Link 
                            href={`mailto:${member.email}`}
                            title='Lähetä sähköposti'
                            className='flex items-center gap-1 text-primary hover:text-primary/75'
                        >
                            <MailPlus size={20} />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default NavigationBar
