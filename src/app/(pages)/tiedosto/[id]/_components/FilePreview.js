import React, { useState } from 'react';
import { translateFileSize, cleanDataType, formatDateFromCollection } from '@/utils/DataTranslation';
import DownloadBtn from '@/app/_components/_common/DownloadBtn';
import { getFilepagePreview } from '@/utils/FilePreview';
import { Eye, LockKeyhole, Share2 } from 'lucide-react';

function FilePreview({ file }) {

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {getFilepagePreview(file)}
        <div className='w-full rounded-lg p-4 flex flex-col gap-4'>
          <h1 className='text-md sm:text-xl truncate'>{file.fileName}</h1>
          <a href={file.fileUrl} target="_blank" rel="noreferrer" className='flex items-center gap-1 w-fit text-sm text-primary hover:text-primary/90'><Eye /> Esikatsele</a>
          <ul className="flex flex-col text-sm">
            <li className='flex gap-4 items-baseline justify-between border-b border-dashed border-contrast2 p-1'>
              <strong className='whitespace-nowrap'>Koko:</strong> {translateFileSize(file.fileSize)}
            </li>
            <li className='flex gap-4 items-baseline justify-between border-b border-dashed border-contrast2 p-1'>
              <strong className='whitespace-nowrap'>Luotu:</strong> {formatDateFromCollection(file.createdAt)}
            </li>
            <li className='flex gap-4 items-baseline justify-between border-b border-dashed border-contrast2 p-1'>
              <strong className='whitespace-nowrap'>Tyyppi:</strong> {cleanDataType(file.fileType)}
            </li>
            <li className="flex gap-1 items-baseline justify-between border-b border-dashed border-contrast2 p-1">
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
      <DownloadBtn url={file.fileUrl} fileName={file.fileName} />
    </div>
  );
}

export default FilePreview;