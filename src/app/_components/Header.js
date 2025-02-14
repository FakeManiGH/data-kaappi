"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AlignJustify, LayoutDashboard, UploadCloud, Files, BadgeInfo } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

function Header() {
    const [dropdown, setDropdown] = useState(false)
    const { isSignedIn, user } = useUser()

    const navList = [
        {
            id: 1,
            name: 'Kojelauta',
            icon: LayoutDashboard,
            path: '/kojelauta'
        },
        {
            id: 2,
            name: 'Tallenna',
            icon: UploadCloud,
            path: '/tallenna'
        },
        {
            id: 3,
            name: 'Tiedostot',
            icon: Files,
            path: '/tiedostot'
        },
        {
            id: 4,
            name: 'Tietoa',
            icon: BadgeInfo,
            path: '/tietoa'
        }
    ]

    return (
    <header>
        <div className="relative flex items-center justify-between p-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
                <Image src='/logo.svg' alt="Logo" width={40} height={40} />
                <p>Data-Kaappi</p>
            </div>

            <div className="md:flex md:items-center md:gap-8">
                <nav aria-label="Global" className="hidden md:block">
                    <ul className="flex items-center gap-6 text-md">
                        {navList && navList.map((item) => (
                            <li key={item.id}>
                                <Link href={item.path} className="flex items-center gap-2 text-sm hover:text-primary">
                                    <item.icon size={20} /> 
                                    {item.name}
                                </Link>
                            </li>
                        ))}      
                    </ul>
                </nav>

                <div className="flex items-center gap-4">
                    {isSignedIn ? (
                        <Link
                            className="rounded-full bg-primary px-5 py-3 text-sm text-white shadow hover:bg-primary/75"
                            href="/kojelauta"
                        >
                            Kojelauta
                        </Link>
                    ) : (
                        <Link
                            className="rounded-full bg-primary px-5 py-3 text-sm text-white shadow hover:bg-primary/75"
                            href="/sign-in"
                        >
                            Kirjaudu
                        </Link>
                    )}

                    <div className="md:hidden">
                        <button className="rounded bg-dark p-2">
                            <AlignJustify 
                                className='cursor-pointer md:hidden text-foreground dark:text-gray-200 transition hover:text-primary' 
                                size={30}
                                onClick={() => setDropdown(!dropdown)}
                            />
                        </button>
                        {dropdown && (
                        <nav 
                            className="absolute top-full start-0 w-full z-50 shadow-md shadow-black/20 bg-background md:hidden overflow-hidden border border-t-0 border-contrast2" 
                            role="menu"
                        >
                            {navList && navList.map((item) => (
                                <Link
                                href={item.path}
                                key={item.id}
                                className="flex items-center text-sm w-full gap-2 p-4 hover:text-primary"
                                onClick={() => { setDropdown(false)}}
                                >
                                <item.icon size='20' />
                                <p>{item.name}</p>
                                </Link>
                            ))}
                        </nav>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </header>
    )
}

export default Header