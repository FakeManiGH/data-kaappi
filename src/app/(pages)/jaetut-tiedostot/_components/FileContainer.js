import React, { useState, useEffect } from 'react'
import { getFileIcon } from '@/utils/GetFileIcon'
import { Grid, List, LockKeyhole, LucideSquareCheckBig, Share2, Trash, X } from 'lucide-react'
import Link from 'next/link'
import { getSharedCardPreview } from '@/utils/FilePreview'
import { formatDateFromCollection, translateFileSize, cleanDataType } from '@/utils/DataTranslation'

function FileContainer({ fileState }) {
    const [view, setView] = useState('grid')

    // Determine which files to display
    const displayFiles = fileState.searched ? fileState.searchedFiles : (fileState.filtered ? fileState.filteredFiles : fileState.files)

    return (
        <>
        <nav className='flex items-center gap-1 py-2'>
            <button className={`p-3 border border-contrast bg-background rounded-full ${view === 'grid' ? 'text-white bg-primary border-primary hover:text-white' : 'text-navlink border-contrast hover:border-primary hover:text-foreground'}`} onClick={() => setView('grid')}><Grid size={20} /></button>
            <button className={`p-3 border border-contrast bg-background rounded-full ${view === 'list' ? 'text-white bg-primary border-primary hover:text-white' : 'text-navlink border-contrast hover:border-primary hover:text-foreground'}` } onClick={() => setView('list')}><List size={20} /></button>
        </nav>
        
        {/* No files */}
        {!fileState.files.length && (
          <div className='flex items-center justify-center h-96'>
            <p className='text-lg text-navlink'>Ei tiedostoja</p>
          </div>
        )}

        {/* Grid view */}
        {view === 'grid' && displayFiles.length > 0 &&
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-8 gap-2 px-1">

            {displayFiles.map((file) => (
                <div 
                    key={file.fileID} 
                    className='relative flex flex-col gap-2 group p-2 aspect-[1/1] bg-background overflow-hidden rounded-lg 
                    border border-transparent hover:border-contrast hover:shadow-md'
                >   
                    <div className={`absolute flex flex-col items-center bg-background rounded-lg top-0 left-0 gap-1 ${file.password ? 'p-1' : 'p-0'}`}>
                        {file.password && <span title='Salasana suojattu' className='text-xs text-success'><LockKeyhole size={18} /></span>}
                    </div>

                    <Link 
                        className='flex flex-col h-full gap-1 justify-between hover:text-primary'
                        href={`/tiedosto/${file.fileID}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='flex flex-col h-5/6'>
                            {getSharedCardPreview({ file })}
                        </div>
                        <div className='flex flex-col justify-center h-1/6 text-sm font-semibold hover:text-primary group-hover:text-primary'>
                            <p className="text-sm font-semibold whitespace-nowrap text-ellipsis">{file.fileName}</p>
                            <p className='text-xs text-navlink group-hover:text-primary'>{file.uploadedBy}</p>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
        }

        {/* List view */}
        {view === 'list' && displayFiles.length > 0 &&
        <div className='flex flex-col gap-4'>
            {displayFiles.map((file) => (
                <div 
                    key={file.fileID} 
                    className='relative grid grid-cols-1 md:grid-cols-2 gap-2 py-2 bg-background border-b border-contrast'
                >   
                    <div className='flex items-center gap-4 overflow-hidden'>
                        <img src={getFileIcon(file.fileType)} alt={file.fileName} className="w-7 h-auto" />
                        <Link 
                            href={`/tiedosto/${file.fileID}`} 
                            className="text-sm font-semibold hover:text-primary truncate-2-row text-ellipsis"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {file.fileName}
                        </Link>
                    </div>
                    <div className='flex items-center gap-3 justify-start md:justify-end'>
                        {file.password && <p title='Salasana suojattu' className='text-xs text-success'><LockKeyhole size={18} /></p>}
                        <p className='text-sm whitespace-nowrap text-navlink'>{formatDateFromCollection(file.uploadedAt)}</p>
                        <p className="text-sm whitespace-nowrap text-navlink">{cleanDataType(file.fileType)}</p>
                        <p className="text-sm whitespace-nowrap text-navlink">{translateFileSize(file.fileSize)}</p>
                    </div>
                </div>
            ))}
        </div>
        }
        </>
    )
}

export default FileContainer