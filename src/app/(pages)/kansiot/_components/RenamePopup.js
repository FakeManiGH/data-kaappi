import React, { useState, useEffect } from 'react';
import { updateFolderName } from '@/app/file-requests/folders';
import { folderNameRegex, fileNameRegex } from '@/utils/Regex';
import { updateFileData, updateFileName } from '@/app/file-requests/files'; // Assuming you have a similar function for files
import { useAlert } from '@/app/contexts/AlertContext';
import { X } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

function RenamePopup({ selectedObject, setFolders, setFiles, setSelectedObjects, setRenamePopup }) {
  const [objectName, setObjectName] = useState('');
  const [fileExtension, setFileExtension] = useState('');
  const [nameError, setNameError] = useState('')
  const { showAlert } = useAlert();
  const { user } = useUser();

  useEffect(() => {
    if (selectedObject) {
      if (selectedObject.docType === 'file') {
        const nameParts = selectedObject.name.split('.');
        const nameWithoutExtension = nameParts.slice(0, -1).join('.');
        const extension = nameParts.slice(-1)[0];
        setObjectName(nameWithoutExtension);
        setFileExtension(extension);
      } else {
        setObjectName(selectedObject.name);
      }
    }
  }, [selectedObject]);


  const handleNameChange = (e) => {
    setObjectName(e.target.value);
  };


  const handleFolderNameChange = async (e) => {
    e.preventDefault();
    const newFolderName = objectName;

    if (!newFolderName || newFolderName === selectedObject.name) {
      setNameError('Anna ensin uusi nimi.', 'info');
      return;
    }

    if (!folderNameRegex.test(newFolderName)) {
      setNameError('Nimi ei saa sisältää merkkejä <, >, /, \\ ja sen on oltava 2-50 merkkiä pitkä.');
      return;
    }

    try {
      const response = await updateFolderName(user.id, selectedObject.id, newFolderName);

      if (response.success) {
        const updatedFolder = {
          ...selectedObject,
          name: newFolderName
        };

        setFolders(prevFolders => prevFolders.map(folder => 
          folder.id === updatedFolder.id ? updatedFolder : folder
        ));

        setRenamePopup(false); // Close the options popup
        setSelectedObjects([]); // Empty selected objects array
        showAlert(response.message, 'success');
      } else {
        showAlert(response.message, 'error');
      }
    } catch (error) {
      console.error("Error updating folder: ", error);
      showAlert('Virhe kansion päivittämisessä.', 'error');
    }
  };


  const handleFileNameChange = async (e) => {
    e.preventDefault();
    const fullName = `${objectName}.${fileExtension}`;

    if (!fullName || fullName === objectName) {
      setNameError('Anna ensin uusi nimi.', 'info');
      return;
    }

    if (!fileNameRegex.test(fullName)) {
      setNameError('Nimi ei saa sisältää merkkejä <, >, /, \\ ja sen on oltava 2-75 merkkiä pitkä.');
      return;
    }

    try {
      const response = await updateFileName(user.id, selectedObject.id, fullName);

      if (response.success) {
        const updatedFile = {
          ...selectedObject,
          name: fullName
        };

        setFiles(prevFiles => prevFiles.map(file => 
          file.id === updatedFile.id ? updatedFile : file
        ));

        setRenamePopup(false); // Close the options popup
        setSelectedObjects([]); // Empty selected objects array
        showAlert(response.message, 'success');
      } else {
        showAlert(response.message, 'error');
      }
    } catch (error) {
      console.error("Error updating file: ", error);
      showAlert('Virhe tiedoston päivittämisessä.', 'error');
    }
  };

  return (
    <span className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 px-4 py-2'>
      <div className='relative flex flex-col w-full max-w-2xl rounded-xl p-4 z-50 bg-gradient-to-br from-contrast to-secondary 
          shadow-lg shadow-black/25 max-h-full border border-contrast overflow-y-auto'
      >
        <button 
          onClick={() => setRenamePopup(false)} 
          className='absolute top-2 right-2 p-1 rounded-full text-white bg-red-500 hover:bg-red-600 transition-colors'
        >
          <X />
        </button>
        <h2 className="text-2xl md:text-3xl mb-6 text-center font-bold">Nimeä uudelleen</h2>
        <p className='text-sm'>Nimeä kohde uudelleen. Merkit &lt;, &gt;, \ ja / on kielletty.</p>
        <form className="flex flex-col mt-4" onSubmit={selectedObject.docType === 'folder' ? handleFolderNameChange : handleFileNameChange}>
          <div>
            <label htmlFor="objectName" className="block text-sm font-bold">{selectedObject.docType === 'file' ? 'Tiedoston nimi' : 'Kansion nimi'}</label>
            <div className='flex items-center gap-1'>
              <input 
                type="text" 
                id="objectName" 
                name="objectName"
                value={objectName}
                onChange={handleNameChange}
                placeholder={selectedObject.docType === 'file' ? 'Tiedoston nimi' : 'Kansion nimi'}
                className="relative w-full py-2.5 px-3 bg-background text-sm border border-transparent outline-none focus:border-primary focus:ring-1"
                autoFocus
              />
              
              {fileExtension && <span className='text-sm'>.{fileExtension}</span>}
            </div>
          </div>

          {nameError && 
            <div className='flex items-center justify-between gap-4 px-3 py-2.5 mt-2 rounded-lg text-white text-sm bg-red-500'>
              <p>{nameError}</p>
              <button onClick={() => setNameError('')}><X size={20} /></button>
            </div>
          }

          <button 
            type="submit" 
            className="w-full mt-4 py-2.5 px-3 rounded-full bg-primary text-white 
              text-sm hover:bg-primary/75  transition-colors"
          >
              Tallenna
          </button>
        </form>
      </div>
    </span>
  );
}

export default RenamePopup;