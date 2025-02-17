import React, { useState, useEffect } from 'react'
import { getFileIcon } from '@/utils/GetFileIcon'
import { Grid, List, LockKeyhole, Share2, Trash, X } from 'lucide-react'
import Link from 'next/link'
import { getCardPreview } from '@/utils/FilePreview'
import { deleteFile, getFiles } from '@/api/api'
import { useUser } from '@clerk/nextjs'
import { useAlert } from '@/app/contexts/AlertContext'
import { useNavigation } from '@/app/contexts/NavigationContext'
import { formatDateFromCollection, translateFileSize, cleanDataType } from '@/utils/DataTranslation'
import { set } from 'date-fns'

function FileContainer({ files, setFiles }) {
    const [loading, setLoading] = useState(false)
    const [view, setView] = useState('grid')
    const [selectedFiles, setSelectedFiles] = useState([])
    const { user } = useUser()
    const { showAlert } = useAlert()
    const { setCurrentIndex } = useNavigation()

    const handleFileSelect = (fileID) => {
        if (selectedFiles.includes(fileID)) {
            setSelectedFiles(selectedFiles.filter((id) => id !== fileID))
        } else {
            setSelectedFiles([...selectedFiles, fileID])
        }
    }

    const handleDeleteFiles = async () => {
        try {
            setLoading(true)
            await Promise.all(selectedFiles.map((file) => deleteFile(file)))
            let updatedFiles = await getFiles(user.id)
            setFiles(updatedFiles)
            showAlert('Valitut tiedostot poistettu.', 'success')
        } catch (error) {
            showAlert('Tiedostojen poistaminen epäonnistui.', 'error')
        } finally {
            setLoading(false)
            setSelectedFiles([])
        }
    }

    if (loading) return <PageLoading />

    return (
        <>
        <nav className={`flex items-center justify-between gap-4 py-2 z-10 bg-background bg-opacity-75 ${selectedFiles.length > 0 && 'sticky top-0'}`}>
            <div className='flex items-center gap-1'>
                <button className={`p-2 border border-contrast2 rounded-lg ${view === 'grid' && 'bg-primary text-white border-primary'}`} onClick={() => setView('grid')}><Grid size={20} /></button>
                <button className={`p-2 border border-contrast2 rounded-lg ${view === 'list' && 'bg-primary text-white border-primary'}` } onClick={() => setView('list')}><List size={20} /></button>
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
                    className={`relative flex flex-col gap-2 group p-2 overflow-hidden
                        bg-background rounded-xl border hover:shadow-black/25 hover:shadow-md 
                        ${selectedFiles.includes(file) 
                            ? 'border-primary hover:border-primary shadow-black/25 shadow-md' 
                            : 'border-transparent hover:border-contrast2'
                        }`}
                >   
                    <div className={`absolute flex flex-col items-center bg-background rounded-lg top-0 left-0 gap-1 ${file.shared || file.password ? 'p-2' : 'p-0'}`}>
                        {file.shared && <span title='Jaettu' className='text-xs text-success'><Share2 size={18} /></span>}
                        {file.password && <span title='Salasana suojattu' className='text-xs text-success'><LockKeyhole size={18} /></span>}
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
        {view === 'list' && files.length > 0 &&
        <div className='flex flex-col gap-4'>
            {files.map((file) => (
                <div 
                    key={file.fileID} 
                    className={`relative grid grid-cols-1 md:grid-cols-2 gap-2 py-2 bg-background border-b border-contrast2 ${selectedFiles.includes(file) && 'border-primary'}`}
                >   
                    <div className='flex items-center gap-4 overflow-hidden'>
                        <label htmlFor="file" className="sr-only">Valitse tiedosto</label>
                        <input 
                            type="checkbox" 
                            name='file' 
                            className="w-4 h-4 p-2" 
                            onChange={() => handleFileSelect(file)} 
                            checked={selectedFiles.includes(file)} 
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
        </>
    )
}

export default FileContainer