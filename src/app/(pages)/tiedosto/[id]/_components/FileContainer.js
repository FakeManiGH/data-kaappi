import React, { useState } from 'react';
import { translateFileSize, cleanDataType, DatePublic, datePublic } from '@/utils/DataTranslation';
import { getFilepagePreview } from '@/utils/FilePreview';
import { LockKeyhole, Share2 } from 'lucide-react';
import Link from 'next/link'


function FileContainer({ file, folder, setFile, setLivePreview }) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center w-full max-w-full">
        <div 
          className="flex flex-col justify-center bg-gradient-to-br from-background to-gray-400/10 items-center gap-2 lg:w-1/3 w-full min-h-40 max-h-96 overflow-hidden cursor-zoom-in"
          onClick={() => setLivePreview(true)}
        >
          {getFilepagePreview(file)}
        </div>

        <div className='lg:w-2/3 w-full flex flex-col gap-4'>
          <ul className="flex flex-col text-sm">
            <li className='flex gap-4 items-baseline justify-between border-b border-dashed border-contrast p-1'>
              <strong className='whitespace-nowrap'>Koko:</strong> {translateFileSize(file.size)}
            </li>
            <li className='flex gap-4 items-baseline justify-between border-b border-dashed border-contrast p-1'>
              <strong className='whitespace-nowrap'>Tallennettu:</strong> {file.uploaded}
            </li>
            <li className='flex gap-4 items-baseline justify-between border-b border-dashed border-contrast p-1'>
              <strong className='whitespace-nowrap'>Kansio:</strong> 
              {folder ? 
                <Link href={`/kansio/${folder.id}`} className='text-primary hover:text-primary/75'>{folder.name}</Link> : 
                <Link href='/kansiot' className='text-primary hover:text-primary/75'>Ei kansiota</Link>
              }
            </li>
            <li className='flex gap-4 items-baseline justify-between border-b border-dashed border-contrast p-1'>
              <strong className='whitespace-nowrap'>Tyyppi:</strong> {cleanDataType(file.type)}
            </li>
            <li className="flex gap-1 items-baseline justify-between border-b border-dashed border-contrast p-1">
              <strong className='whitespace-nowrap'>Näkyvyys:</strong>
                <span className='flex gap-1 items-center'>
                  {file.shared && <span title='Jaettu' className='text-xs text-success'><Share2 size={18} /></span>}
                  {file.shared ? 'Jaettu' : 'Yksityinen'}
                </span>
            </li>
            <li className='flex gap-4 items-baseline justify-between p-1'>
              <strong className='whitespace-nowrap'>Salasana suojattu:</strong> 
              <span className='flex gap-1 items-center'>
                {file.password && <span title='Salasana suojattu' className='text-xs text-success'><LockKeyhole size={18} /></span>}
                {file.password ? 'Kyllä ' : 'Ei'}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FileContainer;