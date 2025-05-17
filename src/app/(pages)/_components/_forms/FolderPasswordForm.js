import { Eye, EyeOff, Save, Trash2, X } from 'lucide-react'
import React, { useState } from 'react'
import { useAlert } from '@/app/contexts/AlertContext'
import { useUser } from '@clerk/nextjs'
import { passwordRegex } from '@/utils/Regex'
import { removeFolderPassword, updateFolderPassword } from '@/app/file-requests/folders'


function FolderPasswordForm({ selectedFolder, setFolder, setFolders, setSelectedObjects, setPasswordPopup }) {
    const [showPassword, setShowPassword] = useState(false)
    const [passwordErr, setPasswordErr] = useState(null);
    const [apiLoading, setApiLoading] = useState(false);
    const { showAlert } = useAlert();
    const { user } = useUser();


    // Password Change API
    const saveFolderPassword = async (e) => {
        e.preventDefault();
        if (apiLoading) {
            showAlert('Ladataan... odota hetki.', 'info');
            return;
        }
        setApiLoading(true);
        const newPassword = e.target.password.value;
        
        if (!newPassword || newPassword.lenght === 0) {
            showAlert('Anna ensin kelvollinen salasana.', 'info');
            setApiLoading(false);
            return;
        }

        if (!passwordRegex.test(newPassword)) {
            showAlert('Salasanan tulee olla vähintään 4 merkkiä pitkä, eikä se saa sisältää <, >, / \\ -merkkejä.');
            setApiLoading(false);
            return;
        }

        try {
            const response = await updateFolderPassword(user.id, selectedFolder.id, newPassword);
            if (response.success) {
                const updatedFolder = {
                    ...selectedFolder,
                    passwordProtected: true
                }
                if (setFolder) setFolder(updatedFolder); // Folder settings
                if (setFolders) setFolders(prevFolders => prevFolders.map(folder => folder.id === updatedFolder.id ? updatedFolder : folder)); // Folderpages
                if (setPasswordPopup) setPasswordPopup(false); // Folderpages
                if (setSelectedObjects) setSelectedObjects([]); // Folderpages
                showAlert(response.message, 'success');
            } else {
                setPasswordErr(response.message || 'Salasanan asettaminen tiedostolle epäonnistui.');
            }
        } catch (error) {
            console.error('Error setting file password: ' + error);
            showAlert('Salasanan asettaminen tiedostolle epäonnistui, yritä uudelleen.', 'error');
        } finally {
            setApiLoading(false);
        }
    }

    // Remove password API-call
    const handlePasswordRemoving = async () => {
        try {
            const response = await removeFolderPassword(user.id, selectedFolder.id);
            if (response.success) {
                showAlert(response.message, 'success');
                const updatedFolder = {
                    ...selectedFolder,
                    passwordProtected: false
                }

                // Update folder
                if (setFolder) {
                    setFolder(updatedFolder);
                }

                // Update folders
                if (setFolders) {
                    setFolders(prevFolders => prevFolders.map(folder =>
                        folder.id === updatedFolder.id ? updatedFolder : folder
                    ));
                }

                // Update selectedFolder
                if (setSelectedObjects) {
                    setSelectedObjects([updatedFolder]);
                }
            } else {
                showAlert(response.message || 'Salasanan poistaminen käytöstä epäonnistui.', 'error');
            }
        } catch (error) {
            console.error('Error removing password: ' + error);
            showAlert('Salasanan poistaminen käytöstä epäonnistui, yritä uudelleen.', 'error');
        }
    }


    // Password visibility
    const changeVisibility = () => setShowPassword(!showPassword)


    return (
        <div className="relative">
            <form className="flex flex-col text-sm" onSubmit={saveFolderPassword}>
                <div className='flex items-center gap-2 justify-between'>
                    <h3 className='text-xl font-semibold'>Salasana suojaus</h3>

                    {selectedFolder.passwordProtected &&
                        <div className='flex items-center gap-1'>
                            <p className='px-1 py-0.5 w-fit text-xs text-success border border-success '>
                                Suojattu
                            </p>
                            
                            <button 
                                title='Poista salasana käytöstä'
                                className='hover:text-red-500 transition-colors'
                                onClick={handlePasswordRemoving}
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    }
                </div>
                
                <p className='text-sm mt-2'>Voit antaa kansiolle lisäsuojaa asettamalla sille salasanan.</p>

                <label htmlFor="password" className="block mt-2 text-sm font-medium text-gray-500">
                    {selectedFolder.passwordProtected ? 'Vaihda ' : 'Aseta '} 
                    salasana
                </label>

                <div className='relative'>
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        className="relative w-full py-2 px-3 bg-contrast text-sm  border border-transparent 
                            outline-none focus:border-primary focus:ring-1 pe-12"
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

                {passwordErr && 
                    <div className='flex items-center justify-between gap-4 px-3 py-2 mt-2  text-white text-sm bg-red-500'>
                        <p>{passwordErr}</p>
                        <button onClick={() => setPasswordErr(null)}><X size={20} /></button>
                    </div>
                }

                <button 
                    type="submit" 
                    className="w-fit mt-2 py-2 px-3  bg-primary text-white 
                        text-sm hover:bg-primary/75 transition-colors"
                >
                    Tallenna salasana
                </button>
            </form>
        </div>
    )
}

export default FolderPasswordForm