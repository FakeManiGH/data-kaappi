import { translateFileSize } from '@/utils/DataTranslation';
import { ChevronDown, ChevronDownCircle, ChevronUp, ChevronUpCircle } from 'lucide-react'
import Link from 'next/link';
import React, { useState } from 'react'

function FolderInfoContainer({ files, folder, folders }) {
    const [open, setOpen] = useState(false);
    const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0);

    return (
        <div className='flex flex-col gap-1 text-sm'>
            <button 
                onClick={() => setOpen(!open)}
                className={`flex items-center self-end gap-1 ${open ? 'hover:text-red-500' : 'hover:text-primary'}`}
            >
                <p className='font-semibold'>Kansion tiedot</p>
                {open ? <ChevronUp /> : <ChevronDown />}
            </button>

            <div className={`px-4 origin-top transition-all bg-secondary rounded-lg
                ${open ? 'h-full py-2 scale-y-100' : 'h-0 py-0 scale-y-0'}`} 
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
                        <p className='text-navlink'>{folder.sharing.group ? (
                            folder.sharing.groups.map(group => (
                                <ul className='flex items-center gap-2'>
                                    <li key={group?.id}>
                                        <Link className='text-primary hover:text-priamry/75' href={`ryhma/${group.id}`}>{group.name}</Link>
                                    </li>
                                </ul>
                            ))) : (
                                <span>Ei jaettu</span>
                            )}
                        </p>
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