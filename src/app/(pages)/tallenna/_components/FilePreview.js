import React from 'react'
import Image from 'next/image'
import { FolderPlus, X } from 'lucide-react'
import ProgressBar from './ProgressBar'
import { getFileIcon } from '@/utils/GetFileIcon'
import { cleanDataType, translateFileSize } from '@/utils/DataTranslation'

function FilePreview({ files, folders, setNewFolder, removeFile, uploadProgress, setFiles }) {

  const handleFolderChange = (e, fileIndex) => {
    const selectedFolderID = e.target.value
    const updatedFiles = [...files]
    updatedFiles[fileIndex].folderID = selectedFolderID
    setFiles(updatedFiles)
    console.log(files)
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 w-full gap-4'>
      {files?.map((file, index) => (
        <div key={index} className='flex flex-1 items-center gap-3 p-2 bg-gradient-to-br from-background to-contrast shadow-md hover:shadow-lg'>
          <Image 
            src={getFileIcon(file?.type)} 
            alt='file' 
            width={40} 
            height={40} 
          />
          <div className='flex flex-col justify-center gap-2 w-full overflow-hidden'>
            <div className='flex items-center flex-wrap gap-2 overflow-hidden'>
                <p className='text-sm text-foreground truncate'>{file.name}</p>
                <p className='text-xs text-navlink'>{cleanDataType(file.type)}</p>
                <p className='text-xs text-navlink'>{translateFileSize(file.size)}</p>
            </div>

            <div className='flex items-center gap-1'>
              <select
                id='folder'
                className='px-3 py-2.5 bg-background text-sm border-contrast focus:border-primary w-full focus:ring-primary focus:ring-1
                  first:text-navlink'
                onChange={(e) => handleFolderChange(e, index)}
                value={file.folderID || ''}
              >
                <option value='' className='option-lighter'>Valitse kansio</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
              </select>
              <label htmlFor='folder' className='sr-only'>Valitse kansio</label>
              <button 
                title='Luo uusi kansio' 
                className='p-[9px] bg-primary text-white text-sm hover:bg-primary/75'
                onClick={() => setNewFolder(true)}
              >
                  <FolderPlus size={20} />
              </button>
            </div>

            {uploadProgress[index] > 0 ? <ProgressBar progress={uploadProgress[index]} /> : null}
          </div>

          <button className='p-2' onClick={() => removeFile(file)}>
            <X className='cursor-pointer text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500' />
          </button>
        </div>
      ))}
    </div>
  )
}

export default FilePreview