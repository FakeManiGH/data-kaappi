import React, {useState } from 'react'
import { Eye, EyeOff, X } from 'lucide-react'
import { verifyFilePassword } from '@/app/file-requests/files'

function PasswordPrompt({ fileID, setFile, setPwdVerified }) {
    const [showPassword, setShowPassword] = useState(false);
    const [passwordErr, setPasswordErr] = useState(null);

    const changeVisibility = () => setShowPassword(!showPassword);

    const verifyPassword = async (e) => {
        try {
            e.preventDefault();
            const password = e.target.password.value

            if (!password) setPasswordErr('Anna ensin kelvollinen salasana.');

            const response = await verifyFilePassword(fileID, password);

            if (response.success) {
                setPwdVerified(true);
                setFile(response.data);
            } else {
                setPasswordErr(response.message);
            }
        } catch (error) {
            console.error('Error verifying password: ' + error);
            setPasswordErr('Salasanan tarkistamisessa tapahtui virhe, yritä uudelleen.');
        }
    }

    return (
        <div className='flex flex-col gap-2 p-4 justify-center min-h-96 max-w-3xl mx-auto'>
            <h2 className='text-center text-2xl md:text-3xl font-semibold mb-4'>Sisältö suojattu salasanalla</h2>
            <p className='text-sm'>Anna salasana nähdäksesi sisältö.</p>

            <form className="flex flex-col gap-2 text-sm" onSubmit={verifyPassword}>
                <label htmlFor="password" className='sr-only peer'>Anna salasana</label>
                <div className='relative'>
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        className="relative w-full py-2.5 px-3 bg-background text-sm border border-contrast outline-none focus:border-primary focus:ring-1 pe-12"
                        placeholder="Anna salasana..."
                        autoFocus
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

                <button 
                    type='submit'
                    className="py-2.5 px-3 rounded-full bg-primary text-white text-sm hover:bg-primary/75 transition-colors
                        "
                >
                    Avaa sisältö
                </button>
            </form>

            {passwordErr &&
                <div className='flex items-center justify-between gap-2 mt-4'>
                    <p className='text-sm text-red-500'>{passwordErr}</p>
                    <button className='text-navlink hover:text-primary transition-colors' onClick={() => setPasswordErr(null)}>
                        <X />
                    </button>
                </div>
            }
        </div>
    )
}

export default PasswordPrompt