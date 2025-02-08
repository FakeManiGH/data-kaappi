"use client"
import React from 'react'
import SideNav from './_components/SideNav';
import TopHeader from './_components/TopHeader';
import Footer from './_components/Footer';
import { BadgeInfo, Files, LayoutDashboard, UploadCloud } from 'lucide-react'

function layout({ children }) {
  const [currentIndex, setCurrentIndex] = React.useState('')

  // Get current index
  React.useEffect(() => {
    setCurrentIndex(window.location.pathname.split('/')[
      window.location.pathname.split('/').length - 1
    ])
  }, [])

  const navList = [
    {
        id: 1,
        name: 'Kojelauta',
        icon: LayoutDashboard,
        path: 'kojelauta'
    },
    {
        id: 2,
        name: 'Tallenna',
        icon: UploadCloud,
        path: 'tallenna'
    },
    {
        id: 3,
        name: 'Tiedostot',
        icon: Files,
        path: 'tiedostot'
    },
    {
        id: 4,
        name: 'Tietoa',
        icon: BadgeInfo,
        path: 'tietoa'
    }
  ]

  return (
    <>
      <div className="fixed inset-y-0 w-64 hidden z-50 md:flex flex-col h-full">
        <SideNav currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} navList={navList} />
      </div>
      <div className='md:ml-64'>
        <TopHeader currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} navList={navList} />
        {children}
      </div>
      <Footer />
    </>
  )
}

export default layout