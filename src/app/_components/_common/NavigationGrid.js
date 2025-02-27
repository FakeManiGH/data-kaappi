import React from 'react'
import Link from 'next/link'
import { useNavigation } from '@/app/contexts/NavigationContext'

function NavigationGrid() {
    const { navList, currentIndex, setCurrentIndex } = useNavigation()

    // Exclude the current page from the navigation list
    const filteredList = navList.filter((item) => item.path !== currentIndex)

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 w-full'>
            {filteredList.map((item) => (
                <Link 
                    href={item.path}
                    key={item.id}
                    className="flex justify-center text-navlink gap-2 items-center w-full px-4 py-3 border border-contrast 
                    rounded-full group hover:border-primary active:border-primary">
                        <item.icon className='text-primary' />
                        <p className="text-sm  whitespace-nowrap group-hover:text-foreground">{item.name}</p>
                </Link>
            ))}
        </div>
    )
}

export default NavigationGrid