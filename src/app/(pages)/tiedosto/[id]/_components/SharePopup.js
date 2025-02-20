import CopyClipboard from '@/app/_components/_common/CopyClipboard'
import { AtSign, Share2, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { updateDocumentValue } from '@/app/file-requests/api'
import { useAlert } from '@/app/contexts/AlertContext'

function SharePopup({ file, setFile, setSharePopup }) {
    const [shared, setShared] = useState(file.shared)
    const fileID = file.fileID
    const { showAlert } = useAlert()

    useEffect(() => {
        const handleClick = (e) => {
            let overlay = document.getElementById('overlay')
            if (e.target === overlay) {
                setSharePopup(false)
            }
        }

        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [])

    const handleSharing = async (e) => {
        e.preventDefault()
        const newSharedValue = e.target.checked
        try {
            await updateDocumentValue(fileID, 'shared', newSharedValue)
            setShared(newSharedValue)
            setFile({ ...file, shared: newSharedValue })
        } catch (error) {
            showAlert('error', 'Tiedoston jakaminen epäonnistui')
        }
    }

    return (
        <div id="overlay" tabIndex="-1" aria-hidden="true" className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="flex flex-col max-w-2xl w-full h-[calc(100%-2rem)] max-h-[calc(100%-2rem)] sm:h-fit bg-background rounded-xl overflow-y-auto m-4">
                
                <div className="flex items-center justify-between gap-2 p-3 px-4 mb-2">
                    <Share2 size={24} />
                    <h2 className="text-xl font-bold">Jaa tiedosto</h2>
                    <button
                        className="p-1 text-white bg-red-500 hover:bg-red-600 rounded-full"
                        onClick={() => setSharePopup(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                <label className={`flex items-center cursor-pointer w-fit p-4 py-2 ${!shared ? 'pb-4' : 'pb-2'}`}>
                    <input 
                        type="checkbox" 
                        value="" 
                        className="sr-only peer" 
                        checked={shared}
                        onChange={handleSharing} 
                    />
                    <div className="relative w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                        dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-contrast2 peer-checked:after:translate-x-full 
                        rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                        after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                        dark:border-gray-600 peer-checked:bg-primary"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Tiedosto {shared ? 'jaettu' : 'ei jaettu'}</span>
                </label>

                {shared && (
                    <div className='flex flex-col gap-2 p-4 py-2'>
                        <ul className='flex flex-col gap-1 py-2 list-disc list-inside text-sm'>
                            <li>Jaettu tiedosto näkyy kaikille käyttäjille.</li>
                            <li>Voit rajoittaa jaettuun tiedostoon pääsy asettamalla sille salasanan <span className='text-navlink'>toiminnoista</span>.</li>
                        </ul>

                        <div className="flex flex-col gap-1">
                            <p>Kopio linkki:</p>
                            <CopyClipboard message={file?.shortUrl} />
                        </div>

                        <div className="flex flex-col gap-1 mt-4 pb-2">
                            <p>Lähetä sähköpostiin:</p>
                            <form className="flex flex-col gap-2">
                                <div className="flex text-navlink rounded-lg overflow-hidden w-full">
                                    <label htmlFor="email" className='flex bg-contrast items-center text-foreground p-2 px-3 border-r border-contrast2'>
                                        <AtSign size={18} />
                                    </label>
                                    <input 
                                        type="email"
                                        name='email' 
                                        className="w-full p-2 outline-none dark:bg-contrast dark:text-navlink focus:text-foreground" 
                                        placeholder="Anna sähköpostiosoite"
                                    />
                                </div>
                                <button className="flex justify-center whitespace-nowrap text-white w-[30%] min-w-fit bg-primary rounded-full p-2 px-4 mt-1 hover:bg-primary/90">
                                    Lähetä sähköposti
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SharePopup