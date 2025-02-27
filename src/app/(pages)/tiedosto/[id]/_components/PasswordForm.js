import { Eye, EyeOff, Save } from 'lucide-react'
import React, { useState } from 'react'
import { useAlert } from '@/app/contexts/AlertContext'
import { useUser } from '@clerk/nextjs'
import { updateFilePassword } from '@/app/file-requests/api'


function PasswordForm({ file, setFile, setPasswordPopup }) {
    const [showPassword, setShowPassword] = useState(false)
    const { showAlert } = useAlert()
    const fileID = file.fileID
    const password = file.password
    const { user } = useUser()

    // Save password
    const savePassword = async (e) => {
        e.preventDefault()
        let newPassword = e.target.password.value

        try {
            await updateFilePassword(user.id, fileID, newPassword)
            showAlert('Tiedoston salasana tallennettu.', 'success')
            setFile({ ...file, password: 'salasana' })
            setPasswordPopup(false)
        } catch (error) {
            console.error('Error saving password: ', error)
            showAlert('Salasanan tallentaminen epäonnistui.', 'error')
        }    
    }

    // Remove password
    const removePassword = async () => {
        try {
            await updateFilePassword(user.id, fileID, '')
            showAlert('Salasana poistettu.', 'success')
            setFile({ ...file, password: '' })
            setPasswordPopup(false)
        } catch (error) {
            console.error('Error removing password: ', error)
            showAlert('Salasanan poistaminen epäonnistui.', 'error')
        }
    }

    const changeVisibility = () => setShowPassword(!showPassword)



    return (
    <>
        <label htmlFor="password" className="sr-only">Salasana</label>

        <div className="relative">
            <form className="flex flex-col gap-2 text-sm" onSubmit={savePassword}>
                <label htmlFor="password">Anna salasana:</label>
                <div className='relative'>
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        className="relative w-full font-light border border-contrast rounded-full group overflow-hidden focus-within:border-primary px-3 py-2.5 outline-none bg-background focus:text-foreground pe-12"
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
                <div className='flex items-center gap-2'>
                    <button type='submit' className="flex items-center justify-center w-fit px-3 py-2 group border border-contrast rounded-full text-navlink text-sm gap-2 hover:text-foreground hover:border-primary transition-colors">
                        <Save className='text-primary' />
                        Tallenna salasana
                    </button>
                    {password && (
                        <button 
                            type='button'
                            className='bg-red-500 hover:bg-red-600 text-sm text-white rounded-full p-2 px-3'
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