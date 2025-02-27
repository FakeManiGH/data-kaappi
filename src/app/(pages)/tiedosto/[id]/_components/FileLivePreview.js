import React, { useState } from 'react'
import { X, ZoomIn, ZoomOut } from 'lucide-react'
import { getFullSizePreview } from '@/utils/FilePreview'

function FileLivePreview({ file, setLivePreview }) {
    const [zoom, setZoom] = useState(1);

    const increaseZoom = () => {
        setZoom((prevZoom) => Math.min(prevZoom + 0.1, 2)); // Set max zoom to 2
    }

    const decreaseZoom = () => {
        setZoom((prevZoom) => Math.max(prevZoom - 0.1, 1)); // Set min zoom to 1
    }

    return (
        <>
        <span onClick={() => setLivePreview(false)} className='fixed inset-0 z-50 bg-black/50'></span>
        <div className="fixed z-50 flex flex-col gap-4 p-4 inset-2 rounded-lg bg-gradient-to-br from-background to-contrast" >
            <div className="realtive flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold">{file?.fileName}</h2>
                <button onClick={() => setLivePreview(false)} className="p-1 text-white bg-red-500 hover:bg-red-600 rounded-full">
                    <X size={20} />
                </button>
            </div>

            <div className="relative flex h-full w-full gap-4 items-center justify-center overflow-auto">
                {file?.fileType.includes('image') && (
                    <div className="fixed top-20 z-50 flex items-center gap-1">
                        <button onClick={increaseZoom} className='p-2 bg-gray-600/50 text-white rounded-md hover:text-primary focus:text-primary'><ZoomIn size={24} /></button>
                        <button onClick={decreaseZoom} className='p-2 bg-gray-600/50 text-white rounded-md hover:text-primary focus:text-primary'><ZoomOut size={24} /></button>
                        <p className='text-md p-2 bg-gray-600/50 text-white rounded-md'>{Math.round(zoom * 100)}%</p>   
                    </div>
                )}

                {file?.fileType.includes('image') && (
                    <div className="flex items-center justify-center overflow-auto h-full w-full ">
                        <img src={file.fileUrl} alt={file.fileName} style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }} />
                    </div>
                )}

                {file?.fileType.includes('video') && (
                    <video src={file.fileUrl} controls className="h-full w-full" />
                )}

                {file?.fileType.includes('audio') && (
                    <div className='flex flex-col gap-2 items-center'>
                        <img src='/icons/audio.png' alt='Audio PNG illustration' className="h-full w-full" />
                        <audio src={file.fileUrl} controls className="h-full w-full rounded-lg" />
                    </div>
                )}

                {file?.fileType.includes('pdf') && (
                    <iframe src={file.fileUrl} className="h-full w-full" />
                )}

                {file?.fileType.includes('text') && (
                    <pre className="text-sm text-white">{file.fileContent}</pre>
                )}
            </div>
        </div>
        </>
    )
}

export default FileLivePreview