import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'

function PasswordForm({ file }) {
    const [showPassword, setShowPassword] = useState(false)


    return (
    <>
        <label htmlFor="password" className="sr-only">Salasana</label>

        <div className="relative">
            <input
                type={showPassword ? 'text' : 'password'}
                className="w-full rounded-lg border border-contrast2 outline-1 focus:border-none p-2 px-3 pe-12"
                placeholder="Aseta salasana"
            />

            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <button 
                    className="text-navlink hover:text-primary" 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
            </span>
        </div>
    </>
    )
}

export default PasswordForm