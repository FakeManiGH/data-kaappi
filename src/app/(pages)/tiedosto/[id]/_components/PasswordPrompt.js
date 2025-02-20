import React, {useState, useEffect} from 'react'
import { Eye, EyeOff } from 'lucide-react'

function PasswordPrompt({ validatePassword }) {
    const [showPassword, setShowPassword] = useState(false)

    const changeVisibility = () => setShowPassword(!showPassword)


    return (
        <form className="flex flex-col gap-2 text-sm" onSubmit={validatePassword}>
            <label htmlFor="password" className='sr-only peer'>Anna salasana</label>
            <div className='relative border-b border-contrast2 group focus-within:border-primary'>
                <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="p-2 px-3 outline-none bg-background focus:text-foreground pe-12"
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

            <button type='submit' className="flex justify-center whitespace-nowrap text-white w-fit bg-primary rounded-full p-2 px-4 hover:bg-primary/90 mt-1">
                Avaa tiedosto
            </button>
        </form>
    )
}

export default PasswordPrompt