"use client"
import React, {useEffect } from 'react'
import { useNavigation } from '@/app/contexts/NavigationContext'

function page() {
  const { setCurrentIndex } = useNavigation()

  useEffect(() => {
    setCurrentIndex('/tietoa')
  }, [setCurrentIndex])

  return (
    <main className='w-full max-w-7xl mx-auto'>
      <h1 className='text-2xl md:text-3xl'><strong>Tietoa</strong></h1>
      <p>Kuvakaappi on pieni kotimainen pilvipalvelu, jonka avulla säilytät tärkeimmät kuvasi ja videosi turvallisesti
        ja helposti. Kuvakaappin avulla myös jaat tärkeimmät muistot helposti ja saumattomasti läheistesi ja perheesi kanssa.   
      </p>
    </main>
  )
}

export default page