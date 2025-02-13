import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/../firebaseConfig'
import { useAlert } from '@/app/contexts/AlertContext'


function PasswordForm({ file, setFile, setPasswordPopup }) {
    const [showPassword, setShowPassword] = useState(false)
    const { showAlert } = useAlert()
    const fileID = file.fileID
    const password = file.password

    const savePassword = async (e) => {
        e.preventDefault()
        let newPassword = e.target.password.value
        const docRef = doc(db, 'files', fileID)
        await updateDoc(docRef, { password: newPassword })
        showAlert('Salasana tallennettu.', 'success')
        setFile({ ...file, password: newPassword })
        setPasswordPopup(false)
    }

    const removePassword = async () => {
        const docRef = doc(db, 'files', fileID)
        await updateDoc(docRef, { password: '' })
        showAlert('Salasana poistettu!', 'success')
        setFile({ ...file, password: '' })
        setPasswordPopup(false)
    }

    const changeVisibility = () => {
        setShowPassword(!showPassword)
    }


    return (
    <>
        <label htmlFor="password" className="sr-only">Salasana</label>

        <div className="relative" onSubmit={savePassword}>
            <form className="flex flex-col gap-2">
                <label htmlFor="password">Anna salasana:</label>
                <div className='relative'>
                    <input
                        id="password"
                        name="password"
                        defaultValue={password}
                        type={showPassword ? 'text' : 'password'}
                        className="p-2 px-3 w-full outline-none dark:bg-contrast dark:text-navlink focus:text-foreground rounded-lg pe-12"
                        placeholder="Kirjoita salasana"
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
                <div className='flex items-center gap-4'>
                    <button type='submit' className="flex justify-center whitespace-nowrap text-white w-[30%] min-w-fit bg-primary rounded-full p-2 px-4 hover:bg-primary/90">
                        Tallenna
                    </button>
                    {password && (
                        <button 
                            type='button'
                            className='text-red-500 hover:text-red-700'
                            onClick={removePassword}
                        >Poista salasana</button>
                    )}
                </div>
            </form>
        </div>
    </>
    )
}

export default PasswordForm