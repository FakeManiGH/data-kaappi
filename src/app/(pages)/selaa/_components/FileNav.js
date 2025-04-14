import React, { useEffect, useState, useRef } from 'react';
import { simplifyFileType } from '@/utils/DataTranslation';
import { ArrowDownAZ, ArrowUpAZ, CalendarArrowDown, CalendarArrowUp, FileText, ImagePlay, ListCheck, ListFilter, ListStart, LockKeyhole, Share2, Grid, List } from 'lucide-react';

function FileNav({ fileState, setFileState }) {
    const [dropMenu, setDropMenu] = useState(false);
    const dropDown = useRef(null);

    useEffect(() => {
        if (dropMenu) {
            const handleClickOutside = (event) => {
                if (dropDown.current && !dropDown.current.contains(event.target)) {
                    setDropMenu(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [ dropMenu ]);


    // Sort filter
    const filesToSort = fileState.searched ? fileState.searchedFiles 
                      : fileState.sorted ? fileState.sortedFiles 
                      : fileState.files;

    const addSort = (sort) => {
        switch (sort) {
            case 'date-desc':
                const sortedFiles = filesToSort.sort((a, b) => new Date(b.uploaded) - new Date(a.uploaded));
                setFileState(prevState => ({
                    ...prevState,
                    sortedFiles,
                    sortedBy: 'date-desc',
                    sorted: false,
                }));
                break;
            case 'date-asc':
                const sortedFiles2 = filesToSort.sort((a, b) => new Date(a.uploaded) - new Date(b.uploaded));
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
        setDropMenu(false);
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
        <div ref={dropDown} className='flex items-center gap-1'> 
            <div>
                <button 
                    className='flex items-center w-fit gap-1 text-sm text-foreground hover:text-primary whitespace-nowrap transition-colors'
                    role="button"
                    onClick={() => {setDropMenu(!dropMenu)}}
                >
                    <ListStart size={24} />
                    {translateSort(fileState.sortedBy)}
                </button>

                {dropMenu && (
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
    );
}

export default FileNav;