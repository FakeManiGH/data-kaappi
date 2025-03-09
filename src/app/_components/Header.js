"use client"
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useNavigation } from '../contexts/NavigationContext'
import { useUser } from '@clerk/nextjs'
import { AlignJustify, CircleGauge, LogIn } from 'lucide-react'

function Header() {
    const [dropdown, setDropdown] = useState(false)
    const { isSignedIn, isLoaded } = useUser()
    const { publicNav, currentIndex } = useNavigation()
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
        <div className="relative flex items-center justify-between p-4 w-full bg-background max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
                <Image src='/logo.svg' alt="Logo" width={40} height={40} />
                <p className='font-bold'>Datakaappi</p>
            </div>

            <div className="flex items-center gap-4">
                <nav aria-label="Global" className="hidden lg:block">
                    <ul className="flex items-center gap-4">
                        {publicNav && publicNav.map((item) => (
                            <li key={item.id}>
                                <Link 
                                    href={item.path} 
                                    className={`flex items-center gap-2 text-sm text-navlink hover:text-primary ${currentIndex === item.path ? 'text-primary' : 'text-navlink'}`}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}      
                    </ul>
                </nav>

                <div className="flex items-center gap-4">
                    {isLoaded && isSignedIn ? (
                        <Link
                            className="flex gap-1 items-center px-3 py-2.5 text-sm shadow-md bg-primary text-white
                                hover:shadow-lg hover:bg-primary/75 transition-all"
                            href="/kojelauta"
                        >   
                            <CircleGauge size={20} />
                            Kojelauta
                        </Link>
                    ) : (
                        <Link
                            className="flex gap-1 items-center px-3 py-2.5 text-sm shadow-md bg-primary text-white
                                hover:shadow-lg hover:bg-primary/75 transition-all"
                            href="/sign-in"
                        >   
                            <LogIn size={20} />
                            Kirjaudu
                        </Link>
                    )}

                    <div ref={dropdownRef} className="flex lg:hidden">
                        <button 
                            className={`cursor-pointer transition hover:text-primary ${dropdown ? 'text-primary' : 'text-foreground'}`}
                            onClick={() => setDropdown(!dropdown)}
                        >
                            <AlignJustify size={30} />
                        </button>
                        {dropdown && (
                        <nav 
                            className="absolute z-50 top-[85%] ml-auto inset-x-4 max-w-64 bg-background border border-contrast shadow-xl shadow-black/25 overflow-hidden" 
                            role="menu"
                        >
                            {publicNav && publicNav.map((item) => (
                                <Link
                                    href={item.path}
                                    key={item.id}
                                    className="flex items-center text-sm text-navlink w-full gap-2 py-3 px-4 hover:text-primary"
                                    onClick={() => setDropdown(false)}
                                >
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