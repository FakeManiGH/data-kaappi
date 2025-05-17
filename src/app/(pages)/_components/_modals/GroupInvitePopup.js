import { X } from 'lucide-react'
import React from 'react'

function GroupInvitePopup({ group, setGroup, setGroupInvitePopup }) {
    return (
        <span className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 px-4 py-2'>
            <div className='relative flex flex-col w-full max-w-2xl  p-4 z-50 bg-gradient-to-br from-contrast to-secondary 
            shadow-lg shadow-black/25 max-h-full border border-contrast overflow-y-auto'
        >
                <button 
                onClick={() => setGroupInvitePopup(false)} 
                className='absolute top-2 right-2 p-1  text-white bg-red-500 hover:bg-red-600 transition-colors'
                >
                <X />
                </button>

                <h2 className="text-2xl md:text-3xl mb-2 text-center font-bold">Kutsu ryhmään</h2>
                <p className='text-sm'>
                    Lähetä sähköpostikutsu henkilölle, jonka haluat jäseneksi ryhmään. 
                    Henkilön ei tarvitse olla vielä rekisteröitynyt palveluun.
                </p>

                <form className='flex flex-col text-sm mt-4'>
                    <label htmlFor='email' className='font-semibold text-gray-500'>
                        Lähetä sähköpostikutsu
                    </label>

                    <input
                        id='email'
                        name='email'
                        type='email'
                        className='px-3 py-2 border border-contrast  bg-background outline-none focus:border-primary'
                        placeholder='Anna sähköpostiosoite'
                    />

                    <button
                        type='submit'
                        className='px-3 py-2 mt-2  text-white bg-primary hover:bg-primary/75'
                    >
                        Lähetä kutsu
                    </button>
                </form>
            </div>
        </span>
    )
}

export default GroupInvitePopup
