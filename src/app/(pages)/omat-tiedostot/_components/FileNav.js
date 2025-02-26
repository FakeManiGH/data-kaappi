import React, { useEffect, useState } from 'react'
import { simplifyFileType } from '@/utils/DataTranslation'
import { FileText, ImagePlay, ListCheck, ListFilter, LockKeyhole, Share2 } from 'lucide-react'

function FileNav({ fileState, setFileState }) {
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

    // Filetype filter
    const addTypeFilter = (filter) => {
        if (filter === 'all') {
            setFileState(prevState => ({
                ...prevState,
                filteredFiles: [],
                filter: 'all',
                filtered: false,
            }))
        } else {
            const filesAfterFilter = fileState.files.filter((file) => simplifyFileType(file.fileType) === filter)
            setFileState(prevState => ({
                ...prevState,
                filteredFiles: filesAfterFilter,
                filtered: true,
                filter
            }))
        }
        setDropMenu(false)
    }

    // Preference filter
    const addPreferenceFilter = (filter) => {
        if (filter === 'password') {
            const filesAfterFilter = fileState.files.filter((file) => file.password)
            setFileState(prevState => ({
                ...prevState,
                filteredFiles: filesAfterFilter,
                filtered: true,
                filter
            }))
        } else if (filter === 'shared') {
            const filesAfterFilter = fileState.files.filter((file) => file.shared)
            setFileState(prevState => ({
                ...prevState,
                filteredFiles: filesAfterFilter,
                filtered: true,
                filter
            }))
        } else {
            setFileState(prevState => ({
                ...prevState,
                filteredFiles: [],
                filter: 'all',
                filtered: false,
            }))
        }
        setDropMenu(false)
    }

    // filterin suomennos
    const translateFilter = (filter) => {
        switch (filter) {
            case 'media':
                return 'Media'
            case 'document':
                return 'Dokumentti'
            case 'password':
                return 'Salasana'
            case 'shared':
                return 'Jaettu'
            default:
                return 'Kaikki'
        }
    }

    return (
        <div className='relative flex flex-wrap items-end justify-between pb-2'>
            <h1 className='text-2xl md:text-3xl'><strong>Omat tiedostot</strong></h1>

            <div>
                <button 
                    className='flex items-center gap-1 text-sm text-navlink hover:text-primary leading-[1.7]' 
                    role="button"
                    onClick={() => setDropMenu(!dropMenu)}
                >   
                    <ListFilter size={24} className={fileState.filter !== 'all' ? 'text-green-600 dark:text-green-500' : 'text-primary'} />
                    {translateFilter(fileState.filter)}
                </button>

                {dropMenu && (
                    <div
                        className="absolute z-20 bottom-[-250px] end-0 sm:max-w-64 w-full pb-2 rounded-lg divide-y divide-contrast overflow-hidden border border-contrast bg-background shadow-lg shadow-black/25"
                        role="menu"
                    >
                        <div className='bg-background'>
                            <strong className="block p-2 text-xs font-medium uppercase text-gray-500 dark:text-gray-600">
                                Tyyppi
                            </strong>

                            <button 
                                className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:text-primary ${fileState.filter === 'all' ? 'text-primary' : 'text-navlink'}`} 
                                role="menuitem"
                                onClick={() => addTypeFilter('all')}
                            >
                                <ListCheck size={16} />
                                Kaikki
                            </button>
                            <button 
                                className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:text-green-600 ${fileState.filter === 'media' ? 'text-green-600' : 'text-navlink'}`} 
                                role="menuitem"
                                onClick={() => addTypeFilter('media')}
                            >
                                <ImagePlay size={16} />
                                Media
                            </button>
                            <button 
                                className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:text-green-600 ${fileState.filter === 'document' ? 'text-green-600' : 'text-navlink'}`}  
                                role="menuitem"
                                onClick={() => addTypeFilter('document')}
                            >
                                <FileText size={16} />
                                Dokumentti
                            </button>
                        </div>

                        <div className='bg-background'>
                            <strong className="block p-2 text-xs font-medium uppercase text-gray-500 dark:text-gray-600">
                                Ominaisuus
                            </strong>
                            
                            <button
                                className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:text-green-600 ${fileState.filter === 'password' ? 'text-green-600' : 'text-navlink'}`} 
                                role="menuitem"
                                onClick={() => addPreferenceFilter('password')}
                            >
                                <LockKeyhole size={16} />
                                Salasana
                            </button>
                            <button
                                className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:text-green-600 ${fileState.filter === 'shared' ? 'text-green-600' : 'text-navlink'}`} 
                                role="menuitem"
                                onClick={() => addPreferenceFilter('shared')}
                            >   
                                <Share2 size={16} />
                                Jaettu
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FileNav