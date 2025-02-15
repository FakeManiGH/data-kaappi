"use client"
import React, { useEffect, useContext } from 'react'
import SideNav from './_components/SideNav';
import TopHeader from './_components/TopHeader';
import Footer from './_components/Footer';
import { BadgeInfo, Files, LayoutDashboard, PackageOpen, UploadCloud } from 'lucide-react';
import Alert from '../_components/_common/Alert';

function layout({ children }) {
  const [currentIndex, setCurrentIndex] = React.useState('')

  useEffect(() => {
    const path = `/${window.location.pathname.split('/')[1]}`;
    console.log(path)
    setCurrentIndex(path);
  }, [])

  const navList = [
    {
        id: 1,
        name: 'Kojelauta',
        icon: LayoutDashboard,
        path: '/kojelauta'
    },
    {
        id: 2,
        name: 'Tallenna',
        icon: UploadCloud,
        path: '/tallenna'
    },
    {
        id: 3,
        name: 'Omat tiedostot',
        icon: Files,
        path: '/omat-tiedostot'
    },
    {
        id:4,
        name: 'Jaetut tiedostot',
        icon: PackageOpen,
        path: '/jaetut-tiedostot'
    },
    {
        id: 5,
        name: 'Tietoa',
        icon: BadgeInfo,
        path: '/tietoa'
    }
  ]

  return (
    <>
      <div className="fixed inset-y-0 w-64 hidden md:flex flex-col">
        <SideNav currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} navList={navList} />
      </div>
      <div className='md:ml-64'>
        <TopHeader currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} navList={navList} />
        {children}
      </div>
      <Footer />
      <Alert />
    </>
  )
}

export default layout