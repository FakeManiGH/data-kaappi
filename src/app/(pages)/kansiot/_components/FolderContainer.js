import React, { useState, useRef, useEffect } from 'react';
import { ArrowRightLeft, FilePlus, FolderPlus, FolderX, GripVertical, LockKeyhole, Pen, Pencil, Settings, Share2, Trash2, X } from 'lucide-react';
import DownloadBtn from './DownloadBtn';
import Link from 'next/link';
import { translateFileSize } from '@/utils/DataTranslation';
import { getFileIcon } from '@/utils/GetFileIcon';
import { useAlert } from '@/app/contexts/AlertContext';
import { moveFileToFolder } from '@/app/file-requests/files';
import { useUser } from '@clerk/nextjs';


function FolderContainer({ folders, files, setFolders, setFiles, setCreateFolder, selectedObjects, setSelectedObjects }) {
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
            <div className="flex flex-col h-72 items-center justify-center text-sm gap-4">
                <h2 className="text-xl text-contrast">Ei kansioita tai tiedostoja...</h2>
                <div className="flex gap-2">
                    <button onClick={() => setCreateFolder(true)} className='flex gap-1 items-center text-primary hover:text-primary/75 transition-colors'>
                        <FolderPlus size={20} className='text-primary' />
                        Luo kansio
                    </button>
                    <p>tai</p>
                    <Link href='/tallenna' className='flex gap-1 items-center text-primary hover:text-primary/75 transition-colors'>
                        <FilePlus size={20} className='text-primary' />
                        Lisää tiedosto
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-2">
            {folders.map(folder => (
                <div 
                    key={folder.id} 
                    onTouchStart={() => handleTouchStart(folder)}
                    onTouchEnd={() => handleTouchEnd(folder)}
                    className={`relative flex items-center justify-center p-4 rounded-lg transition-colors border group overflow-hidden
                        ${selectedObjects.includes(folder) ? 'border-primary' : 'border-transparent'}
                        ${dragOverFolder === folder.id ? 'bg-primary' : 'bg-secondary'}`}
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
                            border-navlink hover:border-primary checked:border-primary checked:bg-primary checked:hover:border-navlink transition-all
                            ${selectedObjects.includes(folder) ? 'block' : 'block md:hidden'}`}
                        onChange={() => handleObjectSelect(folder)}
                        checked={selectedObjects.includes(folder)}
                    />
                    <Link style={{ touchAction: 'none' }} href={`/kansiot/${folder.id}`} className='flex flex-col items-center max-w-full overflow-hidden text-foreground hover:text-primary'>
                        <img src={folder.fileCount > 0 ? "/icons/folder_file.png" : "/icons/folder.png"} alt="folder" className="w-16 h-16" />
                        <h2 className="text-sm font-semibold transition-colors ">{folder.name}</h2>
                        <p className="text-sm text-navlink truncate">{folder.fileCount} tiedostoa</p>
                    </Link>

                    {folder.passwordProtected && <LockKeyhole className='absolute top-2 left-2' size={20} />}
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
                    className={`relative flex items-center justify-center p-4 rounded-lg bg-secondary transition-colors group border overflow-hidden
                        ${selectedObjects.includes(file) ? 'border-primary' : 'border-transparent'}`}
                    style={{ touchAction: 'none' }}
                >   
                    <input 
                        type="checkbox" 
                        className={`absolute top-2 right-2 p-2 bg-background group-hover:block appearance-none rounded-full border 
                            border-navlink hover:border-primary checked:border-primary checked:bg-primary checked:hover:border-navlink transition-all
                            ${selectedObjects.includes(file) ? 'block' : 'block md:hidden'}`}
                        onChange={() => handleObjectSelect(file)}
                        checked={selectedObjects.includes(file)}
                    />

                    <button className='absolute py-2 right-1 cursor-grab text-navlink hover:text-foreground'>
                        <GripVertical />
                    </button>
                    
                    <Link 
                        style={{ touchAction: 'none' }} 
                        href={`/tiedosto/${file.id}`} 
                        className='flex flex-col items-center justify-between text-foreground overflow-hidden 
                            hover:text-primary group'>
                        <img 
                            src={file.type.includes('image') ? file.url : getFileIcon(file.type)} 
                            alt={file.name} 
                            className='w-16 h-16 object-cover mb-1' 
                        />
                        <h2 className=" text-sm max-w-full font-semibold truncate">{file.name}</h2>
                        <p className="text-sm text-navlink">{translateFileSize(file.size)}</p>
                    </Link>

                    {file.passwordProtected && <LockKeyhole className='absolute bottom-2 right-2' size={20} />}
                </div>
            ))}
        </div>
    );
}

export default FolderContainer;