import { translateFileSize } from '@/utils/DataTranslation';
import { ChevronDown, ChevronDownCircle, ChevronUp, ChevronUpCircle } from 'lucide-react'
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react'

function FolderInfoContainer({ files, folder, folders, shareGroups }) {
    const [open, setOpen] = useState(false);
    const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0);
    const infoRef = useRef();

    useEffect(() => {
        if (infoRef) {
            const handleClickOutside = (e) => {
                if (infoRef.current && !infoRef.current.contains(e.target)) {
                    setOpen(false);
                }
            }
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            }
        }
    }, []);

    return (
        <div ref={infoRef} className='w-full z-10 flex flex-col gap-1 text-sm'>
            <button 
                onClick={() => setOpen(!open)}
                className={`flex items-center gap-1 w-fit ${open ? 'text-red-500 hover:text-red-600' : 'text-foreground hover:text-primary'}`}
            >
                <p className='font-semibold'>Tietoa kansiosta</p>
                {open ? <ChevronUp /> : <ChevronDown />}
            </button>

            <div className={`absolute top-full left-0 mt-2 w-full max-w-2xl px-4 py-2 origin-top transition-all bg-background border border-contrast rounded-lg
                shadow-lg shadow-black/25 ${open ? 'scale-y-100' : 'scale-y-0'}`} 
            >
                <ul className='flex flex-col gap-1 w-full'>
                    <li className='flex items-center gap-2 justify-between border-b border-dotted border-gray-400 dark:border-gray-600'>
                        <p>Kansion koko:</p>
                        <p className='text-navlink'>{translateFileSize(totalSize)}</p>
                    </li>

                    <li className='flex items-center gap-2 justify-between border-b border-dotted border-gray-400 dark:border-gray-600'>
                        <p>Alikansioita:</p>
                        <p className='text-navlink'>{folders.length}</p>
                    </li>

                    <li className='flex items-center gap-2 justify-between border-b border-dotted border-gray-400 dark:border-gray-600'>
                        <p>Tiedostoja:</p>
                        <p className='text-navlink'>{files.length}</p>
                    </li>

                    <li className='flex items-center gap-2 justify-between border-b border-dotted border-gray-400 dark:border-gray-600'>
                        <p>Jaettu ryhmässä:</p>
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
                        <p>Jaettu linkillä:</p>
                        <p className='text-navlink'>{folder.sharing.link ? 'Kyllä' : 'Ei'}</p>
                    </li>

                    <li className='flex items-center gap-2 justify-between border-b border-dotted border-gray-400 dark:border-gray-600'>
                        <p>Salasana:</p>
                        <p className='text-navlink'>{folder.passwordProtected ? 'Kyllä' : 'Ei'}</p>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default FolderInfoContainer