"use client"
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useNavigation } from '../contexts/NavigationContext'
import { useUser } from '@clerk/nextjs'
import { AlignJustify, CircleGauge, LogIn, X } from 'lucide-react'

function Header() {
    const [dropdown, setDropdown] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const { isLoaded, user } = useUser()
    const { publicNav, currentIndex } = useNavigation()
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdown(false)
            }
        }

        if (isLoaded && user) setIsLoggedIn(true)

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [dropdownRef, isLoaded, user])

    return (
    <header>
        <div className="relative p-4 w-full">
            <div className='flex items-center justify-between gap-2 mx-auto max-w-7xl'>
                <div className="flex items-center gap-2">
                    <Image src='/logo.svg' alt="Logo" width={40} height={40} />
                    <p className='font-bold text-foreground'>Datakaappi</p>
                </div>

                <div className="flex items-center gap-4">
                    <nav aria-label="Global" className="hidden lg:block">
                        <ul className="flex items-center gap-4">
                            {publicNav && publicNav.map((item) => (
                                <li key={item.id}>
                                    <Link 
                                        href={item.path} 
                                        className={`flex items-center gap-2 py-0.5 text-sm text-foreground hover:text-primary 
                                            ${currentIndex === item.path ? 'text-primary' : 'text-foreground'}`}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}      
                        </ul>
                    </nav>

                    <div className="flex items-center gap-4">
                        {isLoaded && user ? (
                            <Link
                                className="flex gap-1 items-center px-3 py-2 text-sm bg-primary text-white 
                                    rounded-lg hover:bg-primary/75 transition-colors "
                                href="/kojelauta"
                            >   
                                <CircleGauge />
                                Kojelauta
                            </Link>
                        ) : (
                            <Link
                                className="flex gap-1 items-center px-3 py-2 text-sm bg-primary text-white 
                                    rounded-lg hover:bg-primary/75 transition-colors "
                                href="/sign-in"
                            >   
                                <LogIn />
                                Kirjaudu
                            </Link>
                        )}

                        <div className='md:hidden relative flex items-center' ref={dropdownRef}>
                            <button 
                                className='text-foreground hover:text-primary cursor-pointer transition-colors'
                                onClick={() => setDropdown(!dropdown)}
                            >
                                <AlignJustify size={30} />
                            </button>
            
                            <div
                                className={`fixed inset-0 z-50 origin-right bg-background flex justify-center transition-transform ease-in 
                                    overflow-y-auto ${dropdown ? 'scale-x-1' : 'scale-x-0'}`}
                                role="menu"
                            >
                                <button className='fixed right-0 top-0 p-4 text-foreground hover:text-primary' onClick={() => setDropdown(false)}>
                                    <X size={32} />
                                </button>

                                <nav 
                                    className="flex flex-col py-6 gap-2 mt-12 sm:mt-0" 
                                    role="menu"
                                >
                                    {publicNav && publicNav.map((item) => (
                                        <Link
                                            href={item.path}
                                            key={item.id}
                                            className={`flex items-center w-full gap-6 p-3 text-sm last:pb-6 hover:text-primary group ${currentIndex === item.path ? 'text-primary' : 'text-navlink'}`}
                                            onClick={() => setDropdown(false)}
                                        >   
                                            <item.icon className={`group-hover:text-primary ${currentIndex === item.path && 'text-primary'}`} />
                                            <p>{item.name}</p>
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
    )
}

export default Header