import React, { useState } from 'react';
import { getFileIcon } from '@/utils/GetFileIcon';
import { DownloadCloud, FilePlus, Share2, Trash2, LockKeyhole, Fullscreen, Expand, Group } from 'lucide-react';
import Link from 'next/link';
import { getCardPreview } from '@/utils/FilePreview';
import { useAlert } from '@/app/contexts/AlertContext';
import { translateFileSize, cleanDataType } from '@/utils/DataTranslation';
import DeleteConfirmPopup from './DeleteConfirmPopup';
import { useUser } from '@clerk/nextjs';

function FileContainer({ fileState, setFileState }) {
  const [deletePopup, setDeletePopup] = useState(false);
  const [touchStartTime, setStartTouchTime] = useState(null);
  const [activeFileId, setActiveFileId] = useState(null); // Track the active file for options
  const { showAlert } = useAlert();
  const { user } = useUser();

  // Determine which files to display
  const displayFiles = fileState.searched
    ? fileState.searchedFiles
    : fileState.filtered
    ? fileState.filteredFiles
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
      {!fileState.files.length && (
        <div className="flex flex-col gap-4 items-center justify-center h-96">
          <p className="text-xl text-contrast">Ei tiedostoja...</p>
          <Link
            href="/tallenna"
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/75"
          >
            <FilePlus size={20} />
            Lisää tiedostoja
          </Link>
        </div>
      )}

      {/* Grid view */}
      {fileState.view === 'grid' && displayFiles.length > 0 && (
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

                <div className='flex items-center gap-1 p-2'>
                  {file.linkShare && <Share2 size={18} />}
                  {file.groupShare && <Group size={18} />}
                  {file.passwordProtected && <LockKeyhole size={18} />}
                </div>
              </div>

              <div
                className="flex flex-col gap-1 hover:text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="align-middle">{getCardPreview({ file })}</div>
              </div>

              <div
                className={`absolute bottom-0 flex items-center gap-1 p-1 w-full scale-y-0 origin-bottom group-hover:scale-y-100 text-white 
                        bg-black/75 transition-all overflow-hidden
                        ${activeFileId === file.id ? 'scale-y-100' : 'scale-y-0'}`}
              >
                <button title='Suurenna' className="p-2 rounded-md bg-primary hover:bg-blue-600 transition-colors">
                  <Expand size={18} />
                </button>
                <button title='Jaa' className="p-2 rounded-md bg-primary hover:bg-blue-600 transition-colors">
                  <Share2 size={18} />
                </button>
                <button title='Lataa' className="p-2 rounded-md bg-success hover:bg-green-600 transition-colors">
                  <DownloadCloud size={18} />
                </button>
                <button title='Poista' className="p-2 bg-red-500 hover:bg-red-600 rounded-md transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {fileState.view === 'list' && displayFiles.length > 0 && (
        <div className="flex flex-col gap-4 px-1">
          {displayFiles.map((file) => (
            <div
              key={file.id}
              className="relative grid grid-cols-1 md:grid-cols-2 gap-2 py-2 border-b border-contrast transition-colors"
            >
              <div className="flex items-center gap-4 overflow-hidden">
                <img
                  src={getFileIcon(file.type)}
                  alt={file.name}
                  className="w-7 h-auto"
                />
                <Link
                  href={`/tiedosto/${file.id}`}
                  className="text-sm font-semibold hover:text-primary truncate-2-row text-ellipsis"
                  onClick={(e) => e.stopPropagation()}
                >
                  {file.name}
                </Link>
              </div>
              <div className="flex items-center gap-3 justify-start md:justify-end">
                {file.shared && (
                  <p title="Jaettu" className="text-xs text-success">
                    <Share2 size={18} />
                  </p>
                )}
                {file.password && (
                  <p title="Salasana suojattu" className="text-xs text-success">
                    <LockKeyhole size={18} />
                  </p>
                )}
                <p className="text-sm whitespace-nowrap text-navlink">{file.uploaded}</p>
                <p className="text-sm whitespace-nowrap text-navlink">
                  {cleanDataType(file.type)}
                </p>
                <p className="text-sm whitespace-nowrap text-navlink">
                  {translateFileSize(file.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default FileContainer;