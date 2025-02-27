import React, {useState, useEffect} from 'react'
import { Eye, EyeOff, LockKeyholeOpen } from 'lucide-react'

function PasswordPrompt({ validatePassword }) {
    const [showPassword, setShowPassword] = useState(false)

    const changeVisibility = () => setShowPassword(!showPassword)


    return (
        <form className="flex flex-col gap-2 text-sm" onSubmit={validatePassword}>
            <label htmlFor="password" className='sr-only peer'>Anna salasana</label>
            <div className='relative border border-contrast rounded-full group overflow-hidden focus-within:border-primary'>
                <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="px-4 py-3 outline-none bg-background focus:text-foreground pe-12"
                    placeholder="Anna salasana..."
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

            <button type='submit' className="flex items-center justify-center w-fit px-3 py-2 group border border-contrast rounded-full text-navlink text-sm gap-2 hover:text-foreground hover:border-primary transition-colors mt-1">
                <LockKeyholeOpen className='text-primary' />
                Avaa tiedosto
            </button>
        </form>
    )
}

export default PasswordPrompt