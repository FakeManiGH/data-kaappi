import { useAlert } from '@/app/contexts/AlertContext';
import { updateFileName } from '@/app/file-requests/files';
import { fileNameRegex } from '@/utils/Regex';
import { useUser } from '@clerk/nextjs';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react'

function FileRenamePopup({ selectedFile, setFiles, setRenamePopup, setSelectedObjects }) {
  const [fileName, setFileName] = useState(null);
  const [newName, setNewName] = useState(null);
  const [fileExtension, setFileExtension] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const { showAlert} = useAlert();
  const { user } = useUser();

  useEffect(() => {
    if (selectedFile) {
      const nameParts = selectedFile.name.split('.');
      const nameWithoutExtension = nameParts.slice(0, -1).join('.');
      const extension = nameParts.slice(-1)[0];
      setFileName(nameWithoutExtension);
      setFileExtension(extension);
    }
  }, [selectedFile]);

  // Input change
  const handleNameChange = (e) => {
    setNewName(e.target.value);
  }

  // File renaming (api)
  const handleFileRenaming = async (e) => {
    if (apiLoading) {
      showAlert('Ladataan... Odota hetki.', 'info');
      return;
    }

    e.preventDefault();
    setApiLoading(true);
    
    if (!newName || !newName.length || newName === fileName) {
      showAlert('Anna tiedostolle ensin uusi nimi.', 'info');
      setApiLoading(false);
      return;
    }

    if (!fileNameRegex.test(newName)) {
      setNameError('Nimi ei saa sisältää merkkejä <, >, /, \\ ja sen on oltava 2-75 merkkiä pitkä.');
      setApiLoading(false);
      return;
    }

    try {
      const fullName = `${newName}.${fileExtension}`;
      const response = await updateFileName(user.id, selectedFile.id, fullName);

      if (response.success) {
        const updatedFile = {...selectedFile, name: fullName}
        setFiles(prevFiles => prevFiles.map(file => 
          file.id === updatedFile.id ? updatedFile : file
        ));
        setRenamePopup(false); 
        setSelectedObjects([]);
        showAlert(response.message || 'Tiedoston nimi vaihdettu.' , 'success');
      } else {
        showAlert(response.message || 'Uudelleen nimeäminen epäonnistui.' , 'error');
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

        <h2 className="text-2xl md:text-3xl mb-2 text-center font-bold">Nimeä uudelleen</h2>
        <p className='text-sm'>Nimeä tiedosto uudelleen. Nimen tulee olla 1-75 merkkiä pitkä, eikä se saa sisältää &lt;, &gt;, \ ja / -merkkejä.</p>

        <form className="flex flex-col mt-4" onSubmit={handleFileRenaming}>
          <div>
            <label htmlFor="filename" className="block text-sm font-bold">Tiedoston nimi</label>
            <div className='flex items-center gap-1'>
              <input 
                type="text" 
                id="filename" 
                name="filename"
                defaultValue={fileName}
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
            className="w-full mt-2 py-2.5 px-3 rounded-lg bg-primary text-white 
              text-sm hover:bg-primary/75  transition-colors"
          >
              Tallenna
          </button>
        </form>
      </div>
    </span>
  )
}

export default FileRenamePopup