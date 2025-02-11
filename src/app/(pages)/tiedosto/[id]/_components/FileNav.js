import React, { useEffect, useState } from 'react'
import { ArrowLeftSquare, DownloadCloud, FileLock2, Settings, Share } from 'lucide-react'
import Link from 'next/link'

function FileNav({ file }) {
    const [dropMenu, setDropMenu] = useState(false)

    useEffect(() => {
        // close dropdown when clicked outside
        const handleClick = (e) => {
            if (!e.target.closest('.relative')) {
                setDropMenu(false)
            }
        }

        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [])

    return (
        <div className='flex items-center justify-between mb-4 relative border-b border-contrast2'>
            <Link href="/tiedostot" className='flex items-center text-sm text-navlink space-x-2 gap-1 hover:text-primary'>
                <ArrowLeftSquare />
                Takaisin tiedostoihin
            </Link>

            <div>
                <button 
                    className={`flex items-center gap-2 p-2 text-sm hover:text-primary ${dropMenu ? 'text-primary' : 'text-navlink'}`}	 
                    role="button"
                    onClick={() => setDropMenu(!dropMenu)}
                >
                    <Settings />
                    Toiminnot
                </button>

                {dropMenu && (
                    <div
                        className="absolute z-10 end-0 w-56 divide-y divide-contrast2 rounded-t-none rounded-b-xl border border-contrast2 bg-background shadow-lg"
                        role="menu"
                    >
                        <div>
                            <strong className="block p-2 text-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                                Yleiset
                            </strong>

                            <button 
                                className='flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:bg-contrast hover:text-primary' 
                                role="menuitem"
                            >
                                <Share size={16} />
                                Jaa tiedosto
                            </button>
                            <button 
                                className='flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:bg-contrast hover:text-primary' 
                                role="menuitem"
                            >
                                <DownloadCloud size={16} />
                                Lataa tiedosto
                            </button>
                            <button 
                                className='flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:bg-contrast hover:text-primary' 
                                role="menuitem"
                            >
                                <FileLock2 size={16} />
                                Aseta salasana
                            </button>
                        </div>

                        <div>
                            <strong className="block p-2 text-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                                Vaaravyöhyke
                            </strong>

                            <form method="POST" action="#">
                                <button
                                type="submit"
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-100 dark:text-red-500 dark:hover:bg-red-600/10"
                                role="menuitem"
                                >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>

                                Poista tiedosto
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FileNav