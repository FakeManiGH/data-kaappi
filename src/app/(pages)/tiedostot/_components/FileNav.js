import React, { useEffect, useState } from 'react'
import { ArrowLeftSquare, CheckSquare2, LockKeyhole, Settings, Share2, Trash } from 'lucide-react'
import Link from 'next/link'

function FileNav({ file, setFile }) {
    const [dropMenu, setDropMenu] = useState(false)
    const [sharePopup, setSharePopup] = useState(false)
    const [passwordPopup, setPasswordPopup] = useState(false)

    useEffect(() => {
        const handleClick = (e) => {
            if (!e.target.closest('.relative')) {
                setDropMenu(false)
            }
        }

        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [])

    return (
        <div className='flex items-baseline justify-between mb-4 border-b border-contrast2'>
            <h1 className='text-2xl md:text-3xl'><strong>Selaa tiedostoja</strong></h1>

            <div className="relative">
                <button 
                    className={`flex items-center p-2 gap-1 text-sm hover:text-primary ${dropMenu ? 'text-primary' : 'text-navlink'}`}	 
                    role="button"
                    onClick={() => setDropMenu(!dropMenu)}
                >
                    <Settings size={20} />
                    Toiminnot
                </button>

                {dropMenu && (
                    <div
                        className="absolute z-10 end-0 w-56 divide-y divide-contrast2 rounded-t-none rounded-b-xl overflow-hidden border border-contrast2 bg-background shadow-lg"
                        role="menu"
                    >
                        <div className='bg-background shadow-lg shadow-black/50'>
                            <strong className="block p-2 text-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                                Yleiset
                            </strong>

                            <button 
                                className='flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:text-primary' 
                                role="menuitem"
                            >
                                <CheckSquare2 size={16} />
                                Valitse tiedostoja
                            </button>
                            <button 
                                className='flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:text-primary' 
                                role="menuitem"
                            >
                                <LockKeyhole size={16} />
                                Aseta salasana
                            </button>
                        </div>

                        <div className='bg-background pb-2'>
                            <strong className="block p-2 text-xs font-medium uppercase text-red-400 dark:text-red-300">
                                Vaaravyöhyke
                            </strong>

                            <button
                            type="submit"
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:text-red-700"
                            role="menuitem"
                            >
                                <Trash size={16} />
                                Poista tiedosto
                            </button>                            
                        </div>
                    </div>
                )}
            </div>
            {/* Popups */}
            
        </div>
    )
}

export default FileNav