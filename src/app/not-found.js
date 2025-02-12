import React from 'react'
import Link from 'next/link';

function Custom404() {
  return (
    <div className='fixed flex top-0 left-0 right-0 flex-col justify-center items-center h-screen box-border gap-2'>
        <h1 className="text-7xl font-black text-foreground">404</h1>

        <img src='/404.svg' alt='404' className='w-72 h-auto' />

        <p className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl dark:text-white">
            Tulit ulos kaapista!
        </p>

        <p className="text-navlink">Etsimääsi sivua ei löytynyt.</p>

        <Link
            href="/"
            className="mt-2 inline-block rounded-full bg-primary px-5 py-3 text-sm text-white hover:bg-primary/90 focus:ring-3 focus:outline-hidden"
        >
            Takaisin kaappiin...
        </Link>
    </div>
    )
}

export default Custom404