import React, { useState, useRef, useEffect } from 'react';
import { ArrowRightLeft, FilePlus, FolderPlus, FolderX, GripVertical, Group, LockKeyhole, Pen, Pencil, Settings, Share2, Trash2, X } from 'lucide-react';
import DownloadBtn from './DownloadBtn';
import Link from 'next/link';
import { translateFileSize } from '@/utils/DataTranslation';
import { getFileIcon } from '@/utils/GetFileIcon';
import { useAlert } from '@/app/contexts/AlertContext';
import { moveFileToFolder } from '@/app/file-requests/files';
import { useUser } from '@clerk/nextjs';
import FileCardPreview from '@/app/_components/_common/FileCardPreview';


function FolderContainer({ view, folders, files, setFolders, setFiles, setCreateFolder, selectedObjects, setSelectedObjects }) {
    const [draggedFile, setDraggedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false)
    const [dragOverFolder, setDragOverFolder] = useState(null);
    const [touchStartTime, setTouchStartTime] = useState(null);
    const { showAlert } = useAlert();
    const { user } = useUser();


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
                const response = await moveFileToFolder(user.id, draggedFile.id, folder.id);

                if (response.success) {
                    const updatedFiles = files.filter(file => file.id !== draggedFile.id);
                    const updatedFolders = folders.map(f => 
                        f.id === folder.id ? { ...f, fileCount: f.fileCount + 1 } : f
                    );
                    setFiles(updatedFiles);
                    setFolders(updatedFolders);
                    showAlert(response.message, 'success');
                } else {
                    showAlert(response.message, 'error');
                }  
            } catch (error) {
                console.error('Error moving file to folder: ', error);
                showAlert(response.message, 'error');
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

    const handleTouchStart = () => {
        setTouchStartTime(Date.now());
    };

    const handleTouchEnd = (object) => {
        const touchDuration = Date.now() - touchStartTime;
        if (touchDuration > 500) { // 500 milliseconds for long press
            handleObjectSelect(object);
        }
        setTouchStartTime(null);
    };


    // PAGE RENDER
    if (!folders.length && !files.length) {
        return (
            <div className="flex flex-col h-72 items-center justify-center text-sm gap-4">
                <h2 className="text-xl text-contrast">Ei kansioita tai tiedostoja...</h2>
            </div>
        );
    }

    if (view === 'grid') return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2">
            {folders.map(folder => (
                <div 
                    key={folder.id} 
                    onTouchStart={() => handleTouchStart(folder)}
                    onTouchEnd={() => handleTouchEnd(folder)}
                    className={`relative flex items-center justify-center p-2 rounded-lg transition-colors border group  overflow-hidden
                        ${selectedObjects.includes(folder) ? 'border-primary' : 'border-transparent'}
                        ${dragOverFolder === folder.id ? 'bg-primary' : 'bg-secondary'}`}
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
                            border-navlink hover:border-primary checked:border-primary checked:bg-primary checked:hover:border-navlink transition-all
                            ${selectedObjects.includes(folder) ? 'block' : 'block md:hidden'}`}
                        onChange={() => handleObjectSelect(folder)}
                        checked={selectedObjects.includes(folder)}
                    />
                    <Link href={`/kansio/${folder.id}`} className='flex flex-col items-center max-w-full overflow-hidden text-foreground hover:text-primary'>
                        <img src={folder.fileCount > 0 ? "/icons/folder_file.png" : "/icons/folder.png"} alt="folder" className="w-16 h-16" />
                        <h2 className="text-sm font-semibold truncate transition-colors ">{folder.name}</h2>
                        <p className="text-sm text-navlink">{folder.fileCount} tiedostoa</p>
                    </Link>

                    <div className='absolute top-2 left-2 flex flex-col gap-1 text-success'>
                        {folder.passwordProtected && <LockKeyhole size={16} />}
                        {folder.sharing.link && <Share2 size={16} />}
                        {folder.sharing.group && <Group size={16} />}
                    </div>
                </div>
            ))}

            {files.map(file => (
                <div 
                    key={file.id}
                    onTouchStart={() => handleTouchStart(file)}
                    onTouchEnd={() => handleTouchEnd(file)}
                    title={(file.name) + (file.passwordProtected ? ' - suojattu salasanalla' : '')}
                    draggable
                    onDragStart={() => handleDragStart(file)}
                    onDragEnd={() => handleDragEnd(file)}
                    className={`relative flex items-center justify-center p-2 rounded-lg bg-secondary transition-colors group border overflow-hidden
                         ${selectedObjects.includes(file) ? 'border-primary' : 'border-transparent'}`}
                >   
                    <input 
                        type="checkbox" 
                        className={`absolute top-2 right-2 p-2 bg-background group-hover:block appearance-none rounded-full  border 
                            border-navlink hover:border-primary checked:border-primary checked:bg-primary checked:hover:border-navlink transition-all
                            ${selectedObjects.includes(file) ? 'block' : 'block md:hidden'}`}
                        onChange={() => handleObjectSelect(file)}
                        checked={selectedObjects.includes(file)}
                    />

                    <button className='absolute py-2 right-1 cursor-grab text-navlink hover:text-foreground'>
                        <GripVertical />
                    </button>
                    
                    <div className='flex flex-col items-center justify-between overflow-hidden'>
                        <FileCardPreview file={file} />

                        <Link 
                            href={`/tiedosto/${file.id}`} 
                            className='hover:text-primary text-xs'
                        >
                            {file.name}
                        </Link>
                    </div>

                    <div className='absolute top-2 left-2 flex flex-col gap-1 text-success'>
                        {file.passwordProtected && <LockKeyhole size={16} />}
                        {file.linkShare && <Share2 size={16} />}
                        {file.groupShare && <Group size={16} />}
                    </div>
                </div>
            ))}
        </div>
    );

    if (view === 'list') return (
        <ul className='flex flex-col text-sm gap-1'>
            {folders.map(folder => (
                <li 
                    key={folder.id} 
                    title={`${folder.name}, ${folder.fileCount} tiedostoa`}
                    className={`flex items-center gap-2 flex-wrap px-2 py-1 border-b 
                        ${selectedObjects.includes(folder) ? 'border-primary' : 'border-contrast'}`}
                >
                    <input 
                        type="checkbox" 
                        className={`p-2 bg-background appearance-none rounded-full border border-navlink hover:border-primary checked:border-primary 
                            checked:bg-primary checked:hover:border-navlink transition-all`}
                        onChange={() => handleObjectSelect(folder)}
                        checked={selectedObjects.includes(folder)}
                    />

                    <img
                        src='icons/folder.png'
                        alt={folder.name}
                        className="w-7 h-auto"
                    />

                    <Link href={`kansio/${folder.id}`} className='hover:text-primary truncate'>{folder.name}</Link>

                    <p className='text-sm text-navlink' title={`${folder.fileCount} tiedostoa`}>({folder.fileCount})</p>

                    <div className='flex items-center gap-1 text-success'>
                        {folder.passwordProtected && <LockKeyhole size={16} />}
                        {folder.sharing.link && <Share2 size={16} />}
                        {folder.sharing.group && <Group size={16} />}
                    </div>
                </li>
            ))}

            {files.map(file => (
                <li 
                    key={file.id}
                    title={`${file.name}, ${translateFileSize(file.size)}, ${cleanDataType(file.type)}`} 
                    className={`flex items-center gap-2 px-2 py-1 border-b justify-between flex-wrap
                        ${selectedObjects.includes(file) ? 'border-primary' : 'border-contrast'}`}
                >
                    <div className='flex items-center gap-2'>
                        <input 
                            type="checkbox" 
                            className={`p-2 bg-background appearance-none rounded-full border border-navlink hover:border-primary checked:border-primary 
                                checked:bg-primary checked:hover:border-navlink transition-all`}
                            onChange={() => handleObjectSelect(file)}
                            checked={selectedObjects.includes(file)}
                        />

                        <img
                            src={getFileIcon(file.type)}
                            alt={file.name}
                            className="w-7 h-auto"
                        />
                        <Link href={`tiedosto/${file.id}`} className='hover:text-primary truncate'>{file.name}</Link>
                    </div>
                                
                    <div className='flex items-center gap-2 text-xs whitespace-nowrap'>
                        <div className='flex items-center gap-1 text-success'>
                            {file.passwordProtected && <LockKeyhole size={16} />}
                            {file.linkShare && <Share2 size={16} />}
                            {file.groupShare && <Group size={16} />}
                        </div>
                        
                        <p className='text-navlink'>{cleanDataType(file.type)}</p>
                        <p className='text-navlink'>{translateFileSize(file.size)}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default FolderContainer;