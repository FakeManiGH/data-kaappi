import React from 'react'

function FilePreview({ file }) {

    if (file.type.includes('image')) return (
        <div className='flex items-center justify-center p-2 bg-gray-800 aspect-video w-full'>
            <img src={file.url} alt={file.name} />
        </div>
    )

    if (file.type.includes('video')) return (
        <div className='flex items-center justify-center p-2 bg-gray-800 aspect-video w-full'>
            <video src={file.url} controls />
        </div>
    )
        
}

export default FilePreview