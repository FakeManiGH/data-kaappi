import React from 'react'
import Link from 'next/link'
import { useNavigation } from '@/app/contexts/NavigationContext'

function NavigationGrid() {
    const { navList, currentIndex, setCurrentIndex } = useNavigation()

    // Exclude the current page from the navigation list
    const filteredList = navList.filter((item) => item.path !== currentIndex)

    return (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2'>
            {filteredList.map((item) => (
                <Link 
                    href={item.path}
                    key={item.id}
                    className="flex flex-col items-center p-4 cursor-pointer text-foreground rounded-lg shadow-md hover:shadow-lg 
                        transition-colors border-2 border-primary hover:text-white hover:bg-primary"
                    >
                        <item.icon className='mb-2' />
                        <p className="text-sm whitespace-nowrap">{item.name}</p>
                </Link>
            ))}
        </div>
    )
}

export default NavigationGrid