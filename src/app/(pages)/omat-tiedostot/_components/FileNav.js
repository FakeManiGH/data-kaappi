import React, { useEffect, useState } from 'react'
import { ArrowDownWideNarrow, ArrowUpWideNarrow, CalendarArrowDown, CalendarArrowUp, CheckSquare2, LockKeyhole, SlidersHorizontal, Trash } from 'lucide-react'
import Link from 'next/link'

function FileNav({ files }) {
    const [dropMenu, setDropMenu] = useState(false)

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
        <div className='flex items-baseline justify-between mb-4 gap-4 border-b border-contrast2'>
            <h1 className='text-2xl md:text-3xl'><strong>Omat tiedostot</strong></h1>

            <div className="relative">
                <button 
                    className={`flex items-center p-2 gap-1 text-sm hover:text-primary ${dropMenu ? 'text-primary' : 'text-navlink'}`}	 
                    role="button"
                    onClick={() => setDropMenu(!dropMenu)}
                >
                    <SlidersHorizontal size={20} />
                    Järjestä
                </button>

                {dropMenu && (
                    <div
                        className="absolute z-20 end-0 w-56 pb-2 rounded-t-none rounded-b-xl overflow-hidden border border-contrast2 bg-background shadow-lg shadow-black/25"
                        role="menu"
                    >
                        <div className='bg-background'>
                            <strong className="block p-2 text-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                                Järjestä tiedostot
                            </strong>

                            <button 
                                className='flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:text-primary' 
                                role="menuitem"
                            >
                                <ArrowDownWideNarrow size={16} />
                                A-Ö
                            </button>
                            <button 
                                className='flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:text-primary' 
                                role="menuitem"
                            >
                                <ArrowUpWideNarrow size={16} />
                                Ö-A
                            </button>
                            <button 
                                className='flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:text-primary' 
                                role="menuitem"
                            >
                                <CalendarArrowDown size={16} />
                                Uusin ensin
                            </button>
                            <button 
                                className='flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:text-primary' 
                                role="menuitem"
                            >
                                <CalendarArrowUp size={16} />
                                Vanhin ensin
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