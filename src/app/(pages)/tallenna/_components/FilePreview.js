import React from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import ProgressBar from './ProgressBar'
import { getFileIcon } from '@/utils/GetFileIcon'
import { cleanDataType, translateFileSize } from '@/utils/DataTranslation'

function FilePreview({ files, removeFile, uploadProgress }) {
  return (
    <>
      {files?.map((file, index) => (
        <div key={index} className='flex items-center justify-between w-full mt-3 bg-background border border-contrast rounded-lg'>
          <div className='flex flex-1 items-center gap-2 p-2'>
            <Image 
              src={getFileIcon(file?.type)} 
              alt='file' 
              width={50} 
              height={50} 
            />
            <div className='flex-col justify-center items-center w-full'>
              <div className='flex flex-wrap items-center gap-2'>
                <p className='text-md text-foreground'>{file.name}</p>
                <p className='text-xs text-navlink'>{cleanDataType(file.type)}</p>
                <p className='text-xs text-navlink'>{translateFileSize(file.size)}</p>
              </div>
              {uploadProgress[index] > 0 ? <ProgressBar progress={uploadProgress[index]} /> : null}
            </div>
          </div>
          <div className='p-3'>
            <X className='cursor-pointer dark:text-red-500 hover:text-red-600' onClick={() => removeFile(file)} />
          </div>
        </div>
      ))}
    </>
  )
}

export default FilePreview