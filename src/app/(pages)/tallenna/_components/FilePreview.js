import React from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import ProgressBar from './ProgressBar'
import { getFileIcon } from '@/utils/GetFileIcon'

function FilePreview({ files, removeFile, uploadProgress }) {
  return (
    <>
      {files.map((file, index) => (
        <div key={index} className='flex items-center justify-between w-full mt-3 bg-contrast border border-contrast2 rounded-xl'>
          <div className='flex flex-1 items-center gap-2 p-2'>
            <Image 
              src={getFileIcon(file?.type)} 
              alt='file' 
              width={50} 
              height={50} 
            />
            <div className='flex-col justify-center items-center w-full'>
              <div className='flex flex-wrap items-center gap-2'>
                <p className='text-md text-foreground'>{file?.name}</p>
                <p className='text-xs text-navlink'>{file?.type}</p>
                <p className='text-xs text-navlink'>{(file?.size / (1024 * 1024)).toFixed(2)} Mt</p>
              </div>
              {uploadProgress[index] > 0 ? <ProgressBar progress={uploadProgress[index]} /> : null}
            </div>
          </div>
          <div className='p-2'>
            <X className='cursor-pointer text-red-700 dark:text-red-500' onClick={() => removeFile(file)} />
          </div>
        </div>
      ))}
    </>
  )
}

export default FilePreview