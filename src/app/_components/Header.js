"use client"
import React, { useState, useEffect } from 'react'
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

    useEffect(() => {
        if (isLoaded && user) setIsLoggedIn(true);
    }, [isLoaded, user])


    return (
    <header>
        <div className="relative bg-background p-4 w-full">
            <div className='flex items-center justify-between gap-2 mx-auto max-w-7xl'>
                <div className="flex items-center gap-2">
                    <Image src='/logo.svg' alt="Logo" width={40} height={40} />
                    <p className='font-bold text-foreground'>Datakaappi</p>
                </div>

                <div className="flex items-center gap-4">
                    <nav aria-label="Global" className="hidden md:block">
                        <ul className="flex items-center gap-4">
                            {publicNav && publicNav.map((item) => (
                                <li key={item.id}>
                                    <Link 
                                        href={item.path} 
                                        className={`flex items-center gap-2 py-0.5 text-sm hover:text-primary 
                                            ${currentIndex === item.path ? 'text-primary' : 'text-navlink'}`}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}      
                        </ul>
                    </nav>

                    <div className="flex items-center gap-4">
                        {isLoggedIn ? (
                            <Link
                                className="flex gap-1 items-center px-3 py-2 text-sm bg-primary text-white 
                                     hover:bg-primary/75 transition-colors "
                                href="/kojelauta"
                            >   
                                <CircleGauge />
                                Kojelauta
                            </Link>
                        ) : (
                            <Link
                                className="flex gap-1 items-center px-3 py-2 text-sm bg-primary text-white 
                                     hover:bg-primary/75 transition-colors "
                                href="/sign-in"
                            >   
                                <LogIn />
                                Kirjaudu
                            </Link>
                        )}

                        <div className='md:hidden relative flex items-center'>
                            <button 
                                className='hover:text-primary cursor-pointer transition-colors'
                                onClick={() => setDropdown(!dropdown)}
                            >
                                <AlignJustify size={30} />
                            </button>
            
                            <div
                                className={`fixed inset-0 z-50 origin-right bg-background p-2 pb-6 flex justify-center transition-transform ease-in 
                                    overflow-y-auto ${dropdown ? 'scale-x-1' : 'scale-x-0'}`}
                                role="menu"
                            >
                                <div className='flex flex-col gap-6 w-full'>
                                    <button className='w-fit  self-end text-foreground hover:text-primary' onClick={() => setDropdown(false)}>
                                        <X size={32} />
                                    </button>

                                    <nav className='flex flex-col gap-1'>
                                        {publicNav && publicNav.map((item) => (
                                        <Link
                                            href={item.path}
                                            key={item.id}
                                            className={`flex items-center gap-6 p-2 group hover:bg-primary hover:text-white  transition-colors
                                            ${currentIndex === item.path ? 'bg-primary text-white' : 'bg-contrast'}`}
                                            onClick={() => setDropdown(false)}
                                        >
                                            <item.icon />
                                            <p className='text-sm'>{item.name}</p>
                                        </Link>
                                        ))}
                                    </nav>
                                </div>
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