import CopyClipboard from '@/app/_components/_common/CopyClipboard'
import { AtSign, Share2, X } from 'lucide-react'
import React, { useEffect } from 'react'
import PasswordForm from './PasswordForm'
import SocialShare from '@/app/_components/_common/SocialShare'

function SharePopup({ file, open }) {

    useEffect(() => {
        // close popup when clicked outside
        const handleClick = (e) => {
            let overlay = document.getElementById('overlay')
            if (e.target === overlay) {
                open(false)
            }
        }

        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [])

    return (
    <div id="overlay" className="fixed inset-0 z-40 text-sm bg-black/50 flex items-center justify-center">
        <div className="relative w-full max-w-6xl mx-4 shadow-2xl shadow-black/75">
            <button
            className="absolute z-50 top-[-40px] right-0 p-1 text-white bg-red-500 hover:bg-red-500/90 rounded-full"
            onClick={() => open(false)}
            >
            <X size={24} />
            </button>

            <div className="relative flex flex-col w-full bg-background rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-3 px-4 bg-contrast">
                    <h2 className="text-2xl font-bold">Jaa tiedosto</h2>
                    <Share2 size={32} />
                </div>

                <div className="flex flex-col gap-2 p-4">
                    <SocialShare file={file} />

                    <div className="flex flex-col gap-1">
                        <p>Kopio linkki:</p>
                        <CopyClipboard message={file?.shortUrl} />
                    </div>
                    
                    <div className="flex flex-col gap-1 mt-4">
                        <p>Lähetä sähköposti:</p>
                        <form className="flex flex-col gap-2">
                            <div className="flex text-navlink rounded-lg overflow-hidden w-full">
                                <label htmlFor="email" className='flex bg-contrast items-center text-foreground p-2 px-3 border-r border-contrast2'>
                                    <AtSign size={20} />
                                </label>
                                <input 
                                    type="email"
                                    name='email' 
                                    className="w-full p-2 outline-none" 
                                    placeholder="Anna sähköpostiosoite"
                                />
                            </div>
                            <button className="flex justify-center whitespace-nowrap text-white w-[30%] min-w-fit bg-primary rounded-full p-2 px-4 hover:bg-primary/90">
                                Lähetä sähköposti
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default SharePopup