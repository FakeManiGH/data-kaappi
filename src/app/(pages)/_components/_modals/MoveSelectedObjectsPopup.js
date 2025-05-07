import { CircleMinus, X } from 'lucide-react'
import { getFileIcon } from '@/utils/GetFileIcon';
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs';
import { useAlert } from '@/app/contexts/AlertContext';
import { getUserFolders, transferFolderInFolder } from '@/app/file-requests/folders';
import PopupLoader from '@/app/_components/_common/PopupLoader';
import { transferFileToFolder } from '@/app/file-requests/files';

function MoveSelectedObjectsPopup({ currentFolder, selectedObjects, setSelectedObjects, setFile, setFolders, setFiles, setMovePopup }) {
    const [availableFolders, setAvailableFolders] = useState(null);
    const [targetID, setTargetID] = useState(null);
    const [transferErrors, setTransferErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, isLoaded } = useUser();
    const { showAlert } = useAlert();


    useEffect(() => {
      const getUserFolderData = async () => {
        if (isLoaded && user) {
          try {
            const response = await getUserFolders(user.id);
            if (response.success) {
              let allFolders = response.folders
              if (currentFolder) {
                setAvailableFolders(
                  allFolders.filter((folder) => folder.id !== currentFolder.id)
                );
              } else {
                setAvailableFolders(allFolders);
              }
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
    
      getUserFolderData();
    }, [isLoaded, user, showAlert, selectedObjects]);
  
  // Remove selected object (if not on file-page)
  if (!setFile) {
    const removeObjectSelection = (object) => {
      setSelectedObjects((prevSelectedObjects) => 
          prevSelectedObjects.filter((selectedObject) => selectedObject.id !== object.id)
      );
    };
  }

  // Change selected folder
  const handleFolderChange = (e) => {
    const selectedFolder = e.target.value;
    setTargetID(selectedFolder);
  }

    // Move selected files into folder
    const moveSelectedObjects = async () => {
      setLoading(true);
      setTransferErrors([]); // Clear previous errors
    
      if (!targetID) {
        showAlert('Valitse kohdekansio ennen siirtoa.', 'info');
        setLoading(false);
        return;
      }
    
      if (currentFolder && currentFolder.id === targetID) {
        showAlert('Kohteet sijaitsevat jo tässä kansiossa.', 'info');
        setLoading(false);
        return;
      }
    
      if (targetID === 'kansiot') setTargetID(null); // for base folder
    
      try {
        const errors = []; // Track errors
        const movedObjects = []; // Track successful
    
        const movePromises = selectedObjects.map(async (object) => {
          if (object.docType === 'folder') {
            const response = await transferFolderInFolder(user.id, object.id, targetID);
            if (!response.success) {
              errors.push({ id: object.id, name: object.name, message: response.message });
            } else {
              movedObjects.push(object);
            }
          } else if (object.docType === 'file') {
            const response = await transferFileToFolder(user.id, object.id, targetID);
            if (!response.success) {
              errors.push({ id: object.id, name: object.name, message: response.message });
            } else {
              movedObjects.push(object);
            }
          }
        });
    
        await Promise.all(movePromises);

        // Update file
        if (setFile) {
          setFile((prevFile) => ({...prevFile, folder: targetID}));
        }
    
        // Update folders
        if (setFolders) {
          setFolders((prevFolders) =>
            prevFolders.filter((folder) => !movedObjects.some((obj) => obj.id === folder.id))
          );
        }

        // Update files
        if (setFiles) {
          setFiles((prevFiles) =>
            prevFiles.filter((file) => !movedObjects.some((obj) => obj.id === file.id))
          );
        }

        // Update targetFolder fileCount (if in this folder)
        if (setFolders) {
          setFolders((prevFolders) =>
            prevFolders.map((folder) =>
              folder.id === targetID
                ? { ...folder, fileCount: folder.fileCount + movedObjects.length }
                : folder
            )
          );
        }

        if (errors.length > 0) {
          showAlert('Joitakin kohteita ei voitu siirtää.', 'error');
          setSelectedObjects((prevSelectedObjects) =>
            prevSelectedObjects.filter(
                (selectedObject) =>
                    !movedObjects.some((movedObject) => movedObject.id === selectedObject.id)
            )
        );
          setTransferErrors(errors);
        } else {
          showAlert('Kohteet siirretty onnistuneesti.', 'success');
          setSelectedObjects([]); // Clear all selected objects
          setMovePopup(false); // Close modal
        }
      } catch (error) {
        console.error('Error moving selected objects:', error);
        showAlert(error.message || 'Kohteiden siirtäminen epäonnistui.', 'error');
      } finally {
        setLoading(false);
      }
    };


  if (loading) return <PopupLoader />

  return (
    <div className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 px-4 py-2'>
      <div className='relative flex flex-col w-full max-w-2xl rounded-xl p-4 z-50 bg-gradient-to-br from-contrast to-secondary 
        shadow-lg shadow-black/25 max-h-full border border-contrast overflow-y-auto'
      >
          <button 
            onClick={() => setMovePopup(false)} 
            className='absolute top-2 right-2 p-1 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors'
          >
            <X />
          </button>

          <h2 className="text-2xl md:text-3xl mb-2 text-center font-bold">Siirrä kohteet</h2>
          
          <ul className='flex flex-col gap-1 text-sm'>
            {selectedObjects.map((object) => {
              const error = transferErrors.find((err) => err.id === object.id); // Find error for this object
              return (
                <li key={object.id} className='relative flex flex-col gap-1 py-1'>
                  <div className='flex items-center justify-between gap-2'>
                    <div className='flex items-center gap-2'>
                      <img
                        src={object.docType === 'folder' ? '/icons/folder.png' : getFileIcon(object.type)}
                        alt='Kansio tai tiedosto'
                        className='w-7 h-auto'
                      />
                      <p className='truncate'>{object.name}</p>
                      {object.docType === 'folder' && (
                        <span className='text-navlink'>({object.fileCount} tiedostoa)</span>
                      )}
                    </div>
                      
                    {!setFile &&
                      <button
                        title='Poista valinta'
                        className='text-navlink hover:text-foreground'
                        onClick={() => removeObjectSelection(object)}
                      >
                        <CircleMinus size={20} />
                      </button>
                    }
                  </div>

                  {/* Display error message if it exists */}
                  {error && (
                    <p className='text-sm text-red-500'>
                      <strong>Virhe:</strong> {error.message}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>

          <select
            id='folder'
            className='px-3 py-2.5 mt-4 rounded-md bg-background text-sm border border-contrast focus:border-primary w-full focus:ring-primary focus:ring-1
              first:text-navlink'
            onChange={(e) => handleFolderChange(e)}
            value={targetID || ''} // Prioritize preferredFolder
          >
            <option value="" disabled>Valitse kansio</option>
            {currentFolder && <option value="kansiot">Kansiot</option>}
            {availableFolders.map((folder) => (
              <option key={folder.id} value={folder.id}>{folder.name}</option>
            ))}
          </select>
          <label htmlFor='folder' className='sr-only'>Valitse kansio</label>

          <button 
              onClick={moveSelectedObjects} 
              className='text-white text-sm bg-primary hover:bg-primary/75 mt-4 py-2.5 px-3 rounded-lg
                '
          >
              Siirrä
          </button>
      </div>
  </div>
  )
}

export default MoveSelectedObjectsPopup