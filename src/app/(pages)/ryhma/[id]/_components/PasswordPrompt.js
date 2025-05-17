import PopupLoader from '@/app/_components/_common/PopupLoader';
import { Eye, EyeOff, X } from 'lucide-react'
import React, { useState } from 'react'


function PasswordPrompt({ handleSubmit, loading, error, setError, handleCancel }) {
  const [showPassword, setShowPassword] = useState(false);
  
    if (loading) return <PopupLoader />

    return (
        <span className='fixed z-50 inset-0 flex justify-center items-center bg-black/50 p-4'>
            <div className='relative flex flex-col w-full max-w-2xl  p-4 z-50 bg-gradient-to-br from-contrast to-secondary 
                shadow-lg shadow-black/25 max-h-full border border-contrast overflow-y-auto'
            >
                <h2 className="text-2xl md:text-3xl text-center font-bold">Sisältö suojattu</h2>
                <p className='text-sm mt-4'>Sisältö on suojattu salasanalla, anna salasana jatkaaksesi eteenpäin.</p>
                <form className="flex flex-col mt-2" onSubmit={handleSubmit}>
                    <label htmlFor="password" className="block mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Anna salasana:
                    </label>
                    <div className='relative'>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            className="relative w-full py-2 px-3 bg-background text-sm border border-transparent outline-none focus:border-primary focus:ring-1 pe-12"
                            placeholder="Kirjoita salasana..."
                            autoFocus
                        />
                        <span className="flex items-center absolute inset-y-0 end-0 px-4">
                            <button 
                                className="text-navlink hover:text-primary" 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </span>
                    </div>

                    {error && 
                        <div className='flex items-center justify-between gap-4 px-3 py-2 mt-2 text-white text-sm bg-red-500'>
                            <p>{error}</p>
                            <button onClick={() => setError(null)}><X size={20} /></button>
                        </div>
                    }
                    
                    <div className='flex items-center gap-1 mt-2'>
                        <button 
                            type="submit" 
                            className="w-full py-2 px-3  bg-primary text-white 
                            text-sm hover:bg-primary/75  transition-colors"
                        >
                            Lähetä
                        </button>
                        <button 
                            type='button'
                            className='w-full py-2 px-3  text-white text-sm bg-gray-500 hover:bg-gray-600'
                            onClick={handleCancel}
                        >
                            Peruuta
                        </button>
                    </div>
                </form>
            </div>
        </span>
    )
}

export default PasswordPrompt