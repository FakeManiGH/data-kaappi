import React, { useState, useEffect } from 'react'
import { getFileIcon } from '@/utils/GetFileIcon'
import { Copy, CopyCheckIcon, Grid, List, LockKeyhole, LucideSquareCheckBig, Share2, Trash, X } from 'lucide-react'
import Link from 'next/link'
import { getCardPreview } from '@/utils/FilePreview'
import { useAlert } from '@/app/contexts/AlertContext'
import { deleteFile } from '@/app/file-requests/api'
import { useNavigation } from '@/app/contexts/NavigationContext'
import { formatDateFromCollection, translateFileSize, cleanDataType } from '@/utils/DataTranslation'
import DeleteConfirmPopup from './DeleteConfirmPopup'

function FileContainer({ fileState, setFileState }) {
    const [view, setView] = useState('grid')
    const [deletePopup, setDeletePopup] = useState(false)
    const { showAlert } = useAlert()

    // Determine which files to display
    const displayFiles = fileState.searched ? fileState.searchedFiles : (fileState.filtered ? fileState.filteredFiles : fileState.files)

   // Handle file selection
   const handleFileSelect = (file) => {
        setFileState(prevState => {
            const isSelected = prevState.selectedFiles.some(selectedFile => selectedFile.fileID === file.fileID);
            const selectedFiles = isSelected
                ? prevState.selectedFiles.filter(selectedFile => selectedFile.fileID !== file.fileID)
                : [...prevState.selectedFiles, file];
                
            return {
                ...prevState,
                selectedFiles,
                selecting: true
            };
        });
    };

    // Handle delete files
    const handleDeleteFiles = async () => {
        try {
            await Promise.all(fileState.selectedFiles.map((file) => deleteFile(file)))
            // remove deleted files from state (files/filteredFiles/searchedFiles)
            setFileState(prevState => ({
                ...prevState,
                files: prevState.files.filter(file => !prevState.selectedFiles.includes(file)),
                filteredFiles: prevState.filteredFiles.filter(file => !prevState.selectedFiles.includes(file)),
                searchedFiles: prevState.searchedFiles.filter(file => !prevState.selectedFiles.includes(file)),
                selectedFiles: [],
                selecting: false
            }))
            showAlert('Valitut tiedostot poistettu.', 'success')
        } catch (error) {
            console.log("Error deleting files: ", error)
            showAlert('Tiedostojen poistaminen epäonnistui.', 'error')
        } finally {
            setDeletePopup(false)
        }
    }

    return (
        <>
        <nav className={`flex items-center flex-wrap justify-between gap-4 py-2 z-10 ${fileState.selectedFiles.length > 0 && 'sticky top-0 bg-background'}`}>
            <div className='flex items-center gap-1'>
                <button 
                    title='Ruudukko' 
                    className={`p-2 border border-contrast bg-background rounded-lg
                        ${view === 'grid' ? 'text-white bg-primary border-primary hover:text-white' : 'text-navlink border-contrast hover:border-primary hover:text-foreground'}`} 
                    onClick={() => setView('grid')}>
                        <Grid size={20} />
                </button>
                <button 
                    title='Lista' 
                    className={`p-2 border border-contrast bg-background rounded-lg 
                        ${view === 'list' ? 'text-white bg-primary border-primary hover:text-white' : 'text-navlink border-contrast hover:border-primary hover:text-foreground'}` } 
                    onClick={() => setView('list')}>
                        <List size={20} />
                </button>
                <button 
                    title='Valitse tiedostoja'
                    className={`p-2 border border-contrast bg-background rounded-lg 
                        ${fileState.selecting ? 'text-white bg-primary border-primary hover:text-white' : 'text-navlink border-contrast hover:border-primary hover:text-foreground'}` } 
                    onClick={() => setFileState(prevState => ({...prevState, selecting: !prevState.selecting, selectedFiles: prevState.selecting ? [] : prevState.selectedFiles}))}>
                        <Copy size={20} />
                </button>
                {fileState.selecting && (
                    <button
                        title='Valitse kaikki'
                        className={`p-2 border border-contrast text-navlink bg-background rounded-lg hover:text-foreground hover:border-primary
                            ${fileState.selectedFiles.length === displayFiles.length && fileState.selectedFiles.length > 0 && 'bg-primary text-white border-primary hover:text-white'}`}
                        onClick={() => setFileState(prevState => ({...prevState, selectedFiles: prevState.selectedFiles.length === displayFiles.length ? [] : displayFiles}))
                    }>
                        <CopyCheckIcon size={20} />
                    </button>
                )}
            </div>

            {fileState.selectedFiles.length > 0 && 
                <div className='flex items-center gap-1 text-sm'>
                    <button className='flex items-center gap-1 p-2 px-3 text-navlink hover:border-primary hover:text-foreground border border-contrast rounded-full group' onClick={() => setFileState(prevState => ({...prevState, selectedFiles: [], selecting: false}))}>
                        <X size={20} className='text-primary' />
                        {fileState.selectedFiles.length} valittu
                    </button>
                
                    <button 
                        className='flex items-center gap-1 p-2 px-3 rounded-full bg-red-500 text-white hover:bg-red-600'
                        onClick={() => setDeletePopup(true)}
                    >
                        <Trash size={20} className='' /> 
                        Poista
                    </button> 
                </div>
            }
        </nav>
        
        {/* No files */}
        {!fileState.files.length && (
          <div className='flex items-center justify-center h-96'>
            <p className='text-lg text-navlink'>Ei tiedostoja</p>
          </div>
        )}

        {/* Grid view */}
        {view === 'grid' && displayFiles.length > 0 &&
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-2 px-1">

            {displayFiles.map((file) => (
                <div 
                    key={file.fileID} 
                    className={`relative flex flex-col gap-2 group p-2 aspect-[1/1] bg-background overflow-hidden rounded-lg border hover:shadow-md 
                        ${fileState.selectedFiles.includes(file) 
                            ? 'border-primary hover:border-primary shadow-md' 
                            : 'border-transparent hover:border-contrast'
                        }`}
                >   
                    <div className={`absolute flex flex-col items-center bg-background rounded-lg top-0 left-0 gap-1 ${file.shared || file.password ? 'p-1' : 'p-0'}`}>
                        {file.shared && <span title='Jaettu' className='text-xs text-success'><Share2 size={18} /></span>}
                        {file.password && <span title='Salasana suojattu' className='text-xs text-success'><LockKeyhole size={18} /></span>}
                    </div>

                    <div className={`absolute group-hover:flex top-0 right-0 p-1 bg-background rounded-md ${fileState.selectedFiles.includes(file) || fileState.selecting ? 'flex' : 'hidden'}`}>
                        <label htmlFor="file" className="sr-only">Valitse tiedosto</label>
                        <input 
                            type="checkbox" 
                            name='file' 
                            className="w-4 h-4" 
                            onChange={() => handleFileSelect(file)} 
                            checked={fileState.selectedFiles.includes(file)} 
                        />
                    </div>

                    <Link 
                        className='flex flex-col h-full gap-1 justify-between hover:text-primary'
                        href={`/tiedosto/${file.fileID}`}
                        onClick={(e) => e.stopPropagation()}
                        title={file.fileName}
                    >   
                        <div className='flex justify-center h-5/6'>
                            {getCardPreview({ file })}
                        </div>
                       
                        <p className="flex h-1/6 text-sm font-semibold hover:text-primary text-ellipsis whitespace-nowrap">
                            {file.fileName}
                        </p>
                    </Link>
                </div>
            ))}
        </div>
        }

        {/* List view */}
        {view === 'list' && displayFiles.length > 0 &&
        <div className='flex flex-col gap-4 px-1'>
            {displayFiles.map((file) => (
                <div 
                    key={file.fileID} 
                    className={`relative grid grid-cols-1 md:grid-cols-2 gap-2 py-2 border-b border-contrast ${fileState.selectedFiles.includes(file) && 'border-primary'}`}
                >   
                    <div className='flex items-center gap-4 overflow-hidden'>
                        {fileState.selecting && (
                        <>
                            <label htmlFor="file" className="sr-only">Valitse tiedosto</label>
                            <input 
                                type="checkbox" 
                                name='file' 
                                className="w-4 h-4 p-2" 
                                onChange={() => handleFileSelect(file)} 
                                checked={fileState.selectedFiles.includes(file)}
                            />
                        </>)}
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
                        {file.shared && <p title='Jaettu' className='text-xs text-success'><Share2 size={18} /></p>}
                        {file.password && <p title='Salasana suojattu' className='text-xs text-success'><LockKeyhole size={18} /></p>}
                        <p className='text-sm whitespace-nowrap text-navlink'>{formatDateFromCollection(file.uploadedAt)}</p>
                        <p className="text-sm whitespace-nowrap text-navlink">{cleanDataType(file.fileType)}</p>
                        <p className="text-sm whitespace-nowrap text-navlink">{translateFileSize(file.fileSize)}</p>
                    </div>
                </div>
            ))}
        </div>
        }
        {deletePopup && 
            <DeleteConfirmPopup 
                selectedFiles={fileState.selectedFiles} 
                handleDeleteFiles={handleDeleteFiles}
                setDeletePopup={setDeletePopup}
            />
        }

        </>
    )
}

export default FileContainer