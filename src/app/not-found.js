import React from 'react'
import Link from 'next/link';
import { ArrowLeftCircle } from 'lucide-react';

function Custom404() {
  return (
    <div className='fixed flex top-0 left-0 right-0 flex-col justify-center items-center h-screen box-border gap-2'>
        <h1 className="text-7xl font-black text-foreground">404</h1>

        <img src='/404_logo.svg' alt='404' className='w-72 h-auto' />

        <p className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl dark:text-white">
            Tulit ulos kaapista!
        </p>

        <p className="text-navlink">Etsimääsi sivua ei löytynyt.</p>

        <Link
            href="/"
            className="mt-2 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm text-white hover:bg-primary/90 focus:ring-3 focus:outline-hidden"
        >   
            <ArrowLeftCircle size={20} />
            Takaisin kaappiin...
        </Link>
    </div>
    )
}

export default Custom404