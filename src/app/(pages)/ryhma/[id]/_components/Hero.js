import { useUser } from '@clerk/nextjs'
import { PenBox } from 'lucide-react';
import React from 'react'


function Hero({ group, setGroup }) {
    const { isLoaded, user } = useUser(); 

    return (
        <div className={`relative flex items-end min-h-72 bg-center bg-contain rounded-lg overflow-hidden
            bg-[url(${group.hero ? group.hero : '/images/default_group_hero.png'})]`}
        >
            <div className='flex flex-col gap-2 px-6 py-4 w-full bg-black/50 text-white'>
                <h1 className="text-3xl font-black truncate">{group.name}</h1>
                <p className='text-sm'>{group.desc}</p>
            </div>

            {isLoaded && user.id === group.user.id &&
                <button 
                    title='Vaihda kansikuvaa'
                    className='absolute top-0 right-0 p-2 text-white bg-black/50 rounded-bl-lg hover:bg-primary'
                >
                    <PenBox />
                </button>
            }
        </div>
    )
}

export default Hero