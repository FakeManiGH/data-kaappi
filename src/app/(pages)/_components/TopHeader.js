"use client"
import { AlignJustify, X } from 'lucide-react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs';
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link';
import { useNavigation } from '@/app/contexts/NavigationContext'

function TopHeader() {
  const [dropdown, setDropdown] = useState(false)
  const { navList, currentIndex } = useNavigation()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false)
      }
    }

    // Prevent scrolling when dropdown is active
    if (dropdown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = '' // Restore default scrolling
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.body.style.overflow = '' // Clean up on unmount
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdown])

  return (
    <header 
      className='flex md:justify-end items-center justify-between gap-2 p-4 z-50 bg-gradient-to-tl from-primary to-blue-800 dark:from-blue-800 dark:to-blue-950
        md:from-background md:to-background dark:md:from-background dark:md:to-background'
    >
      <div className='md:hidden relative' ref={dropdownRef}>
        <button
          id='dropdownBtn'
          className='py-2 cursor-pointer transition text-white hover:text-yellow-400'
          onClick={() => setDropdown(true)}
        >
          <AlignJustify size={32} />
        </button>

        {/* Dropdown */}
          <div
            className={`fixed inset-0 z-50 origin-left bg-background flex justify-center bg-gradient-to-tl from-primary to-blue-800 dark:from-blue-800 dark:to-blue-950
              transition-transform ease-in overflow-y-auto
              ${dropdown ? 'scale-x-1' : 'scale-x-0'}`}
            role="menu"
          > 
            <button className='fixed right-0 top-0 p-4 text-white hover:text-yellow-300' onClick={() => setDropdown(false)}>
              <X size={32} />
            </button>

            <nav className='flex flex-col py-6 gap-2 mt-12 sm:mt-0'>
              {navList && navList.map((item) => (
                <Link
                  href={item.path}
                  key={item.id}
                  className={`flex items-center w-full gap-6 p-3 last:pb-6 group ${currentIndex === item.path ? 'text-yellow-300' : 'text-white'}`}
                  onClick={() => setDropdown(false)}
                >
                  <item.icon className={`group-hover:text-yellow-300 ${currentIndex === item.path && 'text-yellow-300'}`} />
                  <p className='text-sm'>{item.name}</p>
                </Link>
              ))}
            </nav>
          </div>
      </div>

      <Link 
        href='/' 
        className='flex items-center gap-2 md:hidden font-bold text-white hover:text-yellow-400'
      >
          <Image src='/logo.svg' alt="Logo" width={40} height={40} />
          Datakaappi
      </Link>

      <UserButton />
  </header>
  )
}

export default TopHeader