import React, { useEffect, useState, useRef } from 'react';
import { simplifyFileType } from '@/utils/DataTranslation';
import { ArrowDownAZ, ArrowUpAZ, CalendarArrowDown, CalendarArrowUp, FileText, ImagePlay, ListCheck, ListFilter, ListStart, LockKeyhole, Share2, Grid, List } from 'lucide-react';

function FileNav({ fileState, setFileState }) {
    const [dropMenu, setDropMenu] = useState(false);
    const [dropMenu2, setDropMenu2] = useState(false);
    const dropDowns = useRef(null);

    useEffect(() => {
        if (dropMenu || dropMenu2) {
            const handleClickOutside = (event) => {
                if (dropDowns.current && !dropDowns.current.contains(event.target)) {
                    setDropMenu(false);
                    setDropMenu2(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [ dropMenu, dropMenu2 ]);

    // Filetype filter
    const addTypeFilter = (filter) => {
        if (filter === 'all') {
            setFileState(prevState => ({
                ...prevState,
                filteredFiles: [],
                filter: 'all',
                filtered: false,
            }));
        } else {
            const filesAfterFilter = fileState.files.filter((file) => simplifyFileType(file.type) === filter);
            setFileState(prevState => ({
                ...prevState,
                filteredFiles: filesAfterFilter,
                filtered: true,
                filter
            }));
        }
        setDropMenu(false);
    };

    // Preference filter
    const addPreferenceFilter = (filter) => {
        if (filter === 'password') {
            const filesAfterFilter = fileState.files.filter((file) => file.password);
            setFileState(prevState => ({
                ...prevState,
                filteredFiles: filesAfterFilter,
                filtered: true,
                filter
            }));
        } else if (filter === 'shared') {
            const filesAfterFilter = fileState.files.filter((file) => file.shared);
            setFileState(prevState => ({
                ...prevState,
                filteredFiles: filesAfterFilter,
                filtered: true,
                filter
            }));
        } else {
            setFileState(prevState => ({
                ...prevState,
                filteredFiles: [],
                filter: 'all',
                filtered: false,
            }));
        }
        setDropMenu(false);
    };

    // Sort filter
    const filesToSort = fileState.searched ? fileState.searchedFiles 
                      : fileState.filtered ? fileState.filteredFiles 
                      : fileState.sorted ? fileState.sortedFiles 
                      : fileState.files;

    const addSort = (sort) => {
        switch (sort) {
            case 'date-desc':
                const sortedFiles = filesToSort.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
                setFileState(prevState => ({
                    ...prevState,
                    sortedFiles,
                    sortedBy: 'date-desc',
                    sorted: false,
                }));
                break;
            case 'date-asc':
                const sortedFiles2 = filesToSort.sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt));
                setFileState(prevState => ({
                    ...prevState,
                    sortedFiles: sortedFiles2,
                    sortedBy: 'date-asc',
                    sorted: true,
                }));
                break;
            case 'name-asc':
                const sortedFiles3 = filesToSort.sort((a, b) => a.name.localeCompare(b.name));
                setFileState(prevState => ({
                    ...prevState,
                    sortedFiles: sortedFiles3,
                    sortedBy: 'name-asc',
                    sorted: true,
                }));
                break;
            case 'name-desc':
                const sortedFiles4 = filesToSort.sort((a, b) => b.name.localeCompare(a.name));
                setFileState(prevState => ({
                    ...prevState,
                    sortedFiles: sortedFiles4,
                    sortedBy: 'name-desc',
                    sorted: true,
                }));
                break;
            default:
                break;
        }
        setDropMenu2(false);
    };

    const translateFilter = (filter) => {
        switch (filter) {
            case 'media':
                return 'Media';
            case 'document':
                return 'Dokumentti';
            case 'password':
                return 'Salasana';
            case 'shared':
                return 'Jaettu';
            default:
                return 'Kaikki';
        }
    };

    const translateSort = (sort) => {
        switch (sort) {
            case 'date-desc':
                return 'Uusin ensin';
            case 'date-asc':
                return 'Vanhin ensin';
            case 'name-asc':
                return 'Nimi A-Ö';
            case 'name-desc':
                return 'Nimi Ö-A';
            default:
                return 'Uusin ensin';
        }
    };

    return (
        <div className='flex items-center gap-2 justify-between bg-background'>
            <nav className='flex items-center gap-1'>
                <button 
                    title='Ruudukko' 
                    className={`p-2 rounded-full bg-gradient-to-br hover:from-primary hover:to-blue-800 hover:text-white shadow-md shadow-black/25
                        ${fileState.view === 'grid' ? 'from-primary to-blue-800 text-white' : 'text-foreground bg-transparent'}` } 
                    onClick={() => setFileState(prevState => ({ ...prevState, view: 'grid' }))}>
                        <Grid />
                </button>
                <button 
                    title='Lista' 
                    className={`p-2 rounded-full bg-gradient-to-br hover:from-primary hover:to-blue-800 hover:text-white shadow-md shadow-black/25
                        ${fileState.view === 'list' ? 'from-primary to-blue-800 text-white' : 'text-foreground bg-transparent'}` } 
                    onClick={() => setFileState(prevState => ({ ...prevState, view: 'list' }))}>
                        <List />
                </button>
            </nav>

            <div ref={dropDowns} className='flex items-center gap-1'>
                <div>
                    <button 
                        className='flex items-center w-fit gap-1 px-3 py-2 rounded-full text-sm bg-gradient-to-br from-primary to-blue-800 text-white
                            shadow-md shadow-black/25 transition-colors hover:to-primary' 
                        role="button"
                        onClick={() => {setDropMenu(!dropMenu); setDropMenu2(false);}}
                    >   
                        <ListFilter size={24} />
                        {translateFilter(fileState.filter)}
                    </button>

                    {dropMenu && (
                        <div
                            className="absolute z-20 mt-2 rounded-lg end-0 sm:max-w-64 w-full pb-2 divide-y divide-contrast overflow-hidden border border-contrast bg-background shadow-lg shadow-black/25"
                            role="menu"
                        >
                            <div className='bg-background'>
                                <strong className="block p-2 text-xs font-medium uppercase text-foreground">
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
                                    className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:text-primary ${fileState.filter === 'media' ? 'text-primary' : 'text-navlink'}`} 
                                    role="menuitem"
                                    onClick={() => addTypeFilter('media')}
                                >
                                    <ImagePlay size={16} />
                                    Media
                                </button>
                                <button 
                                    className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:text-primary ${fileState.filter === 'document' ? 'text-primary' : 'text-navlink'}`}  
                                    role="menuitem"
                                    onClick={() => addTypeFilter('document')}
                                >
                                    <FileText size={16} />
                                    Dokumentti
                                </button>
                            </div>

                            <div className='bg-background'>
                                <strong className="block p-2 text-xs font-medium uppercase text-foreground">
                                    Ominaisuus
                                </strong>
                                
                                <button
                                    className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:text-primary ${fileState.filter === 'password' ? 'text-primary' : 'text-navlink'}`} 
                                    role="menuitem"
                                    onClick={() => addPreferenceFilter('password')}
                                >
                                    <LockKeyhole size={16} />
                                    Salasana
                                </button>
                                <button
                                    className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:text-primary ${fileState.filter === 'shared' ? 'text-primary' : 'text-navlink'}`} 
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
                <div>
                    <button 
                        className='flex items-center w-fit gap-1 px-3 py-2 rounded-full text-sm bg-gradient-to-br from-primary to-blue-800 text-white
                            shadow-md shadow-black/25 transition-colors hover:to-primary'
                        role="button"
                        onClick={() => {setDropMenu2(!dropMenu2); setDropMenu(false);}}
                    >
                        <ListStart size={24} />
                        {translateSort(fileState.sortedBy)}
                    </button>
                    {dropMenu2 && (
                        <div
                            className="absolute z-20 mt-2 rounded-lg end-0 sm:max-w-64 w-full pb-2 divide-y divide-contrast overflow-hidden border border-contrast bg-background shadow-lg shadow-black/25"
                            role="menu"
                        >
                            <div className='bg-background'>
                                <strong className="block p-2 text-xs font-medium uppercase text-foreground">
                                    Järjestys
                                </strong>

                                <button 
                                    className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:text-primary ${fileState.sortedBy === 'date-desc' ? 'text-primary' : 'text-navlink'}`} 
                                    role="menuitem"
                                    onClick={() => addSort('date-desc')}
                                >
                                    <CalendarArrowDown size={16} />
                                    Uusin ensin
                                </button>
                                <button 
                                    className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:text-primary ${fileState.sortedBy === 'date-asc' ? 'text-primary' : 'text-navlink'}`} 
                                    role="menuitem"
                                    onClick={() => addSort('date-asc')}
                                >
                                    <CalendarArrowUp size={16} />
                                    Vanhin ensin
                                </button>
                                <button 
                                    className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:text-primary ${fileState.sortedBy === 'name-asc' ? 'text-primary' : 'text-navlink'}`}  
                                    role="menuitem"
                                    onClick={() => addSort('name-asc')}
                                >
                                    <ArrowDownAZ size={16} />
                                    Nimi A-Ö
                                </button>
                                <button 
                                    className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:text-primary ${fileState.sortedBy === 'name-desc' ? 'text-primary' : 'text-navlink'}`}  
                                    role="menuitem"
                                    onClick={() => addSort('name-desc')}
                                >
                                    <ArrowUpAZ size={16} />
                                    Nimi Ö-A
                                </button>
                            </div>
                        </div>
                    )}
                </div>   
            </div>
        </div>
    );
}

export default FileNav;