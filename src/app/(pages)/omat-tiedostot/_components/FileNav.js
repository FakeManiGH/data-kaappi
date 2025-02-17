import React, { useEffect, useState } from 'react'
import { simplifyFileType } from '@/utils/DataTranslation'
import { CheckSquare2, FileText, ImagePlay, ListCheck, ListFilter, LockKeyhole, Share2 } from 'lucide-react'
import { set } from 'date-fns'

function FileNav({ files, setFilteredFiles }) {
    const [dropMenu, setDropMenu] = useState(false)
    const [fileFilter, setFileFilter] = useState('all')

    useEffect(() => {
        const handleClick = (e) => {
            if (!e.target.closest('.relative')) {
                setDropMenu(false)
            }
        }

        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [])

    // Filetype filter
    const addTypeFilter = (filter) => {
        setFileFilter(filter)
        if (filter === 'all') {
            setFilteredFiles(files)
        } else {
            let filtered = files.filter((file) => simplifyFileType(file.fileType) === filter)
            setFilteredFiles(filtered)
        }
        setDropMenu(false)
    }

    // Preference filter
    const addPreferenceFilter = (filter) => {
        setFileFilter(filter)
        if (filter === 'password') {
            let filtered = files.filter((file) => file.password)
            setFilteredFiles(filtered)
        } else if (filter === 'shared') {
            let filtered = files.filter((file) => file.shared)
            setFilteredFiles(filtered)
        } else {
            setFilteredFiles(files)
        }
        setDropMenu(false)
    }

    // filterin suomennos
    const translateFilter = (filter) => {
        switch (filter) {
            case 'media':
                return 'Media'
            case 'document':
                return 'Dokumentit'
            case 'password':
                return 'Salasanasuojatut'
            case 'shared':
                return 'Jaetut'
            default:
                return 'Kaikki'
        }
    }

    return (
        <div className='flex flex-wrap items-baseline justify-between mb-2 border-b border-contrast2'>
            <h1 className='text-2xl md:text-3xl'><strong>Omat tiedostot</strong></h1>

            <div className="relative">
                <button 
                    className='flex items-center p-2 gap-1 text-sm hover:text-primary' 
                    role="button"
                    onClick={() => setDropMenu(!dropMenu)}
                >   
                    {fileFilter && fileFilter !== 'all' && <p className='text-green-600 absolute top-[-8px] left-2'> {translateFilter(fileFilter)}</p>}
                    <ListFilter size={20} className={fileFilter !== 'all' ? 'text-green-600' : 'text-navlink'} />
                    Rajaa näkymää
                </button>

                {dropMenu && (
                    <div
                        className="absolute z-20 end-0 w-56 pb-2 rounded-t-none rounded-b-xl divide-y divide-contrast2 overflow-hidden border border-contrast2 bg-background shadow-lg shadow-black/25"
                        role="menu"
                    >
                        <div className='bg-background'>
                            <strong className="block p-2 text-xs font-medium uppercase text-gray-400 dark:text-gray-600">
                                Tyyppi
                            </strong>

                            <button 
                                className={`flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:text-green-600 ${fileFilter === 'all' && 'text-green-600'}`} 
                                role="menuitem"
                                onClick={() => addTypeFilter('all')}
                            >
                                <ListCheck size={16} />
                                Kaikki
                            </button>
                            <button 
                                className={`flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:text-green-600 ${fileFilter === 'media' && 'text-green-600'}`} 
                                role="menuitem"
                                onClick={() => addTypeFilter('media')}
                            >
                                <ImagePlay size={16} />
                                Media
                            </button>
                            <button 
                                className={`flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:text-green-600 ${fileFilter === 'document' && 'text-green-600'}`}  
                                role="menuitem"
                                onClick={() => addTypeFilter('document')}
                            >
                                <FileText size={16} />
                                Dokumentit
                            </button>
                        </div>

                        <div className='bg-background'>
                            <strong className="block p-2 text-xs font-medium uppercase text-gray-400 dark:text-gray-600">
                                Ominaisuus
                            </strong>
                            
                            <button
                                className={`flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:text-green-600 ${fileFilter === 'password' && 'text-green-600'}`} 
                                role="menuitem"
                                onClick={() => addPreferenceFilter('password')}
                            >
                                <LockKeyhole size={16} />
                                Salasanasuojatut
                            </button>
                            <button
                                className={`flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:text-green-600 ${fileFilter === 'shared' && 'text-green-600'}`} 
                                role="menuitem"
                                onClick={() => addPreferenceFilter('shared')}
                            >   
                                <Share2 size={16} />
                                Jaetut
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FileNav