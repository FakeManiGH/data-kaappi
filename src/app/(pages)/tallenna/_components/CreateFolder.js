import { X } from 'lucide-react'
import React from 'react'
import { generateRandomString } from '@/utils/GenerateRandomString'
import { createFolder } from '@/app/file-requests/api'
import { useAlert } from '@/app/contexts/AlertContext'
import { useUser } from '@clerk/nextjs'
import { Timestamp } from 'firebase/firestore'

function CreateFolder({ setNewFolder, folders, setFolders }) {
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
      const now = new Date()
      const formattedDate = now.toLocaleString('fi-FI', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
      })

      const folderData = {
        folderID: folderID, // String
        folderName: folderName, // String
        parentFolderName: null, // String
        parentFolderID: null, // String
        fileCount: 0, // Number
        userID: user.id, // String
        userName: user.fullName, // String
        userEmail: user.primaryEmailAddress.emailAddress, // String
        createdAt: formattedDate, // String
        modifiedAt: formattedDate, // String
        files: [], // Array
        password: '', // String
        shared: false, // Boolean
        sharedWith: [], // Array
      }

      // Database call
      await createFolder(folderID, folderData)

      // Transform folderData to publicFolder
      const publicFolder = {
        id: folderData.folderID,
        name: folderData.folderName,
        parentID: folderData.parentFolderID,
        fileCount: folderData.fileCount,
        user: {
          id: folderData.userID,
          name: folderData.userName,
          email: folderData.userEmail
        },
        created: folderData.createdAt,
        modified: folderData.modifiedAt,
        files: folderData.files,
        password: folderData.password ? true : false,
        shared: folderData.shared,
        sharedWith: folderData.sharedWith
      }

      // Add publicFolder to the folders state
      setFolders([...folders, publicFolder])
      setNewFolder(false)
    } catch (error) {
      console.error("Error creating folder: ", error)
      showAlert('Kansion luonti epäonnistui. Yritä uudelleen.', 'error')
    }
  }

  return (
    <span className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 p-4'>
      <div className='relative flex flex-col gap-4 w-full max-w-2xl p-4 z-50 bg-gradient-to-br from-background to-contrast shadow-lg shadow-black/25'>
        <button 
          onClick={() => setNewFolder(false)} 
          className='absolute top-2 right-2 p-1 text-white bg-red-500 hover:bg-red-600 transition-colors'
        >
          <X />
        </button>
        <h2 className="text-2xl md:text-3xl"><strong>Luo uusi kansio</strong></h2>
        <form className="flex flex-col" onSubmit={handleCreateFolder}>
          <label htmlFor="folderName" className="block text-sm font-semibold">Kansion nimi</label>
          <input 
            type="text" 
            id="folderName" 
            placeholder='Anna kansiolle nimi...' 
            name="folderName" 
            className="outline-none py-2.5 px-3 bg-background text-sm border border-transparent focus:border-primary focus:ring-1"
            autoFocus
          />
          <button type="submit" className="w-full py-2.5 px-3 mt-2 bg-primary text-white text-sm hover:bg-primary/75 transition-colors">Luo kansio</button>
        </form>
      </div>
    </span>
  )
}

export default CreateFolder