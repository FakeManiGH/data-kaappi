import React from 'react'
import Image from 'next/image'
import { Folder, X } from 'lucide-react'
import ProgressBar from './ProgressBar'
import { getFileIcon } from '@/utils/GetFileIcon'
import { cleanDataType, translateFileSize } from '@/utils/DataTranslation'

function FilePreview({ files, folders, removeFile, uploadProgress }) {

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2  w-full gap-4'>
      {files?.map((file, index) => (
        <div key={index} className='flex flex-1 items-center justify-between bg-contrast shadow-md hover:shadow-lg'>
          <div className='flex flex-1 items-center gap-4 p-2'>
            <Image 
              src={getFileIcon(file?.type)} 
              alt='file' 
              width={50} 
              height={50} 
            />
            <div className='flex flex-col justify-center gap-2 w-full'>
              <div className='flex items-center flex-wrap gap-2'>
                <p className='text-sm text-foreground whitespace-nowrap'>{file.name}</p>
                <div className='flex items-center gap-2'>
                  <p className='text-xs text-navlink'>{cleanDataType(file.type)}</p>
                  <p className='text-xs text-navlink'>{translateFileSize(file.size)}</p>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <select
                  id='folder'
                  className='px-3 py-2.5 bg-background w-full text-sm border-contrast focus:border-primary focus:ring-primary focus:ring-1'
                >
                  <option value=''>Valitse kansio</option>
                  {folders.map((folder) => (
                    <option key={folder.folderID} value={folder.folderID}>{folder.folderName}</option>
                  ))}
                </select>
                <label htmlFor='folder'><Folder size={20} /></label>
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