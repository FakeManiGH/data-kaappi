import React, { useState, useEffect } from 'react'
import { updateFolderData } from '@/app/file-requests/folders';
import { useAlert } from '@/app/contexts/AlertContext';
import { X } from 'lucide-react'

function OptionsPopup({ selectedObject, setFolders, setFiles, setObjectOptions }) {
  const [objectName, setObjectName] = useState('');
  const [objectPassword, setObjectPassword] = useState('');
  const { showAlert } = useAlert();

  useEffect(() => {
    if (selectedObject) {
      setObjectName(selectedObject.name);
      setObjectPassword(selectedObject.password || '');
    }
  }, [selectedObject]);

  const handleNameChange = (e) => {
    setObjectName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setObjectPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedObject.type === 'folder') {
      try {
        const newFolderName = e.target.objectName.value;
        const newFolderPassword = e.target.objectPassword.value;

        if (newFolderName === selectedObject.name && newFolderPassword === selectedObject.password) {
          showAlert('Ei tallennettavia muutoksia.', 'info');
          return;
        }

        const updatedFolder = {
          ...selectedObject,
          name: newFolderName,
          password: newFolderPassword
        };

        await updateFolderData(updatedFolder);
        setFolders(prevFolders => prevFolders.map(f => f.id === selectedObject.id ? updatedFolder : f));
        showAlert('Kansion tiedot päivitetty.', 'success');
      } catch (error) {
        showAlert('Kansion tietojen päivitys epäonnistui.', 'error');
      }
        
    } else if (selectedObject.type === 'file') {
      // Update the file name and password in the files state
      setFiles(prevFiles => prevFiles.map(f => f.id === selectedObject.id ? { ...f, name: objectName, password: objectPassword } : f));
    }
    setObjectOptions(false);
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
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="objectName" className="block text-sm font-semibold">{selectedObject.docType === 'file' ? 'Tiedoston nimi' : 'Kansion nimi'}</label>
            <input 
              type="text" 
              id="objectName" 
              name="objectName"
              value={objectName}
              onChange={handleNameChange}
              placeholder={selectedObject.docType === 'file' ? 'Tiedoston nimi' : 'Kansion nimi'}
              className="w-full py-2.5 px-3 bg-background text-sm border border-transparent outline-none focus:border-primary focus:ring-1"
            />
          </div>
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
          <button type="submit" className="w-full mt-4 py-2.5 px-3 bg-primary text-white text-sm hover:bg-primary/90 transition-colors">Tallenna</button>
          <button type="button" onClick={() => setObjectOptions(false)} className="mt-2 text-sm text-navlink hover:text-primary transition-colors">Peruuta</button>
        </form>
      </div>
    </span>
  )
}

export default OptionsPopup