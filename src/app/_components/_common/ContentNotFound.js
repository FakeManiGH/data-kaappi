import { Home, RotateCw } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function ContentNotFound({ message }) {
    return (
        <main>
            <div className='flex flex-col gap-4 items-center justify-center h-96'>
                <h1 className='text-7xl font-black'>404</h1>
                <h2 className='text-2xl md:text-3xl font-bold'>Nyt kävi hassusti...</h2>

                {message &&
                <p className='text-center text-md text-navlink'>
                    <strong className='text-foreground'>Viesti: </strong>
                    {message}
                </p>}

                <button 
                    className='flex items-center gap-2 text-sm text-primary hover:text-primary/75'
                    onClick={() => window.location.reload()}
                >
                    <RotateCw size={20} />
                    Yritä uudelleen
                </button>

                <Link href='/' className='flex items-center gap-1 px-3 py-2 rounded-full text-white bg-gradient-to-br from-primary to-blue-800 hover:to-primary transition-colors'>
                    <Home />
                    Etusivulle
                </Link>
            </div>
        </main>
    ) 
}

export default ContentNotFound