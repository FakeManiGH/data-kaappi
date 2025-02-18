import React, { useState, useEffect } from 'react'
import { getFileIcon } from '@/utils/GetFileIcon'
import { Grid, List, LockKeyhole, LucideSquareCheckBig, Share2, Trash, X } from 'lucide-react'
import Link from 'next/link'
import { getCardPreview } from '@/utils/FilePreview'
import { useAlert } from '@/app/contexts/AlertContext'
import { deleteFile, getFiles } from '@/api/api'
import { useNavigation } from '@/app/contexts/NavigationContext'
import { formatDateFromCollection, translateFileSize, cleanDataType } from '@/utils/DataTranslation'
import DeleteConfirmPopup from './DeleteConfirmPopup'
import PageLoading from '@/app/_components/_common/PageLoading'

function FileContainer({ fileState, setFileState }) {
    const [view, setView] = useState('grid')
    const [deletePopup, setDeletePopup] = useState(false)
    const { setCurrentIndex } = useNavigation()
    const { showAlert } = useAlert()

    // Determine which files to display
    const displayFiles = fileState.searched ? fileState.searchedFiles : (fileState.filteredFiles.length > 0 ? fileState.filteredFiles : fileState.files)

    // Handle file selection
    const handleFileSelect = (fileID) => {
        setFileState(prevState => {
            const isSelected = prevState.selectedFiles.includes(fileID)
            const selectedFiles = isSelected
                ? prevState.selectedFiles.filter(file => file !== fileID)
                : [...prevState.selectedFiles, fileID]

            return {
                ...prevState,
                selectedFiles,
                selecting: true
            }
        })
    }

    // Handle delete files
    const handleDeleteFiles = async () => {
        try {
            await Promise.all(fileState.selectedFiles.map((fileID) => deleteFile(fileID)))
            // remove deleted files from state (files/filteredFiles/searchedFiles)
            setFileState(prevState => ({
                ...prevState,
                files: prevState.files.filter(file => !prevState.selectedFiles.includes(file.fileID)),
                filteredFiles: prevState.filteredFiles.filter(file => !prevState.selectedFiles.includes(file.fileID)),
                searchedFiles: prevState.searchedFiles.filter(file => !prevState.selectedFiles.includes(file.fileID)),
                selectedFiles: []
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
        <nav className={`flex items-center justify-between gap-4 py-2 z-10 bg-background bg-opacity-75 ${fileState.selectedFiles.length > 0 && 'sticky top-0'}`}>
            <div className='flex items-center gap-1'>
                <button className={`p-2 border border-contrast2 rounded-lg ${view === 'grid' && 'bg-primary text-white border-primary'}`} onClick={() => setView('grid')}><Grid size={20} /></button>
                <button className={`p-2 border border-contrast2 rounded-lg ${view === 'list' && 'bg-primary text-white border-primary'}` } onClick={() => setView('list')}><List size={20} /></button>
                <button 
                    className={`p-2 border border-contrast2 rounded-lg ${fileState.selecting && 'bg-primary text-white border-primary'}` } 
                    onClick={() => setFileState(prevState => ({...prevState, selecting: !prevState.selecting, selectedFiles: prevState.selecting ? [] : prevState.selectedFiles}))}>
                        <LucideSquareCheckBig size={20} />
                </button>
            </div>

            {fileState.selectedFiles.length > 0 && 
                <div className='flex items-center gap-1 text-sm'>
                    <button className='flex items-center gap-1 p-2 px-3 border border-contrast2 rounded-full group' onClick={() => setFileState(prevState => ({...prevState, selectedFiles: [], selecting: false}))}>
                        <X size={20} className='group-hover:text-primary' />
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7">

            {displayFiles.map((file) => (
                <div 
                    key={file.fileID} 
                    className={`relative flex flex-col gap-2 group p-2 overflow-hidden
                        bg-background rounded-xl border hover:shadow-black/25 hover:shadow-md 
                        ${fileState.selectedFiles.includes(file.fileID) 
                            ? 'border-primary hover:border-primary shadow-black/25 shadow-md' 
                            : 'border-transparent hover:border-contrast2'
                        }`}
                >   
                    <div className={`absolute flex flex-col items-center bg-background rounded-lg top-0 left-0 gap-1 ${file.shared || file.password ? 'p-2' : 'p-0'}`}>
                        {file.shared && <span title='Jaettu' className='text-xs text-success'><Share2 size={18} /></span>}
                        {file.password && <span title='Salasana suojattu' className='text-xs text-success'><LockKeyhole size={18} /></span>}
                    </div>

                    <div className={`absolute group-hover:flex top-0 right-0 p-2 bg-background rounded-lg ${fileState.selectedFiles.includes(file.fileID) || fileState.selecting ? 'flex' : 'hidden'}`}>
                        <label htmlFor="file" className="sr-only">Valitse tiedosto</label>
                        <input 
                            type="checkbox" 
                            name='file' 
                            className="w-4 h-4" 
                            onChange={() => handleFileSelect(file.fileID)} 
                            checked={fileState.selectedFiles.includes(file.fileID)} 
                        />
                    </div>

                    <Link 
                        className='flex flex-col gap-2 object-contain hover:text-primary'
                        href={`/tiedosto/${file.fileID}`}
                        onClick={(e) => {e.stopPropagation(), setCurrentIndex(`/tiedosto/${file.fileID}`)}}
                    >
                        {getCardPreview({ file })}
                        <p className="text-sm font-semibold hover:text-primary whitespace-wrap">
                            {file.fileName}
                        </p>
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
                    className={`relative grid grid-cols-1 md:grid-cols-2 gap-2 py-2 bg-background border-b border-contrast2 ${fileState.selectedFiles.includes(file.fileID) && 'border-primary'}`}
                >   
                    <div className='flex items-center gap-4 overflow-hidden'>
                        <label htmlFor="file" className="sr-only">Valitse tiedosto</label>
                        <input 
                            type="checkbox" 
                            name='file' 
                            className="w-4 h-4 p-2" 
                            onChange={() => handleFileSelect(file.fileID)} 
                            checked={fileState.selectedFiles.includes(file.fileID)} 
                        />
                        <img src={getFileIcon(file.fileType)} alt={file.fileName} className="w-7 h-auto" />
                        <Link 
                            href={`/tiedosto/${file.fileID}`} 
                            className="text-sm font-bold hover:text-primary truncate-2-row text-ellipsis"
                            onClick={(e) => {e.stopPropagation(), setCurrentIndex(`/tiedosto/${file.fileID}`)}}
                        >
                            {file.fileName}
                        </Link>
                    </div>
                    <div className='flex items-center gap-3 justify-start md:justify-end'>
                        {file.shared && <p title='Jaettu' className='text-xs text-success'><Share2 size={18} /></p>}
                        {file.password && <p title='Salasana suojattu' className='text-xs text-success'><LockKeyhole size={18} /></p>}
                        <p className='text-sm whitespace-nowrap text-navlink'>{formatDateFromCollection(file.createdAt)}</p>
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