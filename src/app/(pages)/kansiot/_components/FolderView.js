import React, { useState, useRef, useEffect } from 'react';
import { ArrowRightLeft, FilePlus, FolderPlus, FolderX, GripVertical, LockKeyhole, Pen, Pencil, Settings, Share2, Trash2, X } from 'lucide-react';
import DownloadBtn from './DownloadBtn';
import Link from 'next/link';
import { translateFileSize } from '@/utils/DataTranslation';
import { getFileIcon } from '@/utils/GetFileIcon';
import { useAlert } from '@/app/contexts/AlertContext';
import { moveFileToFolder } from '@/app/file-requests/files';
import { useUser } from '@clerk/nextjs';


function FolderView({ folders, files, setFolders, setFiles, setCreateFolder, selectedObjects, setSelectedObjects, setRenamePopup }) {
    const [draggedFile, setDraggedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false)
    const [dropMenu, setDropMenu] = useState(false)
    const [dragOverFolder, setDragOverFolder] = useState(null);
    const [touchStartTime, setTouchStartTime] = useState(null);
    const { showAlert } = useAlert();
    const { user } = useUser();
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
    }), [dropMenu]

    const handleDragStart = (file) => {
        setDraggedFile(file);
        setIsDragging(true);
    };

    const handleDragEnd = (file) => {
        setDraggedFile(null);
        setIsDragging(false);
    }

    const handleDrop = async (folder) => {
        setIsDragging(false)
        if (draggedFile) {
            try {
                await moveFileToFolder(user.id, draggedFile.id, folder.id);
                // Remove the moved file from the files array
                const updatedFiles = files.filter(file => file.id !== draggedFile.id);
                // Increase the folder fileCount by 1
                const updatedFolders = folders.map(f => 
                    f.id === folder.id ? { ...f, fileCount: f.fileCount + 1 } : f
                );
                setFiles(updatedFiles);
                setFolders(updatedFolders);
                showAlert(`Tiedosto siirretty kansioon ${folder.name}`, 'success');
            } catch (error) {
                console.error('Error moving file to folder: ', error);
                showAlert('Tiedoston siirtäminen epäonnistui', 'error');
            } finally {
                setDraggedFile(null);
                setDragOverFolder(null); 
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDragEnter = (folder) => {
        setDragOverFolder(folder.id);
    };

    const handleDragLeave = () => {
        setDragOverFolder(null);
    };

    const handleObjectSelect = (object) => {
        if (selectedObjects.includes(object)) {
            setSelectedObjects(selectedObjects.filter(sObject => sObject !== object));
        } else {
            setSelectedObjects([...selectedObjects, object]);
        }
    };

    // Handle long press on touch devices
    const handleTouchStart = () => {
        setTouchStartTime(Date.now());
    };

    // Handle long press on touch devices
    const handleTouchEnd = (object) => {
        const touchDuration = Date.now() - touchStartTime;
        if (touchDuration > 500) { // 500 milliseconds for long press
            handleObjectSelect(object);
        }
        setTouchStartTime(null);
    };

    if (!folders.length && !files.length) {
        return (
            <div className="flex flex-col h-72 items-center justify-center gap-4 text-navlink">
                <h2 className="text-xl sm:text-2xl">Ei kansioita tai tiedostoja...</h2>
                <div className="flex gap-2">
                    <button onClick={() => setCreateFolder(true)} className='flex gap-1 items-center text-foreground hover:text-primary transition-colors'>
                        <FolderPlus size={20} className='text-primary' />
                        Luo kansio
                    </button>
                    <p>tai</p>
                    <Link href='/tallenna' className='flex gap-1 items-center text-foreground hover:text-primary transition-colors'>
                        <FilePlus size={20} className='text-primary' />
                        Lisää tiedosto
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
        {selectedObjects.length > 0 && (
            <div className='flex w-full items-center justify-between gap-1 flex-wrap'>
                <div ref={dropRef} className='relative flex flex-wrap items-center'>
                    <button 
                        className={`flex items-center w-fit gap-2 px-2 py-[7px] border text-sm bg-primary text-white hover:bg-primary/75 transition-colors
                            ${dropMenu ? 'border-foreground' : 'border-transparent'}`} 
                        role="button"
                        onClick={() => setDropMenu(!dropMenu)}
                    >
                        <Settings size={20} />
                        Toiminnot
                    </button>

                    {dropMenu && (
                        <div
                            className="absolute z-10 left-0 top-full mt-2 rogue-dropmenu sm:max-w-64 divide-y divide-contrast overflow-hidden border border-contrast bg-background shadow-lg"
                            role="menu"
                        >
                            <div className='bg-background shadow-lg shadow-black/50'>
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
                                    >
                                        <LockKeyhole size={16} />
                                        Aseta salasana
                                    </button>
                                </>
                                }

                                <button 
                                    className='flex w-full items-center gap-2 px-4 py-2 text-sm text-navlink hover:text-primary' 
                                    role="menuitem"
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

                                
                            </div>

                            <div className='bg-background pb-2'>
                                <strong className="block p-2 text-xs font-medium uppercase text-red-400">
                                    Vaaravyöhyke
                                </strong>

                                <button
                                type="submit"
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:text-red-700"
                                role="menuitem"
                                >
                                    <Trash2 size={16} />
                                    Poista tiedosto
                                </button>                            
                            </div>
                        </div>
                    )}
                </div>   

                <div className='flex items-center gap-1'>
                    <button
                        onClick={() => setSelectedObjects([])}
                        className='flex items-center w-fit gap-1 px-2 py-[7.2px] border border-contrast text-sm bg-background text-foreground hover:border-primary transition-colors'
                    >
                        <X size={20} />
                        {selectedObjects.length} valittu
                    </button>
                    <button
                        onClick={() => {
                            setFolders(folders.filter(folder => !selectedObjects.includes(folder)));
                            setSelectedObjects([]);
                        }}
                        className='flex items-center w-fit gap-1 p-2 text-sm bg-red-500 text-white hover:bg-red-600 transition-colors'
                    >
                        <Trash2 size={20} />
                        Poista
                    </button>
                </div>
            </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-2">
            {folders.map(folder => (
                <div 
                    key={folder.id} 
                    onTouchStart={() => handleTouchStart(folder)}
                    onTouchEnd={() => handleTouchEnd(folder)}
                    className={`relative flex flex-col justify-center py-4 px-6 bg-gradient-to-br shadow-md hover:shadow-lg 
                        transition-colors border group ${selectedObjects.includes(folder) ? 'border-primary' : 'border-background'}
                        ${dragOverFolder === folder.id ? 'from-background to-primary/50' : 'from-background to-contrast'}`}
                    style={{ touchAction: 'none' }}
                >   
                    {isDragging && 
                        <span
                            onDragOver={handleDragOver}
                            onDragEnter={() => handleDragEnter(folder)}
                            onDragLeave={handleDragLeave}
                            onDrop={() => handleDrop(folder)}
                            className='absolute w-full top-0 left-0 h-full z-10'>
                        </span>
                    }
                    <input 
                        type="checkbox" 
                        className={`absolute top-2 right-2 p-2 bg-background group-hover:block appearance-none rounded-full border 
                            border-contrast hover:border-primary checked:border-primary checked:bg-primary checked:hover:border-contrast transition-all
                            ${selectedObjects.includes(folder) ? 'block' : 'block md:hidden'}`}
                        onChange={() => handleObjectSelect(folder)}
                        checked={selectedObjects.includes(folder)}
                    />
                    <Link style={{ touchAction: 'none' }} href={`/kansiot/${folder.id}`} className='flex flex-col max-w-full overflow-hidden text-foreground hover:text-primary'>
                        <img src={folder.shared ? "/icons/folder_share.png" : "/icons/folder.png"} alt="folder" className="w-16 h-16" />
                        <h2 className="text-sm font-semibold transition-colors truncate">{folder.name}</h2>
                        <p className="text-sm text-navlink">{folder.fileCount} tiedostoa</p>
                    </Link>

                    {folder.passwordProtected && <LockKeyhole className='absolute bottom-2 left-2' size={20} />}
                </div>
            ))}

            {files.map(file => (
                <div 
                    key={file.id}
                    title={(file.name) + (file.passwordProtected ? ' - suojattu salasanalla' : '')}
                    onTouchStart={() => handleTouchStart(file)}
                    onTouchEnd={() => handleTouchEnd(file)}
                    draggable
                    onDragStart={() => handleDragStart(file)}
                    onDragEnd={() => handleDragEnd(file)}
                    className={`relative flex flex-col justify-center py-4 px-6 bg-gradient-to-br from-background to-contrast shadow-md hover:shadow-lg 
                        transition-colors group border overflow-hidden ${selectedObjects.includes(file) ? 'border-primary' : 'border-background'}`}
                    style={{ touchAction: 'none' }}
                >   
                    <input 
                        type="checkbox" 
                        className={`absolute top-2 right-2 p-2 bg-background group-hover:block appearance-none rounded-full border 
                            border-contrast hover:border-primary checked:border-primary checked:bg-primary checked:hover:border-contrast transition-all
                            ${selectedObjects.includes(file) ? 'block' : 'block md:hidden'}`}
                        onChange={() => handleObjectSelect(file)}
                        checked={selectedObjects.includes(file)}
                    />

                    <button className='absolute p-1 right-1 cursor-grab'>
                        <GripVertical />
                    </button>
                    
                    <Link style={{ touchAction: 'none' }} href={`/tiedosto/${file.id}`} className='flex flex-col text-foreground hover:text-primary'>
                        <img src={getFileIcon(file.type)} alt="file" className="w-16 h-16 mb-1" />
                        <h2 className=" text-sm max-w-full font-semibold whitespace-nowrap text-ellipsis">{file.name}</h2>
                        <p className="text-sm text-navlink">{translateFileSize(file.size)}</p>
                    </Link>

                    {file.passwordProtected && <LockKeyhole className='absolute bottom-2 left-2' size={20} />}
                </div>
            ))}
        </div>
        </>
    );
}

export default FolderView;