import { X } from 'lucide-react'
import React, { useState } from 'react'
import { generateRandomString } from '@/utils/GenerateRandomString'
import { createFolder, createSubfolder } from '@/app/file-requests/folders'
import { useAlert } from '@/app/contexts/AlertContext'
import { useUser } from '@clerk/nextjs'
import { transformFolderDataPublic } from '@/utils/DataTranslation'
import { folderNameRegex } from '@/utils/Regex'

function FolderSettingsPage({ folder, setFolder, folderSettings, setFolderSettings }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert()
  const { user } = useUser()

    return (
        <div className={`flex flex-col gap-4 transition-transform origin-top
            ${folderSettings ? 'scale-y-100' : 'scale-y-0'}`}
        >
            <p className='text-xs'>* Muista tallentaa muutokset.</p>
        </div>
        )
    }

export default FolderSettingsPage