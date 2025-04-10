import React, { useState, useEffect } from 'react';
import { updateFolderName } from '@/app/file-requests/folders';
import { folderNameRegex, fileNameRegex } from '@/utils/Regex';
import { updateFileData, updateFileName } from '@/app/file-requests/files'; // Assuming you have a similar function for files
import { useAlert } from '@/app/contexts/AlertContext';
import { X } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

function RenamePopup({ file, setFile, setRenamePopup }) {
  const [fileName, setFileName] = useState('');
  const [fileExtension, setFileExtension] = useState('');
  const [nameError, setNameError] = useState('')
  const { showAlert } = useAlert();
  const { user } = useUser();

  useEffect(() => {
    if (file) {
      const nameParts = file.name.split('.');
      const nameWithoutExtension = nameParts.slice(0, -1).join('.');
      const extension = nameParts.slice(-1)[0];
      setFileName(nameWithoutExtension);
      setFileExtension(extension);
    } else {
      setRenamePopup(false);
    }
  }, [file]);

  const handleNameChange = (e) => {
    setFileName(e.target.value);
  };

  const handleFileNameChange = async (e) => {
    e.preventDefault();
    const fullName = `${fileName}.${fileExtension}`;

    if (!fullName || fullName === objectName) {
      setNameError('Anna ensin uusi nimi.', 'info');
      return;
    }

    if (!fileNameRegex.test(fullName)) {
      setNameError('Nimi ei saa sisältää merkkejä <, >, /, \\ ja sen on oltava 2-75 merkkiä pitkä.');
      return;
    }

    try {
      const response = await updateFileName(user.id, file.id, fullName);

      if (response.success) {
        const updatedFile = {
          ...file,
          name: fullName
        };

        setFile(updatedFile);
        setRenamePopup(false); 
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
          className='absolute top-2 right-2 p-1 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors'
        >
          <X />
        </button>
        <h2 className="text-2xl md:text-3xl mb-6 text-center font-bold">Nimeä uudelleen</h2>
        <p className='text-sm'>Nimeä tiedosto uudelleen. Merkit &lt;, &gt;, \ ja / on kielletty.</p>
        <form className="flex flex-col mt-4" onSubmit={handleFileNameChange}>
          <div>
            <label htmlFor="objectName" className="block text-sm font-bold">Tiedoston nimi</label>
            <div className='flex items-center gap-1'>
              <input 
                type="text" 
                id="objectName" 
                name="objectName"
                value={fileName}
                onChange={handleNameChange}
                placeholder='Anna tiedostolle nimi...'
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
            className="w-full mt-4 py-2.5 px-3 rounded-lg bg-primary text-white 
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