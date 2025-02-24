"use client"
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useNavigation } from '../contexts/NavigationContext'
import { useUser } from '@clerk/nextjs'
import { AlignJustify } from 'lucide-react'

function Header() {
    const [dropdown, setDropdown] = useState(false)
    const { isSignedIn, isLoaded } = useUser()
    const { navList } = useNavigation()
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [dropdownRef])

    return (
    <header>
        <div className="relative flex items-center justify-between p-4 w-full mx-auto bg-background dark:bg-gradient-to-b from-contrast to-background">
            <div className="flex items-center gap-2">
                <Image src='/logo.svg' alt="Logo" width={40} height={40} />
                <p className='font-bold'>Datakaappi</p>
            </div>

            <div className="flex items-center gap-6">
                <nav aria-label="Global" className="hidden lg:block">
                    <ul className="flex items-center gap-6">
                        {navList && navList.map((item) => (
                            <li key={item.id}>
                                <Link 
                                    href={item.path} 
                                    className="flex items-center gap-2 text-sm text-foreground hover:text-primary"
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
                            className="rounded-full bg-primary px-5 py-3 text-sm text-white shadow hover:bg-primary/90"
                            href="/kojelauta"
                        >
                            Kojelauta
                        </Link>
                    ) : (
                        <Link
                            className="rounded-full bg-primary px-5 py-3 text-sm text-white shadow hover:bg-primary/90"
                            href="/sign-in"
                        >
                            Kirjaudu
                        </Link>
                    )}

                    <div ref={dropdownRef} className="lg:hidden">
                        <button 
                            className={`p-2 cursor-pointer transition hover:text-primary ${dropdown ? 'text-primary' : 'text-foreground'}`}
                            onClick={() => setDropdown(!dropdown)}
                        >
                            <AlignJustify size={30} />
                        </button>
                        {dropdown && (
                        <nav 
                            className="absolute z-50 top-[85%] ml-auto inset-x-4 max-w-64 bg-background border border-contrast rounded-lg shadow-xl shadow-black/25 lg:hidden overflow-hidden" 
                            role="menu"
                        >
                            {navList && navList.map((item) => (
                                <Link
                                    href={item.path}
                                    key={item.id}
                                    className="flex items-center text-sm text-navlink w-full gap-2 py-3 px-4 hover:text-primary"
                                    onClick={() => setDropdown(false)}
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