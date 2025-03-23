import React, { useState } from 'react';
import { translateFileSize, cleanDataType, DatePublic, datePublic, convertDate } from '@/utils/DataTranslation';
import { getFilepagePreview } from '@/utils/FilePreview';
import { LockKeyhole, Share2 } from 'lucide-react';
import Link from 'next/link'


function FileInfo({ file, folder, setFile, setLivePreview }) {
  return (
    <div className="flex flex-col w-full">
      <ul className="flex flex-col text-sm">
        <li className='flex gap-4 items-baseline justify-between border-b border-dashed border-contrast p-1'>
          <strong className='whitespace-nowrap'>Koko:</strong> {translateFileSize(file.size)}
        </li>
        <li className='flex gap-4 items-baseline justify-between border-b border-dashed border-contrast p-1'>
          <strong className='whitespace-nowrap'>Tallennettu:</strong> {convertDate(file.uploadedAt)}
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
  );
}

export default FileInfo;