import React, { useState } from 'react';
import { Check, CheckCheck, CheckCircle, FilePlus, Folder, FolderPlus, FolderX, GripVertical, Pencil, PencilLine, Plus, Settings, Share2, Trash2, X } from 'lucide-react';
import DownloadBtn from './DownloadBtn';
import Link from 'next/link';
import { translateFileSize } from '@/utils/DataTranslation';
import { getFileIcon } from '@/utils/GetFileIcon';

function FolderView({ folders, files, setFolders, setFiles, setCreateFolder, selectedObjects, setSelectedObjects, setObjectOptions }) {
    const [draggedFile, setDraggedFile] = useState(null);
    const [dragOverFolder, setDragOverFolder] = useState(null);
    const [touchStartTime, setTouchStartTime] = useState(null);

    const handleDragStart = (file) => {
        setDraggedFile(file);
    };

    const handleDrop = (folder) => {
        if (draggedFile) {
            const updatedFiles = files.map(file => 
                file.id === draggedFile.id ? { ...file, folderID: folder.id } : file
            );
            setFiles(updatedFiles);
            // Update the database here
            setDraggedFile(null);
            setDragOverFolder(null);
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
    const handleTouchStart = (object) => {
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
            <div className='flex items-center justify-between gap-1 flex-wrap'>
                <div className='flex items-center gap-1'>
                    {selectedObjects.length < 2 && (
                        <button 
                            className='flex items-center w-fit gap-1 p-2 text-sm bg-primary text-white hover:bg-primary/75 transition-colors' 
                            onClick={() => setObjectOptions(true)}
                        >
                            <Settings size={20} />
                            Asetukset
                        </button>
                    )}
                    <button className='flex items-center w-fit gap-1 p-2 text-sm bg-primary text-white hover:bg-primary/75 transition-colors'>
                        <Share2 size={20} />
                        Jaa
                    </button>
                    <DownloadBtn />
                </div>    

                <div className='flex items-center gap-1'>
                    <button
                        onClick={() => setSelectedObjects([])}
                        className='flex items-center w-fit gap-1 px-2 py-[6.2px] border-2 border-contrast text-sm bg-background text-foreground hover:border-primary transition-colors'
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

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2">
            {folders.map(folder => (
                <div 
                    key={folder.id} 
                    onTouchStart={() => handleTouchStart(object)}
                    onTouchEnd={() => handleTouchEnd(object)}
                    onDragOver={handleDragOver}
                    onDragEnter={() => handleDragEnter(folder)}
                    onDragLeave={handleDragLeave}
                    onDrop={() => handleDrop(folder)}
                    className={`relative flex flex-col items-center p-4 bg-gradient-to-br shadow-md hover:shadow-lg 
                        transition-colors group 
                        ${dragOverFolder === folder.id ? 'from-background to-primary/50' : 'from-background to-contrast'}`}
                >   
                    <input 
                        type="checkbox" 
                        className={`absolute top-2 right-2 p-1.5 bg-background group-hover:block appearance-none rounded-full border-2 
                            border-contrast hover:border-primary checked:border-primary checked:bg-primary checked:hover:border-contrast transition-all
                            ${selectedObjects.includes(folder) ? 'block' : 'hidden'}`}
                        onChange={() => handleObjectSelect(folder)}
                        checked={selectedObjects.includes(folder)}
                    />
                    <Link href={`/kansiot/${folder.id}`} className='flex flex-col items-center text-foreground hover:text-primary'>
                        <img src={folder.shared ? "/icons/folder_share.png" : "/icons/folder.png"} alt="folder" className="w-16 h-16" />
                        <h2 className="text-sm font-semibold transition-colors">{folder.name}</h2>
                        <p className="text-sm text-navlink">{folder.fileCount} tiedostoa</p>
                    </Link>  
                </div>
            ))}

            {files.map(file => (
                <div 
                    key={file.id}
                    title={file.name}
                    onTouchStart={() => handleTouchStart(object)}
                    onTouchEnd={() => handleTouchEnd(object)}
                    draggable
                    onDragStart={() => handleDragStart(file)}
                    className="relative flex flex-col items-center p-4 bg-gradient-to-br from-background to-contrast shadow-md hover:shadow-lg 
                        transition-colors group overflow-hidden"
                >   
                    <input 
                        type="checkbox" 
                        className={`absolute top-2 right-2 p-1.5 bg-background group-hover:block appearance-none rounded-full border-2 
                            border-contrast hover:border-primary checked:border-primary checked:bg-primary checked:hover:border-contrast transition-all
                            ${selectedObjects.includes(file) ? 'block' : 'hidden'}`}
                        onChange={() => handleObjectSelect(file)}
                        checked={selectedObjects.includes(file)}
                    />
                    <GripVertical className='absolute top-2 left-2 cursor-move' />
                    <Link href={`/tiedosto/${file.id}`} className='flex flex-col items-center text-foreground hover:text-primary'>
                        <img src={getFileIcon(file.type)} alt="file" className="w-16 h-16 mb-1" />
                        <h2 className="text-sm max-w-full font-semibold whitespace-nowrap text-ellipsis">{file.name}</h2>
                        <p className="text-sm text-navlink">{translateFileSize(file.size)}</p>
                    </Link>
                </div>
            ))}
        </div>
        </>
    );
}

export default FolderView;