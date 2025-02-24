import React, { useState } from 'react'
import { X } from 'lucide-react'
import { getFullSizePreview } from '@/utils/FilePreview'

function FileLivePreview({ file, setLivePreview }) {
    const [zoom, setZoom] = useState(1);

    const handleScroll = (event) => {
        if (event.deltaY > 0) {
            setZoom((prevZoom) => Math.max(prevZoom - 0.1, 1));
        } else {
            setZoom((prevZoom) => Math.min(prevZoom + 0.1, 3));
        }
    };

    return (
        <>
        <span onClick={() => setLivePreview(false)} className='fixed inset-0 z-50 bg-black/50'></span>
        <div className="fixed z-50 flex flex-col gap-2 p-4 inset-2 rounded-lg bg-gradient-to-br from-background to-contrast overflow-auto" >
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold">{file?.fileName}</h2>
                <button onClick={() => setLivePreview(false)} className="p-1 text-white bg-red-500 hover:bg-red-600 rounded-full">
                    <X size={20} />
                </button>
            </div>

            <div 
                className="flex h-full w-full gap-4 items-center justify-center rounded-lg overflow-auto" 
                onWheel={handleScroll}
                style={{ transform: `scale(${zoom})` }}
            >
                {getFullSizePreview(file)}
            </div>
        </div>
        </>
    )
}

export default FileLivePreview