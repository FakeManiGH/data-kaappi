import React, {useState, useEffect} from 'react'
import { Eye, EyeOff } from 'lucide-react'

function PasswordPrompt({ setAccessPassword }) {
    const [showPassword, setShowPassword] = useState(false)

    const changeVisibility = () => setShowPassword(!showPassword)

    const applyPassword = (e) => {
        e.preventDefault()
        setAccessPassword(e.target.password.value)
    }

    return (
        <form className="flex flex-col gap-2 text-sm" onSubmit={applyPassword}>
            <label htmlFor="password" className='sr-only peer'>Anna salasana</label>
            <div className='relative max-w-xl border-b border-contrast2 group focus-within:border-primary'>
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