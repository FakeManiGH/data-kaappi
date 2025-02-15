"use client"
import { AlignJustify } from 'lucide-react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs';
import React, { useState } from 'react'
import Link from 'next/link';

function TopHeader({ currentIndex, setCurrentIndex, navList }) {
  const [dropdown, setDropdown] = useState(false)

  const handleDropdown = () => {
    setDropdown(!dropdown)
  }

  return (
    <div className='relative z-50 bg-background'>
      <div className='flex justify-between md:justify-end p-4 py-2 pt-4 w-full items-center'>
          <AlignJustify
            id='dropdownBtn'
            className='cursor-pointer md:hidden text-foreground dark:text-navlink transition hover:text-primary' 
            size={30}
            onClick={handleDropdown}
          />

          <Link href='/kojelauta' className='flex items-center gap-2 md:hidden'>
            <Image src='/logo.svg' alt="Logo" width={40} height={40} />
            Data-Kaappi
          </Link>

          <UserButton />

          {/* Dropdown */}
          {dropdown && (
            <div
              id='dropdownMenu'
              className="absolute start-0 w-full z-50 top-full shadow-md shadow-black/20 bg-background md:hidden overflow-hidden border border-t-0 border-contrast2"
              role="menu"
            >
              {navList && navList.map((item) => (
                <Link
                  href={item.path}
                  key={item.id}
                  className={`flex items-center text-sm w-full gap-2 p-4 hover:text-primary ${currentIndex === item.path ? 'text-primary' : 'text-navlink'}`}
                  onClick={() => { setDropdown(false); setCurrentIndex(item.path); }}
                >
                  <item.icon size='24' />
                  <p>{item.name}</p>
                </Link>
              ))}
            </div>
          )}
      </div>
  </div>
  )
}

export default TopHeader