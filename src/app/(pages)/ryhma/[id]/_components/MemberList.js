import { useUser } from '@clerk/nextjs';
import { ArrowRight, Ellipsis, MailPlus, } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'

function MemberList({ group, members, memberList, setMemberList, setGroupInvitePopup }) {
    const { user } = useUser();

    return (
        <>
        {/* Overlay */}
        {memberList &&
            <span className='fixed inset-0 z-40 bg-black/50 w-full h-full' onClick={() => setMemberList(false)} />
        }

        <div
            className={`fixed z-50 right-0 top-0 flex flex-col gap-4 p-4 bg-white dark:bg-black w-full h-full max-w-96
                origin-right transition-transform overflow-y-auto ${memberList ? 'scale-x-100' : 'scale-x-0'}`}
        >
            <button 
                title='Sulje lista'
                onClick={() => setMemberList(false)}
                className='hover:text-primary'
            >
                <ArrowRight />
            </button>

            <h2 className='text-xl font-semibold'>Ryhmän käyttäjät</h2>

            <ul className='flex flex-col gap-1 w-full text-sm'>
                {members.map(member => 
                    <li key={member.id} className='flex items-center gap-2 justify-between'>
                        <div className='flex items-center gap-2'>
                            <p>{member.name}</p>
                            {group.admins.includes(member.id) &&  
                                <p className='p-0.5 text-xs text-success border border-success rounded-md'>
                                    Ylläpitäjä
                                </p>
                            }
                        </div>

                        <div className='flex items-center gap-2'>
                            <button
                                title='Toiminnot'
                            >
                                <Ellipsis size={20} />
                            </button>
                            <Link 
                                href={`mailto:${member.email}`} 
                                className='text-primary hover:text-primary/75'
                                title='Lähetä sähköposti'
                            >
                                <MailPlus size={20} />
                            </Link>
                        </div>
                    </li>
                )}
            </ul>

            {/* INVITES */}
            {group.admins.includes(user.id) &&
                <button 
                    className='px-3 py-2 rounded-lg text-sm text-white bg-primary hover:bg-primary/75'
                    onClick={() => {setMemberList(false), setGroupInvitePopup(true)}}
                >
                    Kutsu ryhmään
                </button>
            }
        </div>
        </>
    )
}

export default MemberList