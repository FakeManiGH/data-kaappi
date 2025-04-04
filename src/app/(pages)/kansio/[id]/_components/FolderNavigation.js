import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightLeft, CheckSquare, LockKeyhole, Pen, Settings, Share2, Trash2, X } from 'lucide-react';


function FolderNavigation({ folders, files, selectedObjects, setSelectedObjects, setRenamePopup, setMovePopup, setPasswordPopup, setDeletePopup }) {
    const [dropMenu, setDropMenu] = useState(false)
    const dropRef = useRef(null);

    useEffect(() => {
        if (dropRef) {
            const handleClickOutside = (event) => {
                if (dropRef.current && !dropRef.current.contains(event.target)) {
                    setDropMenu(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }), [dropMenu];

    // Select all objects in folder
    const selectAllObjects = () => {
        const allObjects = [...folders, ...files];
        const newSelectedObjects = allObjects.filter(
            (object) => !selectedObjects.some((selected) => selected.id === object.id)
        );

        setSelectedObjects((prevSelectedObjects) => [...prevSelectedObjects, ...newSelectedObjects]);
    };


    return (
        <div className='flex w-full items-center justify-between gap-1 flex-wrap'>
            <div ref={dropRef} className='relative flex flex-wrap items-center'>
                <button 
                    className='flex items-center w-fit gap-2 px-3 py-2 rounded-full text-sm bg-primary 
                        text-white hover:bg-primary/75  transition-colors'
                    role="button"
                    onClick={() => setDropMenu(!dropMenu)}
                >
                    <Settings size={20} />
                    Toiminnot
                </button>

                {dropMenu && (
                    <div
                        className="absolute z-10 left-0 top-full mt-2 rounded-lg rogue-dropmenu sm:max-w-64 divide-y divide-contrast overflow-hidden 
                            border border-contrast bg-background shadow-lg shadow-black/25"
                        role="menu"
                    >
                        <div className='bg-background '>
                            <strong className="block p-2 text-xs font-medium uppercase text-gray-500">
                                Yleiset
                            </strong>

                            {selectedObjects.length === 1 &&
                            <>
                                <button 
                                    className='flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:text-primary' 
                                    role="menuitem"
                                    onClick={() => { setRenamePopup(true), setDropMenu(false) }}
                                >
                                    <Pen size={16} />
                                    Nimeä uudelleen
                                </button>
                                <button 
                                    className='flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:text-primary' 
                                    role="menuitem"
                                    onClick={() => {setPasswordPopup(true), setDropMenu(false)}}
                                >
                                    <LockKeyhole size={16} />
                                    Salasana
                                </button>
                            </>
                            }

                            <button 
                                className='flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:text-primary' 
                                role="menuitem"
                                onClick={() => {setMovePopup(true), setDropMenu(false)}}
                            >
                                <ArrowRightLeft size={16} />
                                Siirrä
                            </button>

                            <button 
                                className='flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:text-primary' 
                                role="menuitem"
                            >
                                <Share2 size={16} />
                                Jaa
                            </button>

                            <button 
                                className='flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:text-primary'
                                role='menuitem'
                                onClick={selectAllObjects}
                            >   
                                <CheckSquare size={16} />
                                Valitse kaikki
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
                                onClick={() => {setDeletePopup(true), setDropMenu(false)}}
                            >
                                <Trash2 size={16} />
                                Poista
                            </button>                            
                        </div>
                    </div>
                )}
            </div>   

            <div className='flex items-center gap-1'>
                <button
                    onClick={() => setSelectedObjects([])}
                    className='flex items-center w-fit gap-1 px-3 py-2 rounded-full border border-navlink text-sm text-foreground 
                        hover:border-primary group transition-colors'
                >
                    <X size={20} className='group-hover:text-primary transition-colors' />
                    {selectedObjects.length} valittu
                </button>
                <button
                    onClick={() => setDeletePopup(true)}
                    className='flex items-center w-fit gap-1 px-3 py-2 rounded-full text-sm bg-red-500 text-white hover:bg-red-600  
                        transition-colors'
                >
                    <Trash2 size={20} />
                    Poista
                </button>
            </div>
        </div>
    )
}

export default FolderNavigation;