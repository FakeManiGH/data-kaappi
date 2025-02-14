import React from 'react'
import { getFileIcon } from '@/utils/GetFileIcon'
import { Grid, List } from 'lucide-react'
import Link from 'next/link'

function FileContainer({ files }) {
  return (
    <>
    <div className='flex items-center w-full'>
        <button className='p-2 border border-r-0 border-contrast2'><Grid /></button>
        <button className='p-2 border border-contrast2'><List /></button>
    </div>

    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {files.map((file) => (
            <Link 
                href={`/tiedosto/${file.fileID}`}
                key={file.fileID} 
                className="flex flex-col overflow-hidden justify-between border-2 border-transparent cursor-pointer gap-2 p-4 bg-background rounded-xl shadow-black/25 shadow-md hover:border-2 hover:border-primary"
            >
                <img src={getFileIcon(file.fileType)} alt={file.fileName} className="w-14 h-auto" />
                <h3 className="text-sm font-bold">{file.fileName}</h3>
                <p className="text-sm text-navlink">{file.fileType}</p>
            </Link>
        ))}
    </div>
    </>
  )
}

export default FileContainer