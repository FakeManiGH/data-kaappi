import React, { useEffect, useState } from 'react'
import { ArrowLeftSquare, LockKeyhole, Settings, Share2, Trash } from 'lucide-react'
import Link from 'next/link'
import { useNavigation } from '@/app/contexts/NavigationContext'
import SharePopup from './SharePopup'
import PasswordPopup from './PasswordPopup'
import DeleteConfirmPopup from './DeleteConfirmPopup'

function FileNav({ file, setFile }) {
    const [dropMenu, setDropMenu] = useState(false)
    const [sharePopup, setSharePopup] = useState(false)
    const [passwordPopup, setPasswordPopup] = useState(false)
    const [deletePopup, setDeletePopup] = useState(false)
    const { setCurrentIndex } = useNavigation()

    useEffect(() => {
        const handleClick = (e) => {
            if (!e.target.closest('.relative')) {
                setDropMenu(false)
            }
        }

        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [])

    const handleSharePopup = () => {
        setDropMenu(false)
        setSharePopup(true)
    }

    const handlePasswordPopup = () => {
        setDropMenu(false)
        setPasswordPopup(true)
    }

    const handleDeletePopup = () => {
        setDropMenu(false)
        setDeletePopup(true)
    }

    return (
        <div className='flex items-center justify-between mb-4 border-b border-contrast2'>
            <Link href="/omat-tiedostot" onClick={() => setCurrentIndex('/omat-tiedostot')} className='flex items-center text-navlink space-x-2 gap-1 hover:text-primary'>
                <ArrowLeftSquare size={20} />
                Takaisin tiedostoihin
            </Link>

            <div className="relative">
                <button 
                    className={`flex items-center gap-2 p-2 hover:text-primary ${dropMenu ? 'text-primary' : 'text-navlink'}`}	 
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
                                onClick={handleSharePopup}
                            >
                                <Share2 size={16} />
                                Jako asetukset
                            </button>
                            <button 
                                className='flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:text-primary' 
                                role="menuitem"
                                onClick={handlePasswordPopup}
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
                            onClick={handleDeletePopup}
                            >
                                <Trash size={16} />
                                Poista tiedosto
                            </button>                            
                        </div>
                    </div>
                )}
            </div>
            {/* Popups */}
            {sharePopup && <SharePopup file={file} setFile={setFile} setSharePopup={setSharePopup} />}
            {passwordPopup && <PasswordPopup file={file} setFile={setFile} setPasswordPopup={setPasswordPopup} />}
            {deletePopup && <DeleteConfirmPopup file={file} setDeletePopup={setDeletePopup} />}
        </div>
    )
}

export default FileNav