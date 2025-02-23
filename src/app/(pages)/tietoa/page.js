"use client"
import React, {useEffect} from 'react'
import { useNavigation } from '@/app/contexts/NavigationContext'

function page() {
  const { setCurrentIndex } = useNavigation()

  useEffect(() => {
    setCurrentIndex('/tietoa')
  }, [setCurrentIndex])

  return (
    <main>
      <h1 className='text-2xl md:text-3xl'><strong>Tietoa</strong></h1>
      <p>Tämä on sivu, jolla on tietoa.</p>
    </main>
  )
}

export default page