"use client"
import { AlignJustify } from 'lucide-react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs';
import React from 'react'
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
          className="absolute start-0 z-10 mt-0 w-full bg-background shadow-xl md:hidden overflow-hidden"
          role="menu"
        >
          <div>
            {navList && navList.map((item) => (
              <Link
                href={`/${item.path}`}
                key={item.id}
                className={`flex items-center w-full gap-2 p-4 hover:bg-contrast hover:text-primary ${item.path == currentIndex ? 'bg-contrast text-primary' : 'text-gray-500'}`}
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