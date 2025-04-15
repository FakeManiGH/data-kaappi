import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import FileView from './FileView';
import Link from 'next/link';

function Lightbox({ files, setFile, open, setOpen }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [slideIndex, setSlideIndex] = useState(1); // Start at 1 instead of 0

    useEffect(() => {
        if (open && setFile) {
            setSelectedFile(setFile);
            const index = files.findIndex((file) => file === setFile);
            setSlideIndex(index + 1);
        }
    }, [open, setFile, files]);

    // Close
    const closeLightbox = () => {
        setOpen(false);
    };

    // Next
    const nextFile = () => {
        if (files.length > 0) {
            const nextIndex = (slideIndex % files.length) + 1; // Wrap around to 1 after the last file
            setSelectedFile(files[nextIndex - 1]); // Adjust for 0 index
            setSlideIndex(nextIndex);
        }
    };

    // Previous
    const previousFile = () => {
        if (files.length > 0) {
            const prevIndex = (slideIndex - 2 + files.length) % files.length + 1; // Wrap around to the last file
            setSelectedFile(files[prevIndex - 1]); // Adjust for 0 index
            setSlideIndex(prevIndex);
        }
    };

    return (
        <div className={`fixed z-50 inset-0 flex flex-col items-center justify-center p-1 bg-background origin-top transition-all
            ${open ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
        >
            <div className='flex items-center gap-2 justify-between w-full pb-1'>
                <Link href={`/tiedosto/${selectedFile?.id}`} className='px-2 text-lg hover:text-primary'>{selectedFile?.name}</Link>
                <button className='hover:text-red-500' onClick={closeLightbox}>
                    <X size={32} />
                </button>
            </div>
            
            <FileView file={selectedFile} />
                
            <nav className='w-full flex items-center gap-2 justify-between pt-1'>
                <button
                    className='hover:text-primary'
                    onClick={previousFile}
                >
                    <ChevronLeft size={32} />
                </button>

                <p className='text-lg'>{slideIndex} / {files.length}</p>

                <button
                    className='hover:text-primary'
                    onClick={nextFile}
                >
                    <ChevronRight size={32} />
                </button>
            </nav>
        </div>
    );
}

export default Lightbox;