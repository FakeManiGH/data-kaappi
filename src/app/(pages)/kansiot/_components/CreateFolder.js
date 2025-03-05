import { X } from 'lucide-react'
import React from 'react'

function CreateFolder({ folders, setFolders, setCreateFolder }) {
  return (
    <>
    <span className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 p-4'>
      <div className='relative flex flex-col w-full max-w-3xl p-4 z-50 bg-gradient-to-br from-background to-contrast rounded-lg shadow-md'>
        <button 
          onClick={() => setCreateFolder(false)} 
          className='absolute top-2 right-2 p-1 text-lg text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors'
        >
          <X />
        </button>
        <h2 className="text-2xl md:text-3xl mb-4"><strong>Luo uusi kansio</strong></h2>
        <form className="flex flex-col">
          <label htmlFor="folderName" className="block text-sm font-semibold">Kansion nimi</label>
          <input 
            type="text" 
            id="folderName" 
            placeholder='Anna kansiolle nimi...' 
            name="folderName" 
            className="w-full p-2 text-sm text-black border border-transparent focus:border-primary outline-none rounded-lg"
            autoFocus
          />
          <button type="submit" className="w-full mt-2 p-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors">Luo kansio</button>
        </form>
      </div>
    </span>
    </>
  )
}

export default CreateFolder