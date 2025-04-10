import { Eye, EyeOff, LockKeyhole, X } from 'lucide-react'
import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useAlert } from '@/app/contexts/AlertContext';
import { removeFilePassword, updateFilePassword } from '@/app/file-requests/files';
import { passwordRegex } from '@/utils/Regex';

function PasswordPopup({ file, setFile, setPasswordPopup }) {
    const [showPassword, setShowPassword] = useState(false);
    const [passwordErr, setPasswordErr] = useState(null);
    const { user } = useUser();
    const { showAlert } = useAlert();

    const changeVisibility = () => setShowPassword(!showPassword)

    // Remove file password
    const handlePasswordRemoving = async () => {
        try {
            const response = await removeFilePassword(user.id, file.id);
            if (response.success) {
                showAlert(response.message, 'success');
                setFile({...file, passwordProtected: false});
            } else {
                showAlert(response.message, 'error');
            }
        } catch (error) {
            console.error('Error removing password: ' + error);
            showAlert('Salasanan poistaminen käytöstä epäonnistui, yritä uudelleen.', 'error');
        }
    }

    // Save password
    const savePassword = async (e) => {
        try {
            e.preventDefault()
            let newPassword = e.target.password.value

            if (!password) setPasswordErr('Anna kelvollinen salasana.');
            if (!passwordRegex.test(password)) setPasswordErr('Salasana ei voi sisältää <, >, /, \\ -merkkejä.');
        
            const response = await updateFilePassword(user.id, file.id, newPassword);

            if (response.success) {
                showAlert(response.message, 'success');
                setFile({ ...file, passwordProtected: true });
                setPasswordPopup(false);
            } else {
                console.error("Error saving new password: " + error);
                setPasswordErr(response.message);
            }
        } catch (error) {
            console.error('Error saving password: ', error)
            showAlert('Salasanan tallentaminen epäonnistui.', 'error')
        }    
    }


    return (
        <span className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 px-4 py-2'>
            <div className='relative flex flex-col w-full max-w-2xl rounded-xl p-4 z-50 bg-gradient-to-br from-contrast to-secondary 
                shadow-lg shadow-black/25 max-h-full border border-contrast overflow-y-auto'
            >
                <button
                    className="absolute top-2 right-2 p-1 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors"
                    onClick={() => setPasswordPopup(false)}
                >
                    <X />
                </button>

                <h2 className="text-2xl md:text-3xl text-center font-bold mb-6">Salasana</h2>

                {file.passwordProtected && (
                    <div className="flex items-center justify-between gap-2 p-2 mb-4 border-b border-dashed border-navlink">
                        <div className='flex items-center gap-2 w-full '>
                            <LockKeyhole className='text-success' size={20} />
                            <p className="text-sm font-bold">Tiedosto on suojattu salasanalla.</p>
                        </div>

                        <button 
                            onClick={handlePasswordRemoving} 
                            className='text-sm font-semibold text-red-500 hover:text-red-600 whitespace-nowrap'
                            title='Poista salasana käytöstä'
                        >
                            Poista
                        </button>
                    </div>
                )}

                <ul className='flex flex-col gap-1 list-disc list-inside text-sm'>
                    <li>
                        Suojaa tiedosto antamalla sille salasana.
                    </li>
                    <li>
                        Kun tiedosto on suojattu, vain sinä näet sen ilman salasanaa.
                    </li>
                </ul>

                <form className="flex flex-col text-sm mt-4" onSubmit={savePassword}>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aseta salasana</label>
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

                    {passwordErr &&
                        <div className='flex items-center gap-2 px-3 py-2 mt-2 rounded-md justify-between bg-red-500'>
                            <p className='text-white text-sm'>{passwordErr}</p>
                            <button className='text-white' onClick={() => setPasswordErr(null)}>
                                <X />
                            </button>
                        </div>
                    }

                    <button 
                        type="submit" 
                        className="w-full py-2.5 px-3 mt-4 rounded-lg bg-primary text-white 
                        text-sm hover:bg-primary/75  transition-colors"
                    >
                        Tallenna
                    </button>
                </form>
            </div>
        </span>
    )
}

export default PasswordPopup