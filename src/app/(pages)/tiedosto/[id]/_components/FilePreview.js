import React from 'react';
import { translateFileSize } from '@/utils/TranslateFileSize';

function FilePreview({ file }) {
  const renderPreview = () => {
    if (!file || !file.fileType) return null;

    if (file.fileType.startsWith('image/')) {
      return (
        <div className="flex flex-col gap-4">
          <img src={file.fileUrl} alt={file.fileName} className="max-w-40 h-auto select-none pointer-events-none" />
          <div className='bg-contrast rounded-md p-4 flex flex-col gap-4'>
            <h1 className='text-md sm:text-xl truncate'>{file.fileName}</h1>
            <div className="flex flex-col text-sm">
              <p className='flex gap-4 items-baseline justify-between'><strong className='whitespace-nowrap'>Koko:</strong> {translateFileSize(file.fileSize)}</p>
              <p className='flex gap-4 items-baseline justify-between'><strong className='whitespace-nowrap'>Tyyppi:</strong> {file.fileType}</p>
              <p className='flex gap-4 items-baseline justify-between'><strong className='whitespace-nowrap'>Näkyvyys:</strong> {file.shared ? 'Jaettu' : 'Yksityinen'}</p>
              <p className='flex gap-4 items-baseline justify-between'><strong className='whitespace-nowrap'>Salasana:</strong> {file.password ? 'Kyllä' : 'Ei'}</p>
            </div>
          </div>
        </div>
      );
    } else if (file.fileType.startsWith('video/')) {
      return (
        <div className="flex flex-col gap-4">
          <h1 className='text-md sm:text-xl truncate'>{file.fileName}</h1>

          <div className="flex flex-col text-sm">
            <p className='flex gap-4 items-baseline justify-between'><strong className='whitespace-nowrap'>Koko:</strong> {translateFileSize(file.fileSize)}</p>
            <p className='flex gap-4 items-baseline justify-between'><strong className='whitespace-nowrap'>Tyyppi:</strong> {file.fileType}</p>
          </div>

          <video controls className="max-w-full h-auto rounded-xl">
            <source src={file.fileUrl} type={file.fileType} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else if (file.fileType === 'application/pdf') {
      return (
        <div className="flex flex-col gap-4">
          <h1 className='text-md sm:text-3xl truncate'>{file.fileName}</h1>

          <div className="flex flex-col text-sm">
            <p className='flex gap-4 items-baseline justify-between'><strong className='whitespace-nowrap'>Koko:</strong> {translateFileSize(file.fileSize)}</p>
            <p className='flex gap-4 items-baseline justify-between'><strong className='whitespace-nowrap'>Tyyppi:</strong> {file.fileType}</p>
          </div>

          <embed
            src={file.fileUrl}
            type="application/pdf"
            width="100%"
            height="600px"
            className='rounded-xl outline-none'
          />
        </div>
      );
    } else if (file.fileType === 'text/plain') {
      return (
        <div className="flex flex-col gap-4">
          <h1 className='text-md sm:text-3xl truncate'>{file.fileName}</h1>

          <div className="flex flex-col text-sm">
            <p className='flex gap-4 items-baseline justify-between'><strong className='whitespace-nowrap'>Koko:</strong> {translateFileSize(file.fileSize)}</p>
            <p className='flex gap-4 items-baseline justify-between'><strong className='whitespace-nowrap'>Tyyppi:</strong> {file.fileType}</p>
          </div>

          <embed
            src={file.fileUrl}
            title={file.fileName}
            width="100%"
            height="500px"
            className='rounded-xl outline-none text-foreground'
          />
        </div>
      );
    } else {
      return <p>File type not supported for preview.</p>;
    }
  };

  return (
    <div className="file-preview">
      {renderPreview()}
    </div>
  );
}

export default FilePreview;