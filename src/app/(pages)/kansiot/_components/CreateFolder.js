import { X } from 'lucide-react'
import React from 'react'
import { generateRandomString } from '@/utils/GenerateRandomString'
import { createFolder } from '@/app/file-requests/api'
import { useAlert } from '@/app/contexts/AlertContext'
import { useUser } from '@clerk/nextjs'
import { Timestamp } from 'firebase/firestore'

function CreateFolder({ folders, setFolders, setCreateFolder }) {
  const { showAlert } = useAlert()
  const { user } = useUser()

  const handleCreateFolder = (e) => {
    e.preventDefault()

    const folderName = e.target.folderName.value

    if (!folderName) {
      showAlert('Anna kansiolle nimi.', 'error')
      return
    }

    try {
      const folderID = generateRandomString(11)
      const folderData = {
        folderID: folderID,
        folderName: folderName,
        parentFolderID: null,
        userID: user.id,
        userName: user.fullName,
        createdAt: Timestamp.fromDate(new Date()),
        modifiedAt: Timestamp.fromDate(new Date()),
        files: [],
        password: '',
        shared: false,
        sharedWith: [],
      }
      
      createFolder(folderID, folderData)
      setFolders([...folders, folderData])
      setCreateFolder(false)
      showAlert('Kansio luotu onnistuneesti.', 'success')
    } catch (error) {
      console.error("Error creating folder: ", error)
      showAlert('Kansion luonti epäonnistui. Yritä uudelleen.', 'error')
    }
  }


  return (
    <>
    <span className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 p-4'>
      <div className='relative flex flex-col w-full max-w-2xl p-4 z-50 bg-gradient-to-br from-background to-contrast rounded-lg shadow-md'>
        <button 
          onClick={() => setCreateFolder(false)} 
          className='absolute top-2 right-2 p-1 text-lg text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors'
        >
          <X />
        </button>
        <h2 className="text-2xl md:text-3xl mb-4"><strong>Luo uusi kansio</strong></h2>
        <form className="flex flex-col" onSubmit={handleCreateFolder}>
          <label htmlFor="folderName" className="block text-sm font-semibold">Kansion nimi</label>
          <input 
            type="text" 
            id="folderName" 
            placeholder='Anna kansiolle nimi...' 
            name="folderName" 
            className="outline-none p-2.5 bg-background text-sm rounded-md border border-transparent focus:border-primary focus:ring-1"
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