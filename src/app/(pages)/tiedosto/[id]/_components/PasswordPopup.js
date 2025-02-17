import CopyClipboard from '@/app/_components/_common/CopyClipboard'
import { AtSign, FileLock2Icon, X } from 'lucide-react'
import React, { useEffect } from 'react'
import PasswordForm from './PasswordForm'

function SharePopup({ file, setFile, setPasswordPopup }) {

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
    <div id="overlay" className="fixed inset-0 z-50 text-sm bg-black/50 flex items-center justify-center">
        <div className="relative w-full max-w-4xl mx-4 bg-background shadow-black/25 shadow-lg rounded-xl">
            <button
            className="absolute z-50 top-[-40px] right-0 p-1 text-white bg-red-500 hover:bg-red-500/90 rounded-full shadow-md shadow-black/35"
            onClick={() => setPasswordPopup(false)}
            >
                <X size={24} />
            </button>

            <div className="relative flex flex-col w-full bg-background rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-3 px-4">
                    <h2 className="text-2xl font-bold">Aseta tiedostolle salasana</h2>
                    <FileLock2Icon size={24} />
                </div>

                <div className="flex flex-col gap-2 p-4">
                    <PasswordForm file={file} setFile={setFile} setPasswordPopup={setPasswordPopup} />
                </div>
            </div>
        </div>
    </div>
    )
}

export default SharePopup