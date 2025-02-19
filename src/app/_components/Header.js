"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useNavigation } from '../contexts/NavigationContext'
import { useUser } from '@clerk/nextjs'
import { AlignJustify } from 'lucide-react'

function Header() {
    const [dropdown, setDropdown] = useState(false)
    const { isSignedIn, user, isLoaded } = useUser()
    const { navList, setCurrentIndex } = useNavigation()

    return (
    <header>
        <div className="relative flex items-center justify-between p-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
                <Image src='/logo.svg' alt="Logo" width={40} height={40} />
                <p className='font-bold'>Data-Kaappi</p>
            </div>

            <div className="flex items-center gap-6">
                <nav aria-label="Global" className="hidden lg:block">
                    <ul className="flex items-center gap-6">
                        {navList && navList.map((item) => (
                            <li key={item.id}>
                                <Link 
                                    href={item.path} 
                                    className="flex items-center gap-2 text-sm hover:text-primary"
                                    onClick={() => setCurrentIndex(item.path)}
                                >
                                    <item.icon size={20} /> 
                                    {item.name}
                                </Link>
                            </li>
                        ))}      
                    </ul>
                </nav>

                <div className="flex items-center gap-4">
                    {isLoaded && isSignedIn ? (
                        <Link
                            className="rounded-full bg-primary px-5 py-3 text-sm text-white shadow hover:bg-primary/75"
                            href="/kojelauta"
                            onClick={() => setCurrentIndex('/kojelauta')}
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

                    <div className="lg:hidden">
                        <button 
                            className={`p-2 cursor-pointer transition hover:text-primary ${dropdown ? 'text-primary' : 'text-foreground'}`}
                            onClick={() => setDropdown(!dropdown)}
                        >
                            <AlignJustify size={30} />
                        </button>
                        {dropdown && (
                        <nav 
                            className="absolute top-full start-0 w-full z-50 shadow-md shadow-black/50 bg-background overflow-hidden border-b border-contrast2" 
                            role="menu"
                        >
                            {navList && navList.map((item) => (
                                <Link
                                    href={item.path}
                                    key={item.id}
                                    className="flex items-center justify-end text-sm w-full gap-2 py-4 px-8 hover:text-primary"
                                    onClick={() => {setDropdown(false), setCurrentIndex(item.path)}}
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