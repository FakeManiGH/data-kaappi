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

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
        document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownRef])

  return (
    <header className='flex md:justify-end items-center justify-between gap-2 p-4 z-50 bg-background'>
      <div className='md:hidden relative' ref={dropdownRef}>
        <button
          id='dropdownBtn'
          className='py-2 cursor-pointer transition hover:text-primary'
          onClick={() => setDropdown(true)}
        >
          <AlignJustify size={32} />
        </button>

        {/* Dropdown */}
          <div
            className={`fixed inset-0 z-50 origin-top-left bg-background flex justify-center
              transition-transform ease-in overflow-y-auto
              ${dropdown ? 'scale-1' : 'scale-0'}`}
            role="menu"
          > 
            <button className='fixed right-0 top-0 p-4 hover:text-primary' onClick={() => setDropdown(false)}>
              <X size={32} />
            </button>

            <nav className='flex flex-col py-6 gap-2 mt-12 sm:mt-0'>
              {navList && navList.map((item) => (
                <Link
                  href={item.path}
                  key={item.id}
                  className={`flex items-center w-full gap-6 p-3 last:pb-6 group ${currentIndex === item.path ? 'text-foreground' : 'text-navlink'}`}
                  onClick={() => setDropdown(false)}
                >
                  <item.icon className={`group-hover:text-primary ${currentIndex === item.path && 'text-primary'}`} />
                  <p className='group-hover:text-foreground'>{item.name}</p>
                </Link>
              ))}
            </nav>
          </div>
      </div>

      <Link 
        href='/' 
        className='flex items-center gap-2 md:hidden font-bold'
      >
          <Image src='/logo.svg' alt="Logo" width={40} height={40} />
          Datakaappi
      </Link>

      <UserButton />
  </header>
  )
}

export default TopHeader