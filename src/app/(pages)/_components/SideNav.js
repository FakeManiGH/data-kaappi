import Image from 'next/image'
import Link from 'next/link'
import { useNavigation } from '@/app/contexts/NavigationContext'

function SideNav() {
    const { navList, currentIndex, setCurrentIndex } = useNavigation()

    return (
        <div className='flex flex-col w-64 h-full border-r border-contrast2'>
            <Link 
                href='/' 
                className='p-4 border-b border-contrast2 flex items-center gap-2 hover:text-primary transition-colors'
                onClick={() => setCurrentIndex('/')}
            >
                <Image src='/logo.svg' alt="Logo" width={40} height={40} />
                Data-Kaappi
            </Link>
            <div className='flex flex-col w-full mt-2'>
            {navList && navList.map((item) => (
                <Link 
                    href={item.path} 
                    key={item.id} 
                    className={`flex items-center text-sm gap-2 p-4 px-5 w-full hover:text-primary ${currentIndex === item.path ? 'text-primary' : 'text-navlink'}`}
                    onClick={() => setCurrentIndex(item.path)}
                >     
                    <item.icon />
                    <p>{item.name}</p>
                </Link>
            ))}
            </div>
        </div>
    )
}

export default SideNav