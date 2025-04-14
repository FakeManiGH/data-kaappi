import React, { useState } from 'react';
import { getFileIcon } from '@/utils/GetFileIcon';
import { DownloadCloud, FilePlus, Share2, Trash2, LockKeyhole, Fullscreen, Expand, Group } from 'lucide-react';
import Link from 'next/link';
import { getCardPreview } from '@/utils/FilePreview';
import { useAlert } from '@/app/contexts/AlertContext';
import { translateFileSize, cleanDataType } from '@/utils/DataTranslation';
import DeleteConfirmPopup from './DeleteConfirmPopup';
import { useUser } from '@clerk/nextjs';
import Lightbox from '@/app/_components/_lightbox/Lightbox';

function FileContainer({ fileState, setFileState, contentLoading }) {
  const [deletePopup, setDeletePopup] = useState(false);
  const [touchStartTime, setStartTouchTime] = useState(null);
  const [activeFileId, setActiveFileId] = useState(null); // Track the active file for options
  const { showAlert } = useAlert();
  const { user } = useUser();

  // Determine which files to display
  const displayFiles = fileState.searched
    ? fileState.searchedFiles
    : fileState.sorted
    ? fileState.sortedFiles
    : fileState.files;

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
            className="masonry-item bg-background overflow-hidden  group"
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
              className={`absolute top-0 flex items-center justify-between w-full scale-y-0 origin-top group-hover:scale-y-100 text-white bg-black/75
                      transition-all overflow-hidden
                      ${activeFileId === file.id ? 'scale-y-100' : 'scale-y-0'}`}
            >
              <Link href={`/tiedosto/${file.id}`} className="w-full p-2 truncate text-base hover:text-primary">
                {file.name}
              </Link>
            </div>

            <div className="align-middle">{getCardPreview({ file })}</div>
          </div>
        ))}
      </div>

      <Lightbox files={displayFiles} />
    </>
  );
}

export default FileContainer;