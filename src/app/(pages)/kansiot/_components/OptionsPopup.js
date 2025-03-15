import React, { useState, useEffect } from 'react';
import { updateFolderData } from '@/app/file-requests/folders';
import { updateFileData } from '@/app/file-requests/files'; // Assuming you have a similar function for files
import { useAlert } from '@/app/contexts/AlertContext';
import { X } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { DateDB } from '@/utils/DataTranslation';

function OptionsPopup({ selectedObject, setFolders, setFiles, setSelectedObjects, setObjectOptions }) {
  const [objectName, setObjectName] = useState('');
  const [objectPasswordProtected, setObjectPasswordProtected] = useState(false);
  const [objectPassword, setObjectPassword] = useState('');
  const [fileExtension, setFileExtension] = useState('');
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
      setObjectPasswordProtected(selectedObject.passwordProtected);
    }
  }, [selectedObject]);

  const handleNameChange = (e) => {
    setObjectName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setObjectPassword(e.target.value);
  };

  const handlePasswordProtection = (e) => {
    setObjectPasswordProtected(e.target.checked);
  };

  const handleFolderUpdate = async (e) => {
    e.preventDefault();

    try {
      if (selectedObject.name === objectName && selectedObject.passwordProtected === objectPasswordProtected && objectPassword === '') {
        showAlert('Ei tallennettavia muutoksia.', 'info');
        return;
      }

      if (!selectedObject.passwordProtected && objectPasswordProtected && objectPassword === '') {
          showAlert('Salasana ei voi olla tyhjä.', 'error');
          return;
      }

      let updatedData;
      if (selectedObject.passwordProtected && objectPasswordProtected && objectPassword === '') {
          updatedData = {
              ...selectedObject,
              name: objectName,
              modified: DateDB(new Date())
          };
      } else {
          updatedData = {
              ...selectedObject,
              name: objectName,
              passwordProtected: objectPasswordProtected,
              password: objectPassword,
              modified: DateDB(new Date()),
          };
      }

      await updateFolderData(user.id, updatedData);

      // Assuming setFolders is a function to update the state of folders
      setFolders(prevFolders => prevFolders.map(folder => 
        folder.id === updatedData.id ? updatedData : folder
      ));

      showAlert('Kansio päivitetty onnistuneesti.', 'success');
      setObjectOptions(false); // Close the options popup
      setSelectedObjects([]); // Empty selected objects array
    } catch (error) {
      console.error("Error updating folder: ", error);
      showAlert('Virhe kansion päivittämisessä.', 'error');
    }
  };

  const handleFileUpdate = async (e) => {
    e.preventDefault();

    try {
      const fullName = `${objectName}.${fileExtension}`;

      if (selectedObject.name === fullName && selectedObject.passwordProtected === objectPasswordProtected && objectPassword === '') {
          showAlert('Ei tallennettavia muutoksia.', 'info');
          return;
      }

      if (!selectedObject.passwordProtected && objectPasswordProtected && objectPassword === '') {
          showAlert('Salasana ei voi olla tyhjä.', 'error');
          return;
      }

      let updatedData;
      if (selectedObject.passwordProtected && objectPasswordProtected && objectPassword === '') {
          updatedData = {
              ...selectedObject,
              name: fullName,
              modified: DateDB(new Date())
          };
      } else {
          updatedData = {
              ...selectedObject,
              name: fullName,
              passwordProtected: objectPasswordProtected,
              password: objectPassword,
              modified: DateDB(new Date())
          };
      }

      await updateFileData(user.id, updatedData);

      setFiles(prevFiles => prevFiles.map(file => 
          file.id === updatedData.id ? updatedData : file
      ));

      showAlert('Tiedosto päivitetty onnistuneesti.', 'success');
      setObjectOptions(false); // Close the options popup
      setSelectedObjects([]); // Empty selected objects array
    } catch (error) {
      console.error("Error updating file: ", error);
      showAlert('Virhe tiedoston päivittämisessä.', 'error');
    }
  };

  return (
    <span className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 px-4 py-2'>
      <div className='relative flex flex-col w-full max-w-2xl p-4 z-50 bg-gradient-to-br from-background to-contrast shadow-md max-h-full overflow-y-auto'>
        <button 
          onClick={() => setObjectOptions(false)} 
          className='absolute top-2 right-2 p-1 text-lg text-white bg-red-500 hover:bg-red-600 transition-colors'
        >
          <X />
        </button>
        <h2 className="text-2xl md:text-3xl mb-6 text-center font-bold">Muokkaa</h2>
        <form className="flex flex-col" onSubmit={selectedObject.docType === 'folder' ? handleFolderUpdate : handleFileUpdate}>
          <div>
            <label htmlFor="objectName" className="block text-sm font-semibold">{selectedObject.docType === 'file' ? 'Tiedoston nimi' : 'Kansion nimi'}</label>
            <div className='flex items-center gap-1'>
              <input 
                type="text" 
                id="objectName" 
                name="objectName"
                value={objectName}
                onChange={handleNameChange}
                placeholder={selectedObject.docType === 'file' ? 'Tiedoston nimi' : 'Kansion nimi'}
                className="w-full py-2.5 px-3 bg-background text-sm border border-transparent outline-none focus:border-primary focus:ring-1"
              />
              {fileExtension && <span className='text-sm'>.{fileExtension}</span>}
            </div>
          </div>

          <label className='flex items-center cursor-pointer w-fit mt-4'>
              <input 
                  type="checkbox" 
                  value="" 
                  className="sr-only peer" 
                  checked={objectPasswordProtected}
                  onChange={handlePasswordProtection}
              />
              <div className="relative w-11 h-6 bg-gray-400 dark:bg-contrast peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                  dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full 
                  rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                  after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                  dark:border-gray-600 peer-checked:bg-primary"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Salasana</span>
          </label>
        
          {objectPasswordProtected && (
            <div>
              <label htmlFor="objectPassword" className="block text-sm font-semibold mt-4">{selectedObject.docType === 'file' ? 'Tiedoston salasana' : 'Kansion salasana'}</label>
              <input 
                type="password" 
                id="objectPassword" 
                name="objectPassword"
                value={objectPassword}
                onChange={handlePasswordChange}
                placeholder={selectedObject.docType === 'file' ? 'Anna tiedostolle salasana...' : 'Anna kansiolle salasana...'}
                className="w-full py-2.5 px-3 bg-background text-sm border border-transparent outline-none focus:border-primary focus:ring-1"
              />
            </div>
          )}

          <button type="submit" className="w-full mt-4 py-2.5 px-3 bg-primary text-white text-sm hover:bg-primary/90 transition-colors">Tallenna</button>
        </form>
      </div>
    </span>
  );
}

export default OptionsPopup;