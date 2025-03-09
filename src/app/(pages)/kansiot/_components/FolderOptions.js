import React, { useState } from 'react'
import { X } from 'lucide-react'

function FolderOptions({ folder, setFolders, setFolderOptions }) {
  const [folderName, setFolderName] = useState(folder.name);
  const [folderPassword, setFolderPassword] = useState(folder.password || '');

  const handleNameChange = (e) => {
    setFolderName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setFolderPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update the folder name and password in the folders state
    setFolders(prevFolders => prevFolders.map(f => f.id === folder.id ? { ...f, name: folderName, password: folderPassword } : f));
    setFolderOptions(false);
  };

  return (
    <span className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 px-4 py-2'>
      <div className='relative flex flex-col w-full max-w-2xl p-4 z-50 bg-gradient-to-br from-background to-contrast shadow-md max-h-full overflow-y-auto'>
        <button 
          onClick={() => setFolderOptions(false)} 
          className='absolute top-2 right-2 p-1 text-lg text-white bg-red-500 hover:bg-red-600 transition-colors'
        >
          <X />
        </button>
        <h2 className="text-2xl md:text-3xl mb-6 text-center font-bold">Muokkaa kansiota</h2>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="folderName" className="block text-sm font-semibold">Kansion nimi</label>
            <input 
              type="text" 
              id="folderName" 
              name="folderName"
              value={folderName}
              onChange={handleNameChange}
              placeholder="Kansion nimi"
              className="w-full py-2.5 px-3 bg-background text-sm border border-transparent outline-none focus:border-primary focus:ring-1"
            />
          </div>
          <div>
            <label htmlFor="folderPassword" className="block text-sm font-semibold mt-4">Kansion salasana</label>
            <input 
              type="password" 
              id="folderPassword" 
              name="folderPassword"
              value={folderPassword}
              onChange={handlePasswordChange}
              placeholder="Anna kansiolle salasana..."
              className="w-full py-2.5 px-3 bg-background text-sm border border-transparent outline-none focus:border-primary focus:ring-1"
            />
          </div>
          <button type="submit" className="w-full mt-4 py-2.5 px-3 bg-primary text-white text-sm hover:bg-primary/90 transition-colors">Tallenna</button>
          <button type="button" onClick={() => setFolderOptions(false)} className="mt-2 text-sm text-navlink hover:text-primary transition-colors">Peruuta</button>
        </form>
      </div>
    </span>
  )
}

export default FolderOptions