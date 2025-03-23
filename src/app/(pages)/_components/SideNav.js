import Image from 'next/image'
import Link from 'next/link'
import { useNavigation } from '@/app/contexts/NavigationContext'
import { BadgeCheck } from 'lucide-react'

function SideNav() {
    const { navList, currentIndex } = useNavigation()

    return (
        <div className='flex flex-col w-64 h-full bg-gradient-to-tl from-primary to-blue-800 overflow-y-auto dark:from-blue-800 dark:to-blue-950'>
            <Link 
                href='/' 
                className='p-4 flex items-center gap-2 text-white hover:text-yellow-300 transition-colors'
            >
                <Image src='/logo.svg' alt="Logo" width={40} height={40} />
                <strong>Datakaappi</strong>
            </Link>
            <div className='flex flex-col w-full mt-2 mb-2'>
                {navList && navList.map((item) => (
                    <Link 
                        href={item.path} 
                        key={item.id} 
                        className={`flex items-center text-sm group gap-2 p-4 px-5 w-full ${currentIndex === item.path ? 'text-yellow-300' : 'text-white'}`}
                    >     
                        <item.icon className={`group-hover:text-yellow-300 ${currentIndex === item.path ? 'text-yellow-300' : 'text-white'}`} />
                        <p>{item.name}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SideNav