import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'

function Lightbox({ files, open }) {
    const [selectedFile, setSelectedFile] = useState(files[0]);
    const [slideIndex, setSlideIndex] = useState(0);

    useEffect(() => {
        setSlideIndex(files.findIndex((file) => file === selectedFile) + 1);
    }, [])


    return (
        <div className='fixed z-50 inset-0 flex flex-col items-center justify-center p-1 bg-black/85'>
            <div className='flex items-center gap-2 justify-between w-full pb-1'>
                <h1 className='text-base md:text-lg text-white'>{selectedFile?.name}</h1>
                <button className='text-white hover:text-red-500'>
                    <X size={32} />
                </button>
            </div>

            <img 
                src={selectedFile?.url}
                alt={selectedFile?.name}
                className='w-full h-full object-contain'
            />
                
            <nav className='w-full flex items-center gap-2 justify-between pt-1'>
                <button
                    className='text-white hover:text-primary'
                >
                    <ChevronLeft size={32} />
                </button>

                <p className='md:text-lg text-white'>{slideIndex} / {files.length}</p>

                <button
                    className='text-white hover:text-primary'
                >
                    <ChevronRight size={32} />
                </button>
            </nav>
        </div>
    )
}

export default Lightbox;