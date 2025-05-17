import { returnGeneralFiletype } from '@/utils/DataTranslation';
import React from 'react';

function FilePagePreview({ file }) {
    if (!file || !file.type || !file.url) {
        return (
            <div className="flex items-center justify-center h-full p-4 bg-secondary text-red-500">
                <p><strong>Virhe:</strong> Tiedoston esikatselu ei ole saatavilla.</p>
            </div>
        );
    }

    const type = returnGeneralFiletype(file.type);

    return (
        <div className="flex flex-col items-center justify-center max-h-[800px] py-2 overflow-hidden">
            {type === 'image' && (
                <img
                    src={file.url}
                    alt={file.name || 'Image preview'}
                    className="h-full w-auto object-contain  "
                />
            )}

            {type === 'video' && (
                <video
                    src={file.url}
                    controls
                    className="h-full w-auto object-contain  shadow-lg shadow-black/25"
                />
            )}

            {type === 'audio' && (
                <audio
                    src={file.url}
                    controls
                    className="w-full"
                >
                    Your browser does not support the audio element.
                </audio>
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
        </div>
    );
}

export default FilePagePreview;