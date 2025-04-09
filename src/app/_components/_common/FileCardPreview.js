import React, { useState } from 'react'
import { getFileIcon } from '@/utils/GetFileIcon'
import { Play, X } from 'lucide-react'

function FileCardPreview({ file }) {
    const [previewPopup, setPreviewPopup] = useState(false);

    const handleOpenPopup = () => {
        setPreviewPopup(true);
    };

    const handleClosePopup = () => {
        setPreviewPopup(false);
    };

    if (file.type.includes('image')) {
        return (
            <>
            <img 
                src={file.url} 
                alt={file.name} 
                className='aspect-[4/3] h-20 object-cover rounded-md mb-1 cursor-pointer' 
                onClick={handleOpenPopup}
            />

            {previewPopup && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-1'>
                    <div className='relative max-w-3xl max-h-screen'>
                        <button
                            onClick={handleClosePopup}
                            className='absolute top-2 right-2 p-1 text-white bg-red-500 rounded-full hover:bg-red-600'
                            title='Sulje'
                        >
                            <X />
                        </button>
            
                        <img
                            src={file.url}
                            className='object-contain rounded-md max-h-screen'
                        />
                    </div>   
                </div>
            )}
            </>
        )
    } else if (file.type.includes('video')) {
        return (
            <>
                <div className='relative aspect-[4/3] h-20 object-cover mb-1'>
                    <video
                        src={file.url}
                        alt={file.name}
                        className='h-full w-full object-cover rounded-md'
                    />
                    <button 
                        onClick={handleOpenPopup}
                        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 text-white bg-primary/75 hover:bg-primary 
                            transition-colors rounded-full'
                    >
                        <Play />
                    </button>
                </div>

                {previewPopup && (
                    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/75'>
                        <div className='relative w-full'>
                            <video
                                src={file.url}
                                controls
                                autoPlay
                                className='w-full h-auto max-h-screen rounded-md'
                            />
                            <button
                                onClick={handleClosePopup}
                                className='absolute top-2 right-2 p-2 text-white bg-red-500 rounded-full hover:bg-red-600'
                                title='Sulje'
                            >
                                <X />
                            </button>
                        </div>
                    </div>
                )}
            </>
        )
    } else {
        return (
            <img 
                src={getFileIcon(file.type)} 
                alt={file.name} 
                className='h-20 rounded-md mb-1' 
            />
        )
    }
}

export default FileCardPreview