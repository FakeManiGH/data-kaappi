import { Eye, EyeOff, Save, X } from 'lucide-react'
import React, { useState } from 'react'
import { useAlert } from '@/app/contexts/AlertContext'
import { useUser } from '@clerk/nextjs'
import { updateFilePassword } from '@/app/file-requests/files'
import { passwordRegex } from '@/utils/Regex'
import { updateFolderPassword } from '@/app/file-requests/folders'


function PasswordForm({ selectedObject, setFolders, setFiles, setSelectedObjects, setPasswordPopup }) {
    const [showPassword, setShowPassword] = useState(false)
    const [passwordError, setPasswordError] = useState('')
    const { showAlert } = useAlert()
    const { user } = useUser()

    // Save folder password
    const saveFolderPassword = async (e) => {
        e.preventDefault()
        const newPassword = e.target.password.value;

        if (!newPassword || newPassword.lenght === 0) {
            setPasswordError('Salasana ei voi olla tyhjä.');
            return;
        }

        if (!passwordRegex.test(newPassword)) {
            setPasswordError('Salasana ei voi sisältää <, >, /, \\ -merkkejä.');
            return;
        }

        try {
            const response = await updateFolderPassword(user.id, selectedObject.id, newPassword);

            if (response.success) {
                const updatedFolder = {
                    ...selectedObject,
                    passwordProtected: true
                }

                setFolders(prevFolders => prevFolders.map(folder => 
                    folder.id === updatedFolder.id ? updatedFolder : folder
                ));

                setPasswordPopup(false);
                setSelectedObjects([]);
                showAlert(response.message, 'success');
            } else {
                showAlert(response.message, 'error');
            }
        } catch (error) {
            console.error('Error setting folder password: ' + error);
            showAlert(response.message, 'error');
        }
    }

    // Save file password
    const saveFilePassword = async (e) => {
        e.preventDefault()
        const newPassword = e.target.password.value;
        
        if (!newPassword || newPassword.lenght === 0) {
            setPasswordError('Salasana ei voi olla tyhjä.');
            return;
        }

        if (!passwordRegex.test(newPassword)) {
            setPasswordError('Salasana ei voi sisältää <, >, /, \\ -merkkejä.');
            return;
        }

        try {
            const response = await updateFilePassword(user.id, selectedObject.id, newPassword);
            if (response.success) {
                const updatedFile = {
                    ...selectedObject,
                    passwordProtected: true
                }
                setFiles(prevFiles => prevFiles.map(file => 
                    file.id === updatedFile.id ? updatedFile : file
                ));
                setPasswordPopup(false);
                setSelectedObjects([]);
                showAlert(response.message, 'success');
            } else {
                showAlert(response.message, 'error');
            }
        } catch (error) {
            console.error('Error setting file password: ' + error);
            showAlert(response.message, 'error');
        }
    }

    const changeVisibility = () => setShowPassword(!showPassword)



    return (
    <>
        <label htmlFor="password" className="sr-only">Salasana</label>

        <div className="relative mt-2">
            <form className="flex flex-col text-sm" onSubmit={selectedObject.docType === 'folder' ? saveFolderPassword : saveFilePassword}> 
                <label htmlFor="password" className="block mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedObject.passwordProtected ? 'Vaihda ' : 'Aseta '} 
                    salasana
                </label>
                <div className='relative'>
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        className="relative w-full py-2.5 px-3 bg-background text-sm border border-transparent outline-none focus:border-primary focus:ring-1 pe-12"
                        placeholder="Kirjoita salasana"
                        autoFocus
                    />
                    <span className="flex items-center absolute inset-y-0 end-0 px-4">
                        <button 
                            className="text-navlink hover:text-primary" 
                            type="button"
                            onClick={changeVisibility}
                        >
                            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                    </span>
                </div>

                {passwordError && 
                    <div className='flex items-center justify-between gap-4 px-3 py-2.5 mt-2 text-white text-sm bg-red-500'>
                        <p>{passwordError}</p>
                        <button onClick={() => setPasswordError('')}><X size={20} /></button>
                    </div>
                }

                <button type="submit" className="w-full py-2.5 px-3 mt-2 bg-primary text-white text-sm hover:bg-primary/90 transition-colors">Tallenna</button>
            </form>
        </div>
    </>
    )
}

export default PasswordForm