import React, {useState, useEffect} from 'react'
import { Eye, EyeOff, LockKeyholeOpen } from 'lucide-react'

function PasswordPrompt({ validatePassword }) {
    const [showPassword, setShowPassword] = useState(false)

    const changeVisibility = () => setShowPassword(!showPassword)


    return (
        <form className="flex flex-col gap-2 text-sm" onSubmit={validatePassword}>
            <label htmlFor="password" className='sr-only peer'>Anna salasana</label>
            <div className='relative'>
                <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="relative w-full py-2.5 px-3 bg-background text-sm border border-contrast outline-none focus:border-primary focus:ring-1 pe-12"
                    placeholder="Anna salasana..."
                    autofocus
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

            <button type='submit' className="py-2.5 px-3 bg-primary text-white text-sm hover:bg-primary/90 transition-colors">
                Avaa tiedosto
            </button>
        </form>
    )
}

export default PasswordPrompt