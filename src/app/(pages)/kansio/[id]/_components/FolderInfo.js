import { translateFileSize } from '@/utils/DataTranslation';
import { ArrowRight, ChevronDown, ChevronDownCircle, ChevronUp, ChevronUpCircle } from 'lucide-react'
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react'

function FolderInfo({ files, folder, folders, shareGroups, infoOpen, setInfoOpen }) {
    const [open, setOpen] = useState(false);
    const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0);

    return (
        <>
        {/* Overlay */}
        {infoOpen &&
            <span className='fixed inset-0 z-40 bg-black/50 w-full h-full' onClick={() => setInfoOpen(false)} />
        }

        <div className={`fixed top-0 right-0 z-50 flex flex-col gap-4 p-4 transition-transform origin-right w-full h-full max-w-xl
            bg-white dark:bg-background overflow-y-auto ${infoOpen ? 'scale-x-100' : 'scale-x-0'}`}
        >   
            <button 
                onClick={() => setInfoOpen(false)}
                className='text-red-500 hover:text-red-600'
            >
                <ArrowRight />
            </button>

            <h2 className='text-2xl font-semibold'>Tietoa kansiosta</h2>

            <ul className='flex flex-col gap-2 w-full text-sm'>
                <li className='flex items-center gap-2 justify-between border-b border-dotted border-gray-400 dark:border-gray-600'>
                    <p className='font-semibold'>Kansion tidostojen koko:</p>
                    <p className='text-navlink'>{translateFileSize(totalSize)}</p>
                </li>

                <li className='flex items-center gap-2 justify-between border-b border-dotted border-gray-400 dark:border-gray-600'>
                    <p className='font-semibold'>Alikansioita:</p>
                    <p className='text-navlink'>{folders.length}</p>
                </li>

                <li className='flex items-center gap-2 justify-between border-b border-dotted border-gray-400 dark:border-gray-600'>
                    <p className='font-semibold'>Tiedostoja:</p>
                    <p className='text-navlink'>{files.length}</p>
                </li>

                <li className='flex items-center gap-2 justify-between border-b border-dotted border-gray-400 dark:border-gray-600'>
                    <p className='font-semibold'>Jaettu ryhmässä:</p>
                    <ul className='flex items-center gap-2'>
                        {shareGroups && shareGroups.length > 0 ? (shareGroups.map(group => (
                            <li key={group.id}>
                                <Link className='text-primary hover:text-priamry/75' href={`ryhma/${group.id}`}>{group.name}</Link>
                            </li>
                        ))) : (
                            <li className='text-navlink'>Ei jaettu</li>
                        )}
                    </ul>
                </li>

                <li className='flex items-center gap-2 justify-between border-b border-dotted border-gray-400 dark:border-gray-600'>
                    <p className='font-semibold'>Jaettu linkillä:</p>
                    <p className='text-navlink'>{folder.sharing.link ? 'Kyllä' : 'Ei'}</p>
                </li>

                <li className='flex items-center gap-2 justify-between border-b border-dotted border-gray-400 dark:border-gray-600'>
                    <p className='font-semibold'>Salasana:</p>
                    <p className='text-navlink'>{folder.passwordProtected ? 'Kyllä' : 'Ei'}</p>
                </li>
            </ul>
        </div>
        </>
    )
}

export default FolderInfo