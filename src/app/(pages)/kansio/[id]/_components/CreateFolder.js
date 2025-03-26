import { X } from 'lucide-react'
import React from 'react'
import { generateRandomString } from '@/utils/GenerateRandomString'
import { createFolder } from '@/app/file-requests/folders'
import { useAlert } from '@/app/contexts/AlertContext'
import { useUser } from '@clerk/nextjs'
import { transformFolderDataPublic } from '@/utils/DataTranslation'

function CreateFolder({ folder, folders, setFolders, setCreateFolder }) {
  const { showAlert } = useAlert()
  const { user } = useUser()

  const handleCreateFolder = async (e) => {
    e.preventDefault()

    const folderName = e.target.folderName.value

    if (!folderName) {
      showAlert('Anna kansiolle nimi.', 'error')
      return
    }

    try {
      const folderID = generateRandomString(11)
      
      const folderData = {
        docType: 'folder', // String
        folderID: folderID, // String
        folderName: folderName, // String
        parentFolderName: folder.name, // String
        parentID: folder.id, // String
        fileCount: 0, // Number
        userID: user.id, // String
        userName: user.fullName, // String
        userEmail: user.primaryEmailAddress.emailAddress, // String
        createdAt: new Date(), // Date
        modifiedAt: new Date(), // Date
        pwdProtected: false, // Boolean
        pwd: '', // String
        shared: false, // Boolean
        sharedWith: [], // Array
      }

      // Database call
      await createFolder(folderID, folderData)

      // Transform folderData to publicFolder
      const publicFolder = transformFolderDataPublic(folderData)

      // Add publicFolder to the folders state
      setFolders([...folders, publicFolder])
      setCreateFolder(false)
    } catch (error) {
      console.error("Error creating folder: ", error)
      showAlert('Kansion luonti epäonnistui. Yritä uudelleen.', 'error')
    }
  }

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
          <button 
            type="submit" 
            className="w-full mt-2 py-2.5 px-3 rounded-full bg-gradient-to-br from-primary to-blue-800 text-white 
              text-sm hover:to-primary shadow-md shadow-black/25 transition-colors"
          >
              Luo kansio
          </button>
        </form>
      </div>
    </span>
  )
}

export default CreateFolder