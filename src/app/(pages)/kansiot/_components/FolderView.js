import React from 'react';
import { Folder, FolderPlus } from 'lucide-react';

function FolderView({ folders }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2">
            {folders.map(folder => (
                <div 
                    key={folder.id} 
                    className="flex flex-col items-center p-4 cursor-pointer bg-background rounded-lg shadow-md hover:shadow-lg 
                        transition-colors border border-transparent hover:border-primary group"
                >
                    <img src="/icons/folder.png" alt="folder" className="w-16 h-16" />
                    <h2 className="text-sm text-foreground font-semibold group-hover:text-primary transition-colors">{folder.name}</h2>
                    <p className="text-sm text-navlink">{folder.fileCount} tiedostoa</p>
                </div>
            ))}
        </div>
    );
}

export default FolderView;