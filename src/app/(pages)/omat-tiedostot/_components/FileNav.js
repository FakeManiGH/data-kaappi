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
                filter: 'all'
            }))
        } else {
            const filtered = fileState.files.filter((file) => simplifyFileType(file.fileType) === filter)
            setFileState(prevState => ({
                ...prevState,
                filteredFiles: filtered,
                filter
            }))
        }
        setDropMenu(false)
    }

    // Preference filter
    const addPreferenceFilter = (filter) => {
        if (filter === 'all') {
            setFileState(prevState => ({
                ...prevState,
                filteredFiles: [],
                filter: 'all'
            }))
        } else if (filter === 'password') {
            const filtered = fileState.files.filter((file) => file.password)
            setFileState(prevState => ({
                ...prevState,
                filteredFiles: filtered,
                filter
            }))
        } else if (filter === 'shared') {
            const filtered = fileState.files.filter((file) => file.shared)
            setFileState(prevState => ({
                ...prevState,
                filteredFiles: filtered,
                filter
            }))
        } else {
            setFileState(prevState => ({
                ...prevState,
                filteredFiles: [],
                filter: 'all'
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
                    {fileState.filter && fileState.filter !== 'all' && <p className='text-green-600 dark:text-green-500 absolute top-[-8px] left-2'>{translateFilter(fileState.filter)}</p>}
                    <ListFilter size={20} className={fileState.filter !== 'all' ? 'text-green-600 dark:text-green-500' : 'text-navlink'} />
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
                                className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:text-green-600 ${fileState.filter === 'all' ? 'text-green-600' : 'text-navlink'}`} 
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
                                Dokumentit
                            </button>
                        </div>

                        <div className='bg-background'>
                            <strong className="block p-2 text-xs font-medium uppercase text-gray-400 dark:text-gray-600">
                                Ominaisuus
                            </strong>
                            
                            <button
                                className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:text-green-600 ${fileState.filter === 'password' ? 'text-green-600' : 'text-navlink'}`} 
                                role="menuitem"
                                onClick={() => addPreferenceFilter('password')}
                            >
                                <LockKeyhole size={16} />
                                Salasanasuojatut
                            </button>
                            <button
                                className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:text-green-600 ${fileState.filter === 'shared' ? 'text-green-600' : 'text-navlink'}`} 
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