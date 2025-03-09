import React, { useState } from 'react';
import { Check, CheckCheck, CheckCircle, Folder, FolderPlus, FolderX, Pencil, PencilLine, Settings, Share2, Trash2, X } from 'lucide-react';
import DownloadBtn from './DownloadBtn';
import Link from 'next/link';

function FolderView({ folders, setFolders, setCreateFolder, selectedFolders, setSelectedFolders, setFolderOptions }) {
    const [touchStartTime, setTouchStartTime] = useState(null);

    const handleFolderSelect = (folder) => {
        if (selectedFolders.includes(folder)) {
            setSelectedFolders(selectedFolders.filter(sFolder => sFolder !== folder));
        } else {
            setSelectedFolders([...selectedFolders, folder]);
        }
    }


    // Handle long press on touch devices
    const handleTouchStart = (folder) => {
        setTouchStartTime(Date.now());
    };

    // Handle long press on touch devices
    const handleTouchEnd = (folder) => {
        const touchDuration = Date.now() - touchStartTime;
        if (touchDuration > 500) { // 500 milliseconds for long press
            handleFolderSelect(folder);
        }
        setTouchStartTime(null);
    };

    if (!folders.length) {
        return (
            <div className="flex flex-col h-96 items-center justify-center gap-4">
                <h2 className="text-xl">Kansioita ei löytynyt...</h2>
                <button onClick={() => setCreateFolder(true)} className='flex gap-2 items-center text-navlink hover:text-foreground transition-colors'>
                    <FolderPlus size={20} className='text-primary' />
                    Luo kansio
                </button>
            </div>
        );
    }

    return (
        <>
        {selectedFolders.length > 0 && (
            <div className='flex items-center justify-between gap-1 flex-wrap'>
                <div className='flex items-center gap-1'>
                    {selectedFolders.length < 2 && (
                        <button 
                            className='flex items-center w-fit gap-2 px-3 py-2 text-sm bg-primary text-white hover:bg-primary/75 transition-colors' 
                            onClick={() => setFolderOptions(true)}
                        >
                            <PencilLine size={20} />
                            Muokkaa
                        </button>
                    )}
                    <button className='flex items-center w-fit gap-2 px-3 py-2 text-sm bg-primary text-white hover:bg-primary/75 transition-colors'>
                        <Share2 size={20} />
                        Jaa
                    </button>
                    <DownloadBtn />
                </div>    

                <div className='flex items-center gap-1'>
                    <button
                        onClick={() => setSelectedFolders([])}
                        className='flex items-center w-fit gap-2 px-3 py-[6.2px] border-2 border-primary text-sm bg-background text-foreground hover:text-primary transition-colors'
                    >
                        <X size={20} />
                        {selectedFolders.length} valittu
                    </button>
                    <button
                        onClick={() => {
                            setFolders(folders.filter(folder => !selectedFolders.includes(folder)));
                            setSelectedFolders([]);
                        }}
                        className='flex items-center w-fit gap-2 px-3 py-2 text-sm bg-red-500 text-white hover:bg-red-600 transition-colors'
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
                    onTouchStart={() => handleTouchStart(folder)}
                    onTouchEnd={() => handleTouchEnd(folder)}
                    className={`relative flex flex-col items-center p-4 bg-gradient-to-br from-background to-contrast shadow-md hover:shadow-lg 
                        transition-colors border group ${selectedFolders.includes(folder) ? 'border-primary' : 'border-transparent'}`}
                >   
                    <input 
                        type="checkbox" 
                        className={`absolute top-2 right-2 p-1.5 bg-background group-hover:block appearance-none rounded-full border-2 
                            border-contrast hover:border-primary checked:border-primary checked:bg-primary checked:hover:border-contrast transition-all
                            ${selectedFolders.includes(folder) ? 'block' : 'hidden'}`}
                        onChange={() => handleFolderSelect(folder)}
                        checked={selectedFolders.includes(folder)}
                    />
                    <Link href={`/kansiot/${folder.id}`} className='flex flex-col items-center text-foreground hover:text-primary'>
                        <img src={folder.shared ? "/icons/folder_share.png" : "/icons/folder.png"} alt="folder" className="w-16 h-16" />
                        <h2 className="text-sm font-semibold transition-colors">{folder.name}</h2>
                        <p className="text-sm text-navlink">{folder.fileCount} tiedostoa</p>
                    </Link>    
                </div>
            ))}
        </div>
        </>
    );
}

export default FolderView;