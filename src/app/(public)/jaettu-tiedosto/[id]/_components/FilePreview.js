import React from 'react'

function FilePreview({ file }) {

    if (file.type.includes('image')) return (
        <div className='flex items-center justify-center aspect-video w-full'>
            <img src={file.url} alt={file.name} className=' shadow-lg shadow-black/25' />
        </div>
    )

    if (file.type.includes('video')) return (
        <div className='flex items-center justify-center p-2 bg-gray-800 aspect-video w-full'>
            <video src={file.url} controls />
        </div>
    )
        
}

export default FilePreview