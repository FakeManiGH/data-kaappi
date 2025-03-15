import { Eye, EyeOff, Save } from 'lucide-react'
import React, { useState } from 'react'
import { useAlert } from '@/app/contexts/AlertContext'
import { useUser } from '@clerk/nextjs'
import { updateFilePassword } from '@/app/file-requests/api'


function PasswordForm({ file, setFile, setPasswordPopup }) {
    const [showPassword, setShowPassword] = useState(false)
    const { showAlert } = useAlert()
    const { user } = useUser()

    // Save password
    const savePassword = async (e) => {
        e.preventDefault()
        let newPassword = e.target.password.value

        try {
            await updateFilePassword(user.id, file.id, newPassword)
            showAlert('Tiedoston salasana tallennettu.', 'success')
            setFile({ ...file, passwordProtected: true })
            setPasswordPopup(false)
        } catch (error) {
            console.error('Error saving password: ', error)
            showAlert('Salasanan tallentaminen epäonnistui.', 'error')
        }    
    }

    // Remove password
    const removePassword = async () => {
        try {
            await updateFilePassword(user.id, file.id, '')
            showAlert('Salasana poistettu.', 'success')
            setFile({ ...file, passwordProtected: false })
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

        <div className="relative mt-2">
            <form className="flex flex-col gap-2 text-sm" onSubmit={savePassword}>
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
                <div className='flex flex-col sm:flex-row items-center gap-1'>
                    <button type="submit" className="w-full py-2.5 px-3 bg-primary text-white text-sm hover:bg-primary/90 transition-colors">Tallenna</button>
                    {file.passwordProtected && (
                        <button 
                            type='button'
                            className='w-full bg-red-500 hover:bg-red-600 text-sm text-white whitespace-nowrap py-2.5 px-3'
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