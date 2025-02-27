import { LockKeyhole, X } from 'lucide-react'
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
        <div id="overlay" tabIndex="-1" aria-hidden="true" className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="relative flex flex-col max-w-2xl w-full h-[calc(100%-2rem)] max-h-[calc(100%-2rem)] sm:h-fit bg-background rounded-xl overflow-y-auto m-4">
                <div className="flex items-center justify-between gap-2 p-3 px-4">
                    <LockKeyhole size={24} />
                    <h2 className="text-xl font-bold">Aseta salasana</h2>
                    <button
                        className="p-1 text-white bg-red-500 hover:bg-red-600 rounded-full"
                        onClick={() => setPasswordPopup(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                {file.password ? (
                    <div className="flex items-center justify-center gap-2 p-4 text-success">
                        <LockKeyhole size={20} />
                        <p className="text-sm text-center">Tiedosto on suojattu salasanalla.</p>
                    </div>
                ) : null}

                <ul className='flex flex-col gap-1 p-4 py-2 list-disc list-inside text-sm'>
                    <li>Suojaa tiedosto ulkopuolisilta antamalla sille salasana.</li>
                    <li>Vain tiedoston omistaja (sinä) näkee tiedoston ilman salasanaa.</li>
                </ul>

                <div className="flex flex-col gap-2 p-4 pt-2">
                    <PasswordForm file={file} setFile={setFile} setPasswordPopup={setPasswordPopup} />
                </div>
            </div>
        </div>
    )
}

export default SharePopup