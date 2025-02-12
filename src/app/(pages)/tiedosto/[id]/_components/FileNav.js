import React, { useEffect, useState } from 'react'
import { ArrowLeftSquare, DownloadCloud, FileLock2, Settings, Share } from 'lucide-react'
import Link from 'next/link'
import SharePopup from './SharePopup'

function FileNav({ file }) {
    const [dropMenu, setDropMenu] = useState(false)
    const [sharePopup, setSharePopup] = useState(false)

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
                        className="absolute z-10 end-0 w-56 divide-y divide-contrast2 rounded-t-none rounded-b-xl overflow-hidden border border-contrast2 bg-background shadow-lg"
                        role="menu"
                    >
                        <div className='shadow-md shadow-black/20 bg-contrast'>
                            <strong className="block p-2 text-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                                Yleiset
                            </strong>

                            <button 
                                className='flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:bg-contrast hover:text-primary' 
                                role="menuitem"
                                onClick={() => setSharePopup(true)}
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

                        <div className='bg-contrast pb-2'>
                            <strong className="block p-2 text-xs font-medium uppercase text-red-400 dark:text-red-300">
                                Vaaravyöhyke
                            </strong>

                            <button
                            type="submit"
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-100 dark:text-red-500 dark:hover:bg-red-600/10"
                            role="menuitem"
                            >
                            Poista tiedosto
                            </button>                            
                        </div>
                    </div>
                )}
            </div>
            {/* Popups */}
            {sharePopup && <SharePopup file={file} open={setSharePopup} />}
            

        </div>
    )
}

export default FileNav