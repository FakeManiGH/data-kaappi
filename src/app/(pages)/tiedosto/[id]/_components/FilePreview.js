import React, { useState } from 'react';
import { translateFileSize, cleanDataType, formatDateFromCollection } from '@/utils/DataTranslation';
import DownloadBtn from '@/app/_components/_common/DownloadBtn';
import { getFilepagePreview } from '@/utils/FilePreview';
import { Eye, LockKeyhole, Share2 } from 'lucide-react';
import FileLivePreview from './FileLivePreview';

function FilePreview({ file }) {
  const [livePreview, setLivePreview] = useState(false);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full max-w-full">
        {getFilepagePreview(file)}
        <div className='w-full rounded-lg p-2 flex flex-col gap-4'>
          <button 
            href={file.fileUrl}
            className='flex items-center gap-1 w-fit text-sm text-navlink hover:text-primary/90'
            onClick={() => setLivePreview(true)}
          >
              <Eye size={20} />
              Esikatsele
          </button>
          <ul className="flex flex-col text-sm">
            <li className='flex gap-4 items-baseline justify-between border-b border-dashed border-contrast p-1'>
              <strong className='whitespace-nowrap'>Koko:</strong> {translateFileSize(file.fileSize)}
            </li>
            <li className='flex gap-4 items-baseline justify-between border-b border-dashed border-contrast p-1'>
              <strong className='whitespace-nowrap'>Tallennettu:</strong> {formatDateFromCollection(file.uploadedAt)}
            </li>
            <li className='flex gap-4 items-baseline justify-between border-b border-dashed border-contrast p-1'>
              <strong className='whitespace-nowrap'>Tyyppi:</strong> {cleanDataType(file.fileType)}
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
      <DownloadBtn url={file.fileUrl} fileName={file.fileName} />
      {livePreview && <FileLivePreview file={file} setLivePreview={setLivePreview} />}
    </div>
  );
}

export default FilePreview;