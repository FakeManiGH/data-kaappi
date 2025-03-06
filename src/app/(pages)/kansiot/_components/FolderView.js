import React, { useState } from 'react';
import { Folder, FolderPlus, FolderX, Pencil, PencilLine, Settings, Share2, Trash2, X } from 'lucide-react';

function FolderView({ folders, setFolders, setCreateFolder }) {
    const [selectedFolders, setSelectedFolders] = useState([]);
    const [touchStartTime, setTouchStartTime] = useState(null);

    const handleFolderSelect = (folder) => {
        if (selectedFolders.includes(folder.id)) {
            setSelectedFolders(selectedFolders.filter(id => id !== folder.id));
        } else {
            setSelectedFolders([...selectedFolders, folder.id]);
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
            <div className='flex items-center gap-1 flex-wrap'>
                <button className='flex gap-1 items-center text-sm text-navlink p-2 px-3 border border-navlink rounded-full hover:text-foreground hover:border-primary transition-colors'>
                    <PencilLine size={20} className='text-primary' />
                    Muokkaa
                </button>
                <button className='flex gap-1 items-center text-sm text-navlink p-2 px-3 border border-navlink rounded-full hover:text-foreground hover:border-primary transition-colors'>
                    <Share2 size={20} className='text-primary' />
                    Jaa
                </button>
                <button
                    onClick={() => setSelectedFolders([])}
                    className='flex gap-1 p-2 px-3 items-center text-sm text-navlink border border-navlink rounded-full hover:text-foreground hover:border-primary transition-colors'
                >
                    <X size={20} className='text-primary' />
                    {selectedFolders.length} valittu
                </button>
                <button
                    onClick={() => {
                        setFolders(folders.filter(folder => !selectedFolders.includes(folder.id)));
                        setSelectedFolders([]);
                    }}
                    className='flex gap-1 items-center text-sm text-red-500 p-2 px-3 border border-red-500 rounded-full hover:text-red-600 hover:border-red-600 transition-colors'
                >
                    <Trash2 size={20} />
                    Poista
                </button>
            </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2">
            {folders.map(folder => (
                <div 
                    key={folder.id} 
                    onTouchStart={() => handleTouchStart(folder)}
                    onTouchEnd={() => handleTouchEnd(folder)}
                    className={`relative flex flex-col items-center p-4 cursor-pointer bg-background rounded-lg shadow-md hover:shadow-lg 
                        transition-colors border group ${selectedFolders.includes(folder.id) ? 'border-primary' : 'border-transparent'}`}
                >   
                    <input 
                        type="checkbox" 
                        className={`absolute w-4 h-4 top-2 right-2 p-1 bg-background group-hover:block
                            ${selectedFolders.includes(folder.id) ? 'block' : 'hidden'}`}
                        onChange={() => handleFolderSelect(folder)}
                        checked={selectedFolders.includes(folder.id)}
                    />
                    <img src="/icons/folder.png" alt="folder" className="w-16 h-16" />
                    <h2 className="text-sm text-foreground font-semibold group-hover:text-primary transition-colors">{folder.name}</h2>
                    <p className="text-sm text-navlink">{folder.fileCount} tiedostoa</p>
                </div>
            ))}
        </div>
        </>
    );
}

export default FolderView;