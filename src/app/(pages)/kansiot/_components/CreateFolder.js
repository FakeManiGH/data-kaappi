import { X } from 'lucide-react'
import React, { useState } from 'react'
import { createFolder } from '@/app/file-requests/folders'
import { useAlert } from '@/app/contexts/AlertContext'
import { useUser } from '@clerk/nextjs'
import { folderNameRegex } from '@/utils/Regex'
import PopupLoader from '@/app/_components/_common/PopupLoader'

function CreateFolder({ folders, setFolders, setCreateFolder }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null)
  const { showAlert } = useAlert()
  const { user } = useUser()

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const folderName = e.target.folderName.value.trim();

    if (!folderName) {
      setError('Anna kansiolle nimi.');
      setLoading(false);
      return
    }

    if (!folderNameRegex.test(folderName)) {
      setError('Kansion nimen tulee olla 2-50 merkkiä pitkä, eikä se saa sisältää <, >, /, \\ -merkkejä.');
      setLoading(false);
      return
    }

    try {
      const folderUser = {
        id: user.id,
        name: user.fullName,
        email: user.primaryEmailAddress.emailAddress,
      }

      const response = await createFolder(folderUser, folderName)
      if (response.success) {
        setFolders((prevFolders) => [...prevFolders, response.folder]);
        showAlert(response.message || 'Kansio luotu onnistuneesti.', 'success');
        e.target.reset();
        setCreateFolder(false);
        
      } else {
        setError(response.message || 'Kansion luomisessa tapahtui virhe.');
      }

    } catch (error) {
      console.error("Error creating folder: ", error);
      showAlert('Kansion luonti epäonnistui. Yritä uudelleen.', 'error');

    } finally {
      setLoading(false);
    }
  }

  if (loading) return <PopupLoader />

  return (
    <span className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 p-4'>
      <div className='relative flex flex-col w-full max-w-2xl rounded-xl p-4 z-50 bg-gradient-to-br from-contrast to-secondary 
          shadow-lg shadow-black/25 max-h-full border border-contrast overflow-y-auto'
      >
        <button 
          onClick={() => setCreateFolder(false)} 
          className='absolute top-2 right-2 p-1 rounded-full text-white bg-red-500 hover:bg-red-600 transition-colors'
        >
          <X />
        </button>
        <h2 className="text-2xl md:text-3xl mb-6 text-center font-bold">Luo uusi kansio</h2>
        <p className='text-sm'>Luo uusi kansio kaappiisi. Merkit &lt;, &gt;, \ ja / on kielletty.</p>
        <form className="flex flex-col mt-4" onSubmit={handleCreateFolder}>
          <label htmlFor="folderName" className="block text-sm font-bold">Kansion nimi</label>
          <input 
            type="text" 
            id="folderName" 
            placeholder='Anna kansiolle nimi...' 
            name="folderName" 
            className="relative w-full py-2.5 px-3 bg-background text-sm border border-transparent outline-none focus:border-primary focus:ring-1"
            autoFocus
          />

          {error && 
            <div className='flex items-center justify-between gap-4 px-3 py-2.5 mt-2 text-white text-sm bg-red-500'>
              <p>{error}</p>
              <button onClick={() => setError(null)}><X size={20} /></button>
            </div>
          }

          <button 
            type="submit" 
            className="w-full mt-2 py-2.5 px-3 rounded-full bg-primary text-white 
              text-sm hover:bg-primary/75  transition-colors"
          >
              Luo kansio
          </button>
        </form>

        {loading && <PopupLoader />}
      </div>
    </span>
  )
}

export default CreateFolder