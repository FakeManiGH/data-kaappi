import React, { useState, useEffect, useRef, use } from 'react';
import { getFileIcon } from '@/utils/GetFileIcon';
import { Copy, CopyCheckIcon, Grid, List, LockKeyhole, Share2, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { getCardPreview } from '@/utils/FilePreview';
import { useAlert } from '@/app/contexts/AlertContext';
import { formatDateFromCollection, translateFileSize, cleanDataType } from '@/utils/DataTranslation';
import DeleteConfirmPopup from './DeleteConfirmPopup';
import { useUser } from '@clerk/nextjs';

function FileContainer({ fileState, setFileState }) {
    const [view, setView] = useState('grid');
    const [deletePopup, setDeletePopup] = useState(false);
    const { showAlert } = useAlert();
    const { user } = useUser();

    useEffect(() => {
        if (fileState.selectedFiles.length === 0) {
            setFileState(prevState => ({...prevState, selecting: false}));
        }
    }, [fileState.selectedFiles]);

    // Determine which files to display
    const displayFiles = fileState.searched ? fileState.searchedFiles 
                      : fileState.filtered ? fileState.filteredFiles 
                      : fileState.sorted ? fileState.sortedFiles 
                      : fileState.files;
                      
    // Handle file selection
    const handleFileSelect = (file) => {
        setFileState(prevState => {
            const isSelected = prevState.selectedFiles.some(selectedFile => selectedFile.id === file.id);
            const selectedFiles = isSelected
                ? prevState.selectedFiles.filter(selectedFile => selectedFile.id !== file.id)
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
            const response = await fetch('/api/delete-files', {
                method: 'DELETE',
                body: JSON.stringify({ userID: user.id, files: fileState.selectedFiles }), 
            });

            const data = await response.json();
            if (response.ok) {
                showAlert(data.message, 'success');
            } else {
                showAlert(data.message, 'error');
            }
            // remove deleted files from state (files/filteredFiles/searchedFiles)
            setFileState(prevState => ({
                ...prevState,
                files: prevState.files.filter(file => !prevState.selectedFiles.includes(file)),
                filteredFiles: prevState.filteredFiles.filter(file => !prevState.selectedFiles.includes(file)),
                searchedFiles: prevState.searchedFiles.filter(file => !prevState.selectedFiles.includes(file)),
                selectedFiles: [],
                selecting: false
            }));
        } catch (error) {
            console.error('Error deleting files:', error);
            showAlert('Palvelinvirhe! Yritä uudelleen.', 'error');
        } finally {
            setDeletePopup(false);
        }
    };

    return (
        <>
        <nav className={`flex items-center flex-wrap justify-between gap-2 py-2 z-10 ${fileState.selectedFiles.length > 0 && 'sticky top-0 bg-background'}`}>
            <div className='flex items-center gap-1'>
                <button 
                    title='Ruudukko' 
                    className={`p-3 border-2 border-contrast rounded-full
                        ${view === 'grid' ? 'bg-primary text-white border-primary' : 'text-foreground bg-transparent hover:bg-primary hover:border-primary hover:text-white'}` } 
                    onClick={() => setView('grid')}>
                        <Grid size={20} />
                </button>
                <button 
                    title='Lista' 
                    className={`p-3 border-2 border-contrast rounded-full 
                        ${view === 'list' ? 'bg-primary text-white border-primary' : 'text-foreground bg-transparent hover:bg-primary hover:border-primary hover:text-white'}` } 
                    onClick={() => setView('list')}>
                        <List size={20} />
                </button>
                <button 
                    title='Valitse tiedostoja'
                    className={`p-3 border-2 border-contrast rounded-full 
                        ${fileState.selecting ? 'bg-primary text-white border-primary' : 'text-foreground bg-transparent hover:bg-primary hover:border-primary hover:text-white'}` } 
                    onClick={() => setFileState(prevState => ({...prevState, selecting: !prevState.selecting, selectedFiles: prevState.selecting ? [] : prevState.selectedFiles}))}>
                        <Copy size={20} />
                </button>
                {fileState.selecting && (
                    <button
                        title='Valitse kaikki'
                        className={`p-3 border-2 border-contrast text-foreground rounded-full hover:text-white hover:border-primary hover:bg-primary
                            ${fileState.selectedFiles.length === displayFiles.length && fileState.selectedFiles.length > 0 && 'bg-primary text-white border-primary'}`}
                        onClick={() => setFileState(prevState => ({...prevState, selectedFiles: prevState.selectedFiles.length === displayFiles.length ? [] : displayFiles}))}
                    >
                        <CopyCheckIcon size={20} />
                    </button>
                )}
            </div>

            {fileState.selectedFiles.length > 0 && 
                <div className='flex items-center gap-1 text-sm'>
                    <button 
                        className='flex items-center gap-1 px-3 py-2 text-foreground border-2 border-contrast hover:bg-primary hover:border-primary hover:text-white rounded-full group' 
                        onClick={() => setFileState(prevState => ({...prevState, selectedFiles: [], selecting: false}))}
                        title='Peruuta valinta'
                    >
                        <X size={25} />
                        {fileState.selectedFiles.length} valittu
                    </button>
                
                    <button 
                        className='flex items-center gap-1 p-3 text-white text-sm border border-red-500 rounded-full bg-red-500  hover:bg-red-600'
                        onClick={() => setDeletePopup(true)}
                        title='Poista valitut tiedostot'
                    >
                        <Trash2 size={20} className='' /> 
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
        <div className="masonry-grid">

            {displayFiles.map((file) => (
                <div 
                    key={file.id} 
                    className={`masonry-item bg-background group border rounded-lg transition-colors
                        ${fileState.selectedFiles.includes(file) 
                            ? 'border-primary shadow-md' 
                            : 'border-transparent'
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
        {view === 'list' && displayFiles.length > 0 &&
        <div className='flex flex-col gap-4 px-1'>
            {displayFiles.map((file) => (
                <div 
                    key={file.id} 
                    className={`relative grid grid-cols-1 md:grid-cols-2 gap-2 py-2 border-b border-navlink ${fileState.selectedFiles.includes(file) && 'border-primary'}`}
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
                        <p className='text-sm whitespace-nowrap text-navlink'>{formatDateFromCollection(file.uploadedAt)}</p>
                        <p className="text-sm whitespace-nowrap text-navlink">{cleanDataType(file.type)}</p>
                        <p className="text-sm whitespace-nowrap text-navlink">{translateFileSize(file.size)}</p>
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
    );
}

export default FileContainer;