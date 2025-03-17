"use client"
import { AlignJustify } from 'lucide-react'
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
    <header className='relative flex md:justify-end items-center justify-between gap-2 p-4 z-50 bg-background'>
      <div className='md:hidden' ref={dropdownRef}>
        <button
          id='dropdownBtn'
          className={`py-2 cursor-pointer transition hover:text-primary ${dropdown ? 'text-primary' : 'text-foreground'}`}
          onClick={() => setDropdown(!dropdown)}
        >
          <AlignJustify size={30} />
        </button>

        {/* Dropdown */}
        {dropdown && (
          <div
            id='dropdownMenu'
            className="absolute z-50 rogue-dropmenu sm:max-w-64 bg-background border border-contrast shadow-xl shadow-black/25 overflow-hidden"
            role="menu"
          >
            {navList && navList.map((item) => (
              <Link
                href={item.path}
                key={item.id}
                className={`flex items-center text-sm w-full gap-2 px-4 p-3 group ${currentIndex === item.path ? 'text-foreground' : 'text-navlink'}`}
                onClick={() => setDropdown(false)}
              >
                <item.icon size='20' className={`group-hover:text-primary ${currentIndex === item.path && 'text-primary'}`} />
                <p className='group-hover:text-foreground'>{item.name}</p>
              </Link>
            ))}
          </div>
        )}
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