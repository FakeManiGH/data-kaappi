import { getFileIcon } from '@/utils/GetFileIcon';
import React from 'react'

function FileBrowsePreview({ file }) {
    if (file.type.includes('image')) {
        return (
            <img src={file.url} alt={file.name} style={{height: '100%', width: '100%', objectFit: 'contain'}} />
        );
    } else if (file.type.includes('video')) {
        return (
            <video src={file.url} style={{height: '100%', width: '100%', objectFit: 'contain'}} controls />
        );
    } else if (file.type.includes('audio')) {
        return (
            <>
            <img 
                src='/icons/audio.png' 
                alt='Audio PNG illustration' 
                className='bg-secondary p-2'
                style={{height: '100%', width: '100%', maxHeight: '200px', objectFit: 'contain' }} 
            />
            <audio
                src={file.url}
                about={file.name}
                controls
                className='w-full'
            />
            </>
        );
    } else {
        return (
            <div className='flex flex-col gap-2 items-center justify-center w-full h-full min-h-64 object-contain'>
                <img src={getFileIcon(file.type)} alt={file.name} />
                <p className='text-base'>Tiedostolle ei ole saatavilla esikatselua.</p>
            </div>
        );
    }
}

export default FileBrowsePreview