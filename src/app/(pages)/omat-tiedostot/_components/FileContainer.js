import React, { useState, useEffect } from 'react'
import { getFileIcon } from '@/utils/GetFileIcon'
import { Grid, List, LockKeyhole, Share2, Trash, X } from 'lucide-react'
import Link from 'next/link'
import { getCardPreview } from '@/utils/FilePreview'
import { deleteFile, getFiles } from '@/api/api'
import { useUser } from '@clerk/nextjs'
import { useAlert } from '@/app/contexts/AlertContext'

function FileContainer({ files, setFiles }) {
    const [view, setView] = useState('grid')
    const [selectedFiles, setSelectedFiles] = useState([])
    const { user } = useUser()
    const { showAlert } = useAlert()

    const handleFileSelect = (fileID) => {
        if (selectedFiles.includes(fileID)) {
            setSelectedFiles(selectedFiles.filter((id) => id !== fileID))
        } else {
            setSelectedFiles([...selectedFiles, fileID])
        }
    }

    const handleDeleteFiles = async () => {
        await Promise.all(selectedFiles.map((file) => deleteFile(file)))
        let updatedFiles = await getFiles(user.id)
        setFiles(updatedFiles)
        showAlert('Valitut tiedostot poistettu.', 'success')
        setSelectedFiles([])
    }

    return (
        <>
        <nav className='sticky top-0 py-3 z-10 bg-background bg-opacity-75 flex items-center justify-between gap-4'>
            <div className='flex items-center gap-1'>
                <button className={`p-2 border border-contrast2 rounded-lg ${view === 'grid' && 'bg-primary text-white'}`} onClick={() => setView('grid')}><Grid size={20} /></button>
                <button className={`p-2 border border-contrast2 rounded-lg ${view === 'list' && 'bg-primary text-white'}` } onClick={() => setView('list')}><List size={20} /></button>
            </div>

            {selectedFiles.length > 0 && 
                <div className='flex items-center gap-1 text-sm'>
                    <button className='flex items-center gap-1 p-2 px-3 border border-contrast2 rounded-full group' onClick={() => setSelectedFiles([])}>
                        <X size={20} className='group-hover:text-primary' />
                        {selectedFiles.length} valittu
                    </button>
                
                    <button 
                        className='flex items-center gap-1 p-2 px-3 rounded-full bg-red-500 text-white hover:bg-red-600'
                        onClick={handleDeleteFiles}
                    >
                        <Trash size={20} className='' /> 
                        Poista
                    </button> 
                </div>
            }
        </nav>
        
        {/* No files */}
        {files.length === 0 &&
            <div className='flex items-center justify-center h-96'>
                <p className='text-lg text-navlink'>Ei tiedostoja</p>
            </div>
        }

        {/* Grid view */}
        {view === 'grid' && files.length > 0 &&
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7">
            {files.map((file) => (
                <div 
                    key={file.fileID} 
                    className={`relative flex flex-col gap-2 group overflow-hidden justify-between p-4 
                        bg-background rounded-xl border hover:shadow-black/25 hover:shadow-md 
                        ${selectedFiles.includes(file) 
                            ? 'border-primary hover:border-primary shadow-black/25 shadow-md' 
                            : 'border-transparent hover:border-contrast2'
                        }`}
                >   
                    <div className='absolute flex flex-col items-center top-0 left-0 p-2'>
                        {file.shared && <span title='Jaettu' className='text-xs p-1 text-foreground'><Share2 size={18} /></span>}
                        {file.password && <span title='Salasana suojattu' className='text-xs p-1 text-foreground'><LockKeyhole size={18} /></span>}
                    </div>
                    <div className={`absolute flex sm:group-hover:flex top-0 right-0 p-3 bg-background rounded-lg ${selectedFiles.includes(file) ? 'md:flex' : 'md:hidden'}`}>
                        <label htmlFor="file" className="sr-only">Valitse tiedosto</label>
                        <input 
                            type="checkbox" 
                            name='file' 
                            className="w-4 h-4" 
                            onChange={() => handleFileSelect(file)} 
                            checked={selectedFiles.includes(file)} 
                        />
                    </div>
                    <div className='flex h-32'>
                        {getCardPreview({ file })}
                    </div>
                    <div className='flex flex-col gap-1'>
                        <Link 
                            href={`/tiedosto/${file.fileID}`} 
                            className="text-sm font-bold hover:text-primary"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {file.fileName}
                        </Link>
                        <p className="text-sm text-navlink">{file.fileType}</p>
                    </div>
                </div>
            ))}
        </div>
        }

        {/* List view */}
        {view === 'list' && files.length > 0 &&
        <div className='flex flex-col gap-4'>
            {files.map((file) => (
                <div 
                    key={file.fileID} 
                    className={`relative flex flex-col overflow-hidden justify-between border-2 border-transparent gap-2 p-4 
                        bg-background rounded-xl shadow-black/25 shadow-md hover:border-2 ${selectedFiles.includes(file) ? 'border-primary' : 'border-transparent'}`}
                >   
                    <div className='absolute top-2 right-2'>
                        <label htmlFor="file" className="sr-only">Valitse tiedosto</label>
                        <input 
                            type="checkbox" 
                            name='file' 
                            className="w-4 h-4" 
                            onChange={() => handleFileSelect(file)} 
                            checked={selectedFiles.includes(file)} 
                        />
                    </div>
                    <img src={getFileIcon(file.fileType)} alt={file.fileName} className="w-14 h-auto" />
                    <h3 className="text-sm font-bold">{file.fileName}</h3>
                    <p className="text-sm text-navlink">{file.fileType}</p>
                </div>
            ))}
        </div>
        }
        </>
    )
}

export default FileContainer