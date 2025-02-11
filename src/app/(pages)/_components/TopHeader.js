"use client"
import { AlignJustify } from 'lucide-react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs';
import React, { useEffect } from 'react'
import Link from 'next/link';

function TopHeader({ currentIndex, setCurrentIndex, navList }) {
  const [showDropdown, setShowDropdown] = React.useState(false)

  const handleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  return (
    <div>
      <div className='flex justify-between md:justify-end p-4 w-full items-center'>
          <AlignJustify
            id='dropdownBtn'
            className='cursor-pointer md:hidden text-foreground dark:text-gray-200 transition hover:text-primary' 
            size={30}
            onClick={handleDropdown}
          />

          <Link href='/' className='flex items-center gap-2 md:hidden'>
            <Image src='/logo.svg' alt="Logo" width={40} height={40} />
            Data-Kaappi
          </Link>

          <UserButton />
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          id='dropdownMenu'
          className="absolute start-0 w-full z-50 mt-0 bg-background shadow-lg md:hidden overflow-hidden border border-t-0 border-contrast2"
          role="menu"
        >
          <div>
            {navList && navList.map((item) => (
              <Link
                href={`/${item.path}`}
                key={item.id}
                className={`flex items-center text-sm w-full gap-2 p-4 hover:text-primary ${item.path == currentIndex ? 'text-primary' : 'text-navlink'}`}
                onClick={() => { setShowDropdown(false); setCurrentIndex(item.path); }}
              >
                <item.icon size='24' />
                <p>{item.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
  </div>
  )
}

export default TopHeader