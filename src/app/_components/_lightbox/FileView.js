import { returnGeneralFiletype } from '@/utils/DataTranslation'
import React from 'react'

function FileView({ file }) {
    if (!file || !file.type || !file.url) {
        return (
            <div className="flex items-center justify-center h-full p-4 bg-secondary text-red-500">
                <p><strong>Virhe:</strong> Tiedoston esikatselu ei ole saatavilla.</p>
            </div>
        );
    }

    const type = returnGeneralFiletype(file.type)

    return (
        <>
            {type === 'image' && (
                <img
                    src={file.url}
                    alt={file.name || 'Image preview'}
                    className="h-full w-full object-contain  "
                />
            )}

            {type === 'video' && (
                <video
                    src={file.url}
                    controls
                    className="h-full w-full object-contain  bg-black"
                />
            )}

            {type === 'audio' && (
                <div className='flex flex-col w-full h-full max-w-3xl object-contain justify-center items-center'>
                    <div className='flex items-center justify-center p-2 pb-0  rounded-b-none w-full h-full bg-secondary'>
                        <img src='icons/audio.png' alt={file.name} className='w-full h-full max-h-44 object-contain'/>
                    </div>
                    <audio
                        src={file.url}
                        controls
                        className="w-full  rounded-t-none"
                    >
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}

            {type === 'pdf' && (
                <iframe
                    src={file.url}
                    title={file.name || 'Document preview'}
                    className="h-[600px] w-full  shadow-lg shadow-black/25"
                />
            )}

            {type === 'document' && (
                <div className="flex flex-col items-center justify-center h-full w-full text-center py-2">
                    <img src='/icons/file.png' alt='file illustration' className='h-16 w-16' />
                    <p>Tiedostotyyppille ei ole esikatselua.</p>
                </div>
            )}
        </>
    );
}

export default FileView