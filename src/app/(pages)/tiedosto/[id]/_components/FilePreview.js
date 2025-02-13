import React, { useState } from 'react';
import { translateFileSize } from '@/utils/TranslateFileSize';
import DownloadBtn from '@/app/_components/_common/DownloadBtn';

function FilePreview({ file }) {
  const returnPreviewFile = () => {
    if (file.fileType.includes('image')) {
      return (
        <img src={file.fileUrl} alt={file.fileName} className="max-w-52 h-auto rounded-lg" />
      );
    } else if (file.fileType.includes('video')) {
      return (
        <video src={file.fileUrl} controls className="max-w-52 h-auto rounded-lg" />
      );
    } else if (file.fileType.includes('audio')) {
      return (
        <audio src={file.fileUrl} controls className="max-w-52 h-auto rounded-lg" />
      );
    } else {
      return (
        <img src='/icons/file.png' alt='File PNG illustration' className="max-w-52 h-auto" />
      );
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {returnPreviewFile()}
        <div className='w-full rounded-lg p-4 flex flex-col gap-4'>
          <h1 className='text-md sm:text-xl truncate'>{file.fileName}</h1>
          <a href={file.fileUrl} target="_blank" rel="noreferrer" className='text-sm text-primary underline'>Avaa välilehdessä</a>
          <ul className="flex flex-col text-sm">
            <li className='flex gap-4 items-baseline justify-between border-b border-dashed border-contrast2 p-1'>
              <strong className='whitespace-nowrap'>Koko:</strong> {translateFileSize(file.fileSize)}
            </li>
            <li className='flex gap-4 items-baseline justify-between border-b border-dashed border-contrast2 p-1'>
              <strong className='whitespace-nowrap'>Tyyppi:</strong> {file.fileType}
            </li>
            <li className="flex gap-1 items-baseline justify-between border-b border-dashed border-contrast2 p-1">
              <strong className='whitespace-nowrap'>Näkyvyys:</strong> {file.shared ? 'Jaettu' : 'Yksityinen'}
            </li>
            <li className='flex gap-4 items-baseline justify-between p-1'>
              <strong className='whitespace-nowrap'>Salasana suojattu:</strong> {file.password ? 'Kyllä ' : 'Ei'}
            </li>
          </ul>
        </div>
      </div>
      <DownloadBtn url={file.fileUrl} fileName={file.fileName} />
    </div>
  );
}

export default FilePreview;