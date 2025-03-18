import { LockKeyhole, X } from 'lucide-react'
import React, { useEffect } from 'react'
import PasswordForm from './PasswordForm'

function PasswordPopup({ file, setFile, setPasswordPopup }) {

    useEffect(() => {
        // close popup when clicked outside
        const handleClick = (e) => {
            let overlay = document.getElementById('overlay')
            if (e.target === overlay) {
                setPasswordPopup(false)
            }
        }

        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [])

    return (
        <div className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 px-4 py-2'>
            <div className='relative flex flex-col gap-2 w-full max-w-2xl p-4 z-50 bg-gradient-to-br from-background to-contrast shadow-md max-h-full overflow-y-auto'>
                <button
                    className="absolute top-2 right-2 p-2 text-white bg-red-500 hover:bg-red-600"
                    onClick={() => setPasswordPopup(false)}
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl md:text-3xl mb-2 text-center font-bold">Salasana</h2>

                {file.passwordProtected ? (
                    <div className="flex items-center justify-center gap-2 p-2 mb-2 border border-success text-success">
                        <LockKeyhole size={20} />
                        <p className="text-sm text-center">Tiedosto on suojattu salasanalla.</p>
                    </div>
                ) : null}

                <ul className='flex flex-col gap-1 list-disc list-inside text-sm'>
                    <li>Suojaa tiedosto antamalla sille salasana.</li>
                    <li>Kun tiedosto on suojattu, vain sinä näet sen ilman salasanaa.</li>
                </ul>

                <PasswordForm file={file} setFile={setFile} setPasswordPopup={setPasswordPopup} />
            </div>
        </div>
    )
}

export default PasswordPopup