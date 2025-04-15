import React, { useState } from 'react'
import { X, ZoomIn, ZoomOut } from 'lucide-react'

function FileLivePreview({ file, setLivePreview }) {
    const [zoom, setZoom] = useState(1);

    const increaseZoom = () => {
        setZoom((prevZoom) => Math.min(prevZoom + 0.1, 2)); // Set max zoom to 2
    }

    const decreaseZoom = () => {
        setZoom((prevZoom) => Math.max(prevZoom - 0.1, 1)); // Set min zoom to 1
    }

    return (
        <div className="fixed z-50 flex flex-col gap-4 p-4 inset-0 bg-gradient-to-br from-background to-contrast" >
            <div className="realtive flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold">{file.name}</h2>
                <button onClick={() => setLivePreview(false)} className="p-2 text-white bg-red-500 hover:bg-red-600">
                    <X size={20} />
                </button>
            </div>

            <div className="relative flex h-full w-full gap-4 items-center justify-center overflow-auto">
                {file.type.includes('image') && (
                    <div className="fixed top-20 z-50 flex items-center gap-1">
                        <button onClick={increaseZoom} className='p-2 bg-gray-600/50 text-white rounded-md hover:text-primary focus:text-primary'><ZoomIn size={24} /></button>
                        <button onClick={decreaseZoom} className='p-2 bg-gray-600/50 text-white rounded-md hover:text-primary focus:text-primary'><ZoomOut size={24} /></button>
                        <p className='text-md p-2 bg-gray-600/50 text-white rounded-md'>{Math.round(zoom * 100)}%</p>   
                    </div>
                )}

                {file.type.includes('image') && (
                    <div className="flex items-center justify-center overflow-auto h-full w-full ">
                        <img src={file.url} alt={file.name} style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }} />
                    </div>
                )}

                {file.type.includes('video') && (
                    <video src={file.url} controls className="h-full w-full" />
                )}

                {file.type.includes('audio') && (
                    <div className='flex flex-col gap-2 items-center'>
                        <img src='/icons/audio.png' alt='Audio PNG illustration' className="h-full w-full" />
                        <audio src={file.url} controls className="h-full w-full rounded-lg" />
                    </div>
                )}

                {file.type.includes('pdf') && (
                    <iframe src={file.url} className="h-full w-full" />
                )}

                {file.type.includes('text') && (
                    <pre className="text-sm text-white">{file.fileContent}</pre>
                )}

                {/* if file is not image, video, audio, pdf or text*/}
                {file.type.includes('application') && !file.type.includes('pdf') && (
                    <div className="flex items-center justify-center gap-4">
                        <img src='/icons/file.png' alt={file.name} className="h-20 w-20" />
                        <p className="text-xl text-white">Tiedostotyyppiä ei voida esikatsella</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FileLivePreview