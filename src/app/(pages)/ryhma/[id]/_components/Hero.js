import { useUser } from '@clerk/nextjs'
import { PenBox } from 'lucide-react';
import React, { useState } from 'react'


function Hero({ group, setCoverImagePopup }) {
    const [coverImage, setCoverImage] = useState(group.cover);
    const { isLoaded, user } = useUser(); 

    return (
        <div
            className="relative flex items-end min-h-72 bg-center bg-contain  overflow-hidden"
            style={{
                backgroundImage: `url('${coverImage || '/images/groups_hero.png'}')`
            }}
        >
            <div className='flex flex-col gap-2 px-6 py-4 w-full bg-black/50 text-white'>
                <h1 className="text-3xl font-black truncate">{group.name}</h1>
                <p className='text-sm'>{group.desc}</p>
            </div>

            {isLoaded && (user.id === group.user.id || group.admins.includes(user.id)) &&
                <button 
                    title='Vaihda kansikuvaa'
                    className='absolute top-0 right-0 p-2 flex items-center gap-1 text-sm text-white bg-black/50 rounded-bl-lg hover:text-primary'
                    onClick={() => setCoverImagePopup(true)}
                >
                    <PenBox size={20} />
                    Vaihda kansikuvaa
                </button>
            }
        </div>
    )
}

export default Hero