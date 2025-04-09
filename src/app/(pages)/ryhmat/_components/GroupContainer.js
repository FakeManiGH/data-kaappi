import { LockKeyhole, Users2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function GroupContainer({ groups }) {
    return (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7'>
            {groups.map(group => (
                <Link href={`ryhmä/${group.id}`} 
                    key={group.id} 
                    className='relative flex flex-col rounded-xl aspect-square group overflow-hidden shadow-lg shadow-black/25 bg-secondary'
                >
                    <img src={group.logo ? group.logo : 'icons/group.png'} alt={`Linkki ryhmään ${group.name}`} className='w-full h-full object-cover' />

                    <div className='absolute inset-x-0 bottom-0 backdrop-blur-md flex items-center gap-2 bg-black/50
                        justify-between p-2 truncate group-hover:text-primary'
                    >
                        {group.name}
                        <span  className='flex items-center gap-1'>
                            <p className='flex items-center gap-1 flex-nowrap'>{group.members.length} <Users2 size={16} /></p>
                            {group.passwordProtected && <p title='Salasana'><LockKeyhole size={16} /></p>}
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default GroupContainer