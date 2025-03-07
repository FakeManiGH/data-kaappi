import React, { useState } from 'react';
import { translateFileSize, cleanDataType, formatDateFromCollection } from '@/utils/DataTranslation';
import { getFilepagePreview } from '@/utils/FilePreview';
import { LockKeyhole, Share2 } from 'lucide-react';


function FilePreview({ file }) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col lg:flex-row lg:items-center w-full max-w-full">
        <div className="flex flex-col justify-center items-center p-2 gap-2 lg:w-1/3 w-full min-h-40 max-h-96">
          {getFilepagePreview(file)}
        </div>

        <div className='lg:w-2/3 w-full rounded-lg p-2 flex flex-col gap-4'>
          <ul className="flex flex-col text-sm">
            <li className='flex gap-4 items-baseline justify-between border-b border-dashed border-contrast p-1'>
              <strong className='whitespace-nowrap'>Koko:</strong> {translateFileSize(file.size)}
            </li>
            <li className='flex gap-4 items-baseline justify-between border-b border-dashed border-contrast p-1'>
              <strong className='whitespace-nowrap'>Tallennettu:</strong> {formatDateFromCollection(file.uploadedAt)}
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

export default FilePreview;