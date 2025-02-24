import React from 'react'
import Link from 'next/link'
import { useNavigation } from '@/app/contexts/NavigationContext'

function NavigationGrid() {
    const { navList, currentIndex, setCurrentIndex } = useNavigation()

    // Exclude the current page from the navigation list
    const filteredList = navList.filter((item) => item.path !== currentIndex)

    return (
        <div className='flex flex-wrap gap-2'>
            {filteredList.map((item) => (
                <Link 
                    href={item.path}
                    key={item.id}
                    className="flex flex-col gap-1 items-center justify-center w-[calc(100%/1-8px)] sm:w-[calc(50%-8px)] 
                    md:w-[calc(33.333%-8px)] lg:w-[calc(25%-8px)] xl:w-[calc(20%-8px)] p-2 py-4 border border-contrast 
                    rounded-lg hover:border-primary active:border-primary">
                        <item.icon className='text-primary' size={24} />
                        <p className="text-md text-foreground">{item.name}</p>
                </Link>
            ))}
        </div>
    )
}

export default NavigationGrid