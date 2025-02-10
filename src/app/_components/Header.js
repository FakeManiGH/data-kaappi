import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function Header() {
  return (
    <header>
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
                <Image src='/logo.svg' alt="Logo" width={40} height={40} />
                <strong>Data-Kaappi</strong>
            </div>

            <div className="md:flex md:items-center md:gap-8">
                <nav aria-label="Global" className="hidden md:block">
                <ul className="flex items-center gap-6 text-md">
                    <li>
                        <Link className="text-foreground dark:text-gray-200 transition hover:text-primary" href="/tallenna"> Tallenna </Link>
                    </li>

                    <li>
                        <Link className="text-foreground dark:text-gray-200 transition hover:text-primary" href="/tiedostot"> Tiedostot </Link>
                    </li>

                    <li>
                        <Link className="text-foreground dark:text-gray-200 transition hover:text-primary" href="/tietoa"> Tietoa </Link>
                    </li>
                </ul>
                </nav>

                <div className="flex items-center gap-4">
                <div className="sm:flex sm:gap-4">
                    <Link
                    className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow hover:bg-primary/90"
                    href="/kojelauta"
                    >
                    Aloita
                    </Link>
                </div>

                <div className="block md:hidden">
                    <button className="rounded bg-dark p-2 text-gray-500 transition hover:text-gray-600/75">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    </button>
                </div>
                </div>
            </div>
            </div>
        </div>
        </header>

  )
}

export default Header