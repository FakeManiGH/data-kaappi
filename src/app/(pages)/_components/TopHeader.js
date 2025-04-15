"use client"
import { AlignJustify, Home, X } from 'lucide-react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs';
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link';
import { useNavigation } from '@/app/contexts/NavigationContext'

function TopHeader() {
  const [dropdown, setDropdown] = useState(false)
  const { navList, currentIndex } = useNavigation()
  const dropdownRef = useRef(null)


  return (
    <header 
      className='flex md:justify-end items-center justify-between gap-2 p-4 z-50'
    >
      <div className='md:hidden relative' ref={dropdownRef}>
        <button
          id='dropdownBtn'
          className='py-2 cursor-pointer transition text-foreground hover:text-primary'
          onClick={() => setDropdown(true)}
        >
          <AlignJustify size={32} />
        </button>

        {/* Dropdown */}
          <div
            className={`fixed inset-0 z-50 origin-left bg-background flex p-2 pb-6 transition-transform ease-in overflow-y-auto
              ${dropdown ? 'scale-x-1' : 'scale-x-0'}`}
            role="menu"
          > 

            <div className='flex flex-col gap-6 w-full'>
              <button className='w-fit rounded-lg self-end text-foreground hover:text-primary' onClick={() => setDropdown(false)}>
                <X size={32} />
              </button>

              <nav className='flex flex-col gap-1'>
                <Link href='/' className='flex items-center gap-6 p-3 text-sm rounded-lg bg-sky-100 dark:bg-contrast hover:bg-primary hover:text-white'>
                  <Home />
                  Etusivu
                </Link>

                {navList && navList.map((item) => (
                  <Link
                    href={item.path}
                    key={item.id}
                    className={`flex items-center gap-6 p-3 group hover:bg-primary hover:text-white rounded-lg transition-colors
                      ${currentIndex === item.path ? 'bg-primary text-white' : 'bg-sky-100 dark:bg-contrast'}`}
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

      <Link 
        href='/' 
        className='flex items-center gap-2 md:hidden font-bold text-foreground hover:text-primary'
      >
          <Image src='/logo.svg' alt="Logo" width={40} height={40} />
          Datakaappi
      </Link>

      <UserButton />
  </header>
  )
}

export default TopHeader