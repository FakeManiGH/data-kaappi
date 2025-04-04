import { Eye, EyeOff, X } from 'lucide-react'
import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs';

function CreateGroupPopup({ setCreateGroup }) {
    const [passwordProtected, setPasswordProtected] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [nameError, setNameError] = useState(null);
    const [descError, setDescError] = useState(null);
    const [visibilityError, setVisibilitiyError] = useState(null);
    const [pwdError, setPwdError] = useState(null);
    const { user } = useUser();

    // Password switch
    const handlePasswordProtecting = (e) => {
        setPasswordProtected(e.target.checked);
    }

    // Password visibility
    const changeVisibility = () => {
        setShowPassword(!showPassword);
    }

    return (
    <div className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 px-4 py-2'>
        <div className='relative flex flex-col w-full max-w-2xl rounded-xl p-4 z-50 bg-gradient-to-br from-contrast to-secondary 
            shadow-lg shadow-black/25 max-h-full border border-contrast overflow-y-auto'
        >
            <button 
                onClick={() => setCreateGroup(false)} 
                className='absolute top-2 right-2 p-1 rounded-full text-white bg-red-500 hover:bg-red-600 transition-colors'
            >
                <X />
            </button>

            <h2 className="text-2xl md:text-3xl mb-6 text-center font-bold">Luo uusi ryhmä</h2>
            <p className='text-sm'>
                Luo uusi ryhmä, jossa jakaa tiedostoja julkisesti tai yksityisesti.
            </p>

            <form className='flex flex-col text-sm mt-4'>
                <label htmlFor='groupName' className='text-gray-700 dark:text-gray-300'>Ryhmän nimi:</label>
                <input
                    id='groupName'
                    name='groupName'
                    placeholder='Anna ryhmälle nimi...'
                    className='w-full py-2.5 px-3 bg-background text-sm border border-transparent outline-none focus:border-primary focus:ring-1'
                />

                <label htmlFor='groupDesc' className='text-gray-700 dark:text-gray-300 mt-2'>Kuvaus:</label>
                <textarea
                    id='groupDesc'
                    name='groupDesc'
                    placeholder='Anna kuvaus ryhmälle...'
                    rows='3'
                    className='w-full py-2.5 px-3 bg-background text-sm border border-transparent outline-none focus:border-primary focus:ring-1'
                />

                <label htmlFor='groupDesc' className='text-gray-700 dark:text-gray-300 mt-2'>Näkyvyys:</label>
                <select
                    id='groupVisibility'
                    name='groupVisibility'
                    defaultValue='private'
                    className='w-full py-2.5 px-3 bg-background text-sm border border-transparent outline-none focus:border-primary focus:ring-1'
                >
                    <option value='private'>Yksityinen</option>
                    <option value='public'>Julkinen</option>
                </select>

                <label className='flex items-center cursor-pointer w-fit mt-4'>
                    <input 
                        type="checkbox" 
                        value="" 
                        className="sr-only peer" 
                        checked={passwordProtected}
                        onChange={handlePasswordProtecting} 
                    />
                    <div className="relative w-11 h-6 bg-gray-400 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                        dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full 
                        rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                        after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                        dark:border-gray-600 peer-checked:bg-primary"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Suojaa salasanalla</span>
                </label>

                {passwordProtected && 
                    <div className='relative mt-2'>
                        <label htmlFor='groupPwd' className='text-gray-700 dark:text-gray-300'>Salasana:</label>
                        <input
                            id="groupPwd"
                            name="groupPwd"
                            type={showPassword ? 'text' : 'password'}
                            className="relative w-full py-2.5 px-3 bg-background text-sm border border-transparent outline-none focus:border-primary focus:ring-1 pe-12"
                            placeholder="Kirjoita salasana..."
                        />
                        <span className="flex items-center absolute bottom-2.5 right-0 px-4">
                            <button 
                                className="text-navlink hover:text-primary" 
                                type="button"
                                onClick={changeVisibility}
                            >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </span>
                    </div>
                }

                <button 
                    type="submit" 
                    className="w-full mt-4 py-2.5 px-3 rounded-full bg-primary text-white 
                        text-sm hover:bg-primary/75  transition-colors"
                >
                    Luo ryhmä
                </button>
            </form>
        </div>
    </div>
    )
}

export default CreateGroupPopup