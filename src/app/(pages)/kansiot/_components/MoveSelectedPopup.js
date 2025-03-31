import { CircleMinus, X } from 'lucide-react'
import { getFileIcon } from '@/utils/GetFileIcon';
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs';
import { useAlert } from '@/app/contexts/AlertContext';
import { getUserFolders } from '@/app/file-requests/folders';
import PopupLoader from '@/app/_components/_common/PopupLoader';

function MoveSelectedPopup({ selectedObjects, setSelectedObjects, setFolders, setFiles, setMovePopup }) {
  const [allFolders, setAllFolders] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useUser();
  const { showAlert } = useAlert();


  useEffect(() => {
    const getAllUserFolders = async () => {
      if (isLoaded && user) {
        try {
          const response = await getUserFolders(user.id);
          if (response.success) {
            setAllFolders(response.folders);
          } else {
            showAlert(response.message || 'Kansioiden hakeminen epäonnistui.');
          }
        } catch (error) {
          showAlert('Kansioiden hakeminen epäonnistui.', 'error');
          setMovePopup(false);
        } finally {
          setLoading(false);
        }
      } else {
        showAlert('Käyttäjätietoja ei löytynyt', 'error');
        setMovePopup(false);
        setLoading(false);
      }
    };
  
    if (selectedObjects.length === 0) {
      setMovePopup(false);
    }
  
    getAllUserFolders();
  }, [isLoaded, user, showAlert, selectedObjects]);
  
  const removeObjectSelection = (object) => {
    setSelectedObjects((prevSelectedObjects) => 
        prevSelectedObjects.filter((selectedObject) => selectedObject.id !== object.id)
    );
  };

  const moveSelectedObjects = async () => {
    setLoading(true);
    try {
      selectedObjects.forEach(object => {
        if (object.docType === 'folder') {

        } else if (object.docType === 'file') {

        }
      })
    } catch (error) {
      console.error('Error moving selected objects: ' + error);

    } finally {
      setLoading(false);
    }
  }


  if (loading) return <PopupLoader />

  return (
    <div className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 px-4 py-2'>
      <div className='relative flex flex-col w-full max-w-2xl rounded-xl p-4 z-50 bg-gradient-to-br from-contrast to-secondary 
        shadow-lg shadow-black/25 max-h-full border border-contrast overflow-y-auto'
      >
          <button 
            onClick={() => setMovePopup(false)} 
            className='absolute top-2 right-2 p-1 rounded-full text-white bg-red-500 hover:bg-red-600 transition-colors'
          >
            <X />
          </button>

          <h2 className="text-2xl md:text-3xl mb-6 text-center font-bold">Siirrä kohteet</h2>
          
          <ul className='flex flex-col gap-1 text-sm'>
            {selectedObjects.map(object => (
              <li key={object.id} className='relative flex items-center justify-between gap-2 py-1'>
                <div className='flex items-center gap-2'>
                  <img src={object.docType === 'folder' ? '/icons/folder.png' : getFileIcon(object.type)} alt='Kansio tai tiedosto' className="w-7 h-auto" />
                  <p className='truncate'>{object.name}</p>
                  {object.docType === 'folder' && <span className='text-navlink'>({object.fileCount} tiedostoa)</span>}
                </div>

                <button 
                  title='Poista valinta' 
                  className='text-navlink hover:text-foreground'
                  onClick={() => removeObjectSelection(object)}
                >
                  <CircleMinus size={20} />
                </button>
              </li>
            ))}
          </ul>

          <select
            id='folder'
            className='px-3 py-2.5 mt-4 bg-background text-sm border border-contrast focus:border-primary w-full focus:ring-primary focus:ring-1
              first:text-navlink'
            onChange={(e) => handleFolderChange(e, index)}
            value={''} // Prioritize preferredFolder
          >
            <option value="" disabled>Valitse kansio</option>
            {allFolders.map((folder) => (
              <option key={folder.id} value={folder.id}>{folder.name}</option>
            ))}
          </select>
          <label htmlFor='folder' className='sr-only'>Valitse kansio</label>

          <button 
              onClick={() => setDeleteConfirm(true)} 
              className='text-white text-sm bg-gradient-to-br from-primary to-blue-800 hover:to-primary mt-4 py-2.5 px-3 rounded-full
                shadow-md shadow-black/25'
          >
              Siirrä
          </button>
      </div>
  </div>
  )
}

export default MoveSelectedPopup