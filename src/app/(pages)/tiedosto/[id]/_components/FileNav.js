import React, { useEffect, useState } from 'react'
import { LockKeyhole, Pen, Settings, Share2, Trash } from 'lucide-react'
import SharePopup from './SharePopup'
import PasswordPopup from './PasswordPopup'
import DeleteConfirmPopup from './DeleteConfirmPopup'
import { useUser } from '@clerk/nextjs'

function FileNav({ file, setFile, setDeleted }) {
    const [dropMenu, setDropMenu] = useState(false)
    const [sharePopup, setSharePopup] = useState(false)
    const [passwordPopup, setPasswordPopup] = useState(false)
    const [deletePopup, setDeletePopup] = useState(false)

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
        <div className='relative flex flex-wrap items-center justify-end w-full mb-2'>
            <div>
                <button 
                    className={`flex items-center w-fit gap-2 px-3 py-2 border text-sm bg-primary text-white hover:bg-primary/75 transition-colors
                        ${dropMenu ? 'border-foreground' : 'border-transparent'}`} 
                    role="button"
                    onClick={() => setDropMenu(!dropMenu)}
                >
                    <Settings size={24} />
                    Toiminnot
                </button>

                {dropMenu && (
                    <div
                        className="absolute z-10 right-0 mt-2 w-full sm:max-w-64 divide-y divide-contrast overflow-hidden border border-contrast bg-background shadow-lg"
                        role="menu"
                    >
                        <div className='bg-background shadow-lg shadow-black/50'>
                            <strong className="block p-2 text-xs font-medium uppercase text-gray-500">
                                Yleiset
                            </strong>

                            <button 
                                className='flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:text-primary' 
                                role="menuitem"
                                onClick={handleSharePopup}
                            >
                                <Pen size={16} />
                                Muokkaa
                            </button>

                            <button 
                                className='flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:text-primary' 
                                role="menuitem"
                                onClick={handleSharePopup}
                            >
                                <Share2 size={16} />
                                Jaa tiedosto
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
                            <strong className="block p-2 text-xs font-medium uppercase text-red-400">
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
            {deletePopup && <DeleteConfirmPopup file={file} setDeletePopup={setDeletePopup} setDeleted={setDeleted} />}
        </div>
    )
}

export default FileNav