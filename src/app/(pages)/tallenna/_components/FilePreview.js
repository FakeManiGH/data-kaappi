import React from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import ProgressBar from './ProgressBar'
import { getFileIcon } from '@/utils/GetFileIcon'
import { cleanDataType, translateFileSize } from '@/utils/DataTranslation'

function FilePreview({ files, removeFile, uploadProgress }) {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2  w-full gap-4'>
      {files?.map((file, index) => (
        <div key={index} className='flex flex-1 items-center justify-between rounded-lg bg-gradient-to-r from-contrast to-background'>
          <div className='flex flex-1 items-center gap-4 p-2 pr-12'>
            <Image 
              src={getFileIcon(file?.type)} 
              alt='file' 
              width={50} 
              height={50} 
            />
            <div className='flex-col justify-center items-center w-full'>
              <div className='flex items-center flex-wrap gap-2'>
                <p className='text-sm text-foreground whitespace-nowrap'>{file.name}</p>
                <div className='flex items-center gap-2'>
                  <p className='text-xs text-navlink'>{cleanDataType(file.type)}</p>
                  <p className='text-xs text-navlink'>{translateFileSize(file.size)}</p>
                </div>
              </div>
              {uploadProgress[index] > 0 ? <ProgressBar progress={uploadProgress[index]} /> : null}
            </div>
          </div>
          <div className='p-3'>
            <X className='cursor-pointer text-red-500 hover:text-red-600' onClick={() => removeFile(file)} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default FilePreview