import React, { useState, useEffect, useRef, use } from 'react';
import { getFileIcon } from '@/utils/GetFileIcon';
import { Grid, List, LockKeyhole, Share2 } from 'lucide-react';
import Link from 'next/link';
import { getCardPreview } from '@/utils/FilePreview';
import { useAlert } from '@/app/contexts/AlertContext';
import { translateFileSize, cleanDataType } from '@/utils/DataTranslation';
import DeleteConfirmPopup from './DeleteConfirmPopup';
import { useUser } from '@clerk/nextjs';

function FileContainer({ fileState, setFileState }) {
    const [deletePopup, setDeletePopup] = useState(false);
    const { showAlert } = useAlert();
    const { user } = useUser();

    // Determine which files to display
    const displayFiles = fileState.searched ? fileState.searchedFiles 
                      : fileState.filtered ? fileState.filteredFiles 
                      : fileState.sorted ? fileState.sortedFiles 
                      : fileState.files;
                      

    return (
        <>
        {/* No files */}
        {!fileState.files.length && (
          <div className='flex items-center justify-center h-96'>
            <p className='text-lg text-navlink'>Ei tiedostoja</p>
          </div>
        )}

        {/* Grid view */}
        {fileState.view === 'grid' && displayFiles.length > 0 &&
        <div className="masonry-grid">
            {displayFiles.map((file) => (
                <div 
                    key={file.id} 
                    className='masonry-item bg-background group'
                >   
                    <div className={`absolute flex flex-col items-center bg-background rounded-lg top-0 left-0 gap-1 ${file.shared || file.password ? 'p-1' : 'p-0'}`}>
                        {file.shared && <span title='Jaettu' className='text-xs text-success'><Share2 size={18} /></span>}
                        {file.password && <span title='Salasana suojattu' className='text-xs text-success'><LockKeyhole size={18} /></span>}
                    </div>

                    <Link 
                        className='flex flex-col gap-1 hover:text-primary'
                        href={`/tiedosto/${file.id}`}
                        onClick={(e) => e.stopPropagation()}
                        title={file.name}
                    >   
                        <div className='align-middle'>
                            {getCardPreview({ file })}
                        </div>
                       
                        <p className="flex text-sm font-semibold hover:text-primary text-ellipsis whitespace-nowrap">
                            {file.name}
                        </p>
                    </Link>
                </div>
            ))}
        </div>
        }

        {/* List view */}
        {fileState.view === 'list' && displayFiles.length > 0 &&
        <div className='flex flex-col gap-4 px-1'>
            {displayFiles.map((file) => (
                <div 
                    key={file.id} 
                    className='relative grid grid-cols-1 md:grid-cols-2 gap-2 py-2 border-b border-contrast transition-colors'
                >   
                    <div className='flex items-center gap-4 overflow-hidden'>
                        <img src={getFileIcon(file.type)} alt={file.name} className="w-7 h-auto" />
                        <Link 
                            href={`/tiedosto/${file.id}`} 
                            className="text-sm font-semibold hover:text-primary truncate-2-row text-ellipsis"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {file.name}
                        </Link>
                    </div>
                    <div className='flex items-center gap-3 justify-start md:justify-end'>
                        {file.shared && <p title='Jaettu' className='text-xs text-success'><Share2 size={18} /></p>}
                        {file.password && <p title='Salasana suojattu' className='text-xs text-success'><LockKeyhole size={18} /></p>}
                        <p className='text-sm whitespace-nowrap text-navlink'>{file.uploaded}</p>
                        <p className="text-sm whitespace-nowrap text-navlink">{cleanDataType(file.type)}</p>
                        <p className="text-sm whitespace-nowrap text-navlink">{translateFileSize(file.size)}</p>
                    </div>
                </div>
            ))}
        </div>
        }
        </>
    );
}

export default FileContainer;