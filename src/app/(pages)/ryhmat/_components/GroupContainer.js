import { LockKeyhole, Users2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function GroupContainer({ groups }) {
    return (
        <div className='flex flex-col gap-2'>
            {groups.map(group => (
                <Link href={`ryhma/${group.id}`} 
                    key={group.id} 
                    className='relative flex rounded-lg group overflow-hidden text-sm shadow-lg
                    bg-gradient-to-br from-secondary to-contrast border border-black/10 hover:border-primary'
                    title={group.desc}
                >
                    <img 
                        src={group.cover ? group.cover : 'icons/group.png'} 
                        alt={`Linkki ryhmään ${group.name}`} 
                        className='aspect-square min-h-20 min-w-20 max-h-40 max-w-40 object-cover bg-background p-2' 
                    />

                    <div className='flex flex-col gap-2 p-2 justify-between'>
                        <h2 className='text-xl font-semibold group-hover:text-primary'>{group.name}</h2>

                        <p className=''>{group.desc}</p>

                        <p title='Jäseniä' className='flex items-center gap-1 flex-nowrap'>{group.members.length} käyttäjää</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default GroupContainer