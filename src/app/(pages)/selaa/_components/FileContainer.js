import React, { useState } from 'react';
import { DownloadCloud, FilePlus, Share2, Trash2, LockKeyhole, Fullscreen, Expand, Group } from 'lucide-react';
import Link from 'next/link';
import { useAlert } from '@/app/contexts/AlertContext';
import { translateFileSize } from '@/utils/DataTranslation';
import { useUser } from '@clerk/nextjs';
import Lightbox from '@/app/_components/_lightbox/Lightbox';
import FileBrowsePreview from '@/app/_components/_common/FileBrowsePreview';
import { getFileIcon } from '@/utils/GetFileIcon';

function FileContainer({ fileState, setFileState, contentLoading }) {
  const [deletePopup, setDeletePopup] = useState(false);
  const [touchStartTime, setStartTouchTime] = useState(null);
  const [activeFileId, setActiveFileId] = useState(null); // Track the active file for options
  const { showAlert } = useAlert();
  const { user } = useUser();

  // LIGHT BOX
  const [openLight, setOpenLight] = useState(false);
  const [clickedFile, setClickedFile] = useState(null);

  // FILES TO DISPLAY
  const displayFiles = fileState.searched
    ? fileState.searchedFiles
    : fileState.sorted
    ? fileState.sortedFiles
    : fileState.files;

  // FILE SELECTION (Mobile)
  const handleTouchStart = (fileId) => {
    setStartTouchTime(Date.now());
    setActiveFileId(null); // Reset active file on new touch
  };

  const handleTouchEnd = (fileId) => {
    const touchDuration = Date.now() - touchStartTime;
    if (touchDuration > 500) {
      setActiveFileId(fileId); // Set the active file for options
    }
    setStartTouchTime(null);
  };


  return (
    <>
      {/* No files */}
      {!fileState.files.length && !contentLoading && (
        <div className="flex flex-col gap-4 items-center justify-center h-96">
          <p className="text-xl text-gray-400 dark:text-gray-600">Ei tiedostoja...</p>
        </div>
      )}

      <div className="masonry-grid">
        {displayFiles.map((file) => (
          <div
            key={file.id}
            style={{ touchAction: 'scroll' }} 
            className="masonry-item bg-background overflow-hidden group"
            onTouchStart={() => handleTouchStart(file.id)}
            onTouchEnd={() => handleTouchEnd(file.id)}
            title={file.name + '|' + translateFileSize(file.size)}
          >
            <div
              className={`absolute flex flex-col items-center bg-background rounded-lg top-0 left-0 gap-1 ${
                file.shared || file.password ? 'p-1' : 'p-0'
              }`}
            >
              {file.shared && (
                <span title="Jaettu" className="text-xs text-success">
                  <Share2 size={18} />
                </span>
              )}
              {file.password && (
                <span title="Salasana suojattu" className="text-xs text-success">
                  <LockKeyhole size={18} />
                </span>
              )}
            </div>

            <div
              className={`absolute top-0 flex items-center justify-between w-full text-white bg-black/35
                transition-all overflow-hidden scale-y-100 p-1`}
            >
              <Link href={`/tiedosto/${file.id}`} className="truncate text-base hover:text-primary">
                {file.name}
              </Link>
              
              <div className='flex items-center gap-1'>
                {file.folder &&
                  <Link href={`/kansio/${file.folder}`} className='hover:rotate-12 transition-transform'>
                    <img src='/icons/folder.png' className='w-6 h-6 object-contain' />
                  </Link>
                }
                <img src={getFileIcon(file.type)} className='h-5 w-5 object-contain' />
              </div>
            </div>

            <div 
              className="align-middle cursor-zoom-in"
              onClick={() => {setClickedFile(file), setOpenLight(true)}}
            >
              <FileBrowsePreview file={file} />
            </div>
          </div>
        ))}
      </div>

      {fileState.files.length && !contentLoading &&
        <Lightbox files={displayFiles} setFile={clickedFile} open={openLight} setOpen={setOpenLight} />
      }
    </>
  );
}

export default FileContainer;