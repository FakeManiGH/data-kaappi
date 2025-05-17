import { X } from 'lucide-react'
import React, { useState } from 'react'
import { createFolder } from '@/app/file-requests/folders'
import { useAlert } from '@/app/contexts/AlertContext'
import { useUser } from '@clerk/nextjs'
import { folderNameRegex } from '@/utils/Regex'
import PopupLoader from '@/app/_components/_common/PopupLoader'

function CreateNewFolder({ currentFolder, setNewFolderPopup, folders, setFolders }) {
  const [apiLoading, setApiLoading] = useState(false);
  const [nameError, setNameError] = useState(null);
  const { showAlert } = useAlert()
  const { user } = useUser()

  const handleCreateFolder = async (e) => {
      if (apiLoading) {
        showAlert('Ladataan... odota hetki.', 'info');
        return;
      }

      e.preventDefault();
      setApiLoading(true);
  
      const folderName = e.target.folderName.value;
  
      if (!folderName) {
        showAlert('Anna kansiolle nimi.', 'info');
        setApiLoading(false);
        return
      }
  
      if (!folderNameRegex.test(folderName)) {
        setNameError('Kansion nimen tulee olla 2-50 merkkiä pitkä, eikä se saa sisältää <, >, /, \\ -merkkejä.');
        setApiLoading(false);
        return
      }
  
      try {
        const userData = {
          id: user.id,
          name: user.fullName,
          email: user.primaryEmailAddress.emailAddress,
        }
        
        const response = await createFolder(userData, folderName, currentFolder);
        if (response.success) {
          setFolders((prevFolders) => [...prevFolders, response.folder]);
          showAlert('Uusi kansio luotu onnistuneesti.', 'success');
          e.target.reset();
          setNewFolderPopup(false);
        } else {
          setNameError(response.message);
        }

      } catch (error) {
        console.error("Error creating a new folder: ", error);
        showAlert('Kansion luonti epäonnistui. Yritä uudelleen.', 'error');
  
      } finally {
        setApiLoading(false);
      }
    }

  if (apiLoading) return <PopupLoader />

  return (
    <span className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 p-4'>
      <div className='relative flex flex-col w-full max-w-2xl p-4 z-50 bg-background
          shadow-lg shadow-black/25 max-h-full overflow-y-auto'
      >
        <button 
          onClick={() => setNewFolderPopup(false)} 
          className='absolute top-2 right-2 p-1  text-white bg-red-500 hover:bg-red-600 transition-colors'
        >
          <X />
        </button>

        <h2 className="text-2xl md:text-3xl mb-6 text-center font-bold">Luo uusi kansio</h2>
        <p className='text-sm'>Luo uusi kansio kaappiisi. Merkit &lt;, &gt;, \ ja / on kielletty.</p>

        <form className="flex flex-col mt-4" onSubmit={handleCreateFolder}>
          <label htmlFor="folderName" className="block text-sm font-semibold">Kansion nimi</label>
          
          <input 
            type="text" 
            id="folderName" 
            placeholder='Anna kansiolle nimi...' 
            name="folderName" 
            className="outline-none py-2 px-3 bg-contrast text-sm border border-transparent focus:border-primary focus:ring-1"
            autoFocus
          />

          {nameError && 
            <div className='flex items-center justify-between gap-4 px-3 py-2 mt-2  text-white text-sm bg-red-500'>
              <p>{nameError}</p>
              <button onClick={() => setNameError(null)}><X size={20} /></button>
            </div>
          }

          <button 
            type="submit" 
            className="w-full mt-2 py-2 px-3  bg-primary text-white 
              text-sm hover:bg-primary/75  transition-colors"
          >
              Luo kansio
          </button>
        </form>
      </div>
    </span>
  )
}

export default CreateNewFolder