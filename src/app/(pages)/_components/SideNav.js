import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'

function SideNav({ currentIndex, setCurrentIndex, navList }) {
    return (
        <div>
            <div className='p-4'>
                <a href='/' className='flex items-center gap-2'>
                    <Image src='/logo.svg' alt="Logo" width={40} height={40} />
                    <strong>Data-Kaappi</strong>
                </a>
            </div>
            <div className='flex flex-col float-left w-full'>
            {navList && navList.map((item) => (
                <Link 
                    href={`/${item.path}`} 
                    key={item.id} 
                    className={`flex gap-2 p-4 w-full hover:bg-contrast hover:text-primary ${item.path == currentIndex ? 'bg-contrast text-primary' : 'text-gray-600 dark:text-gray-400'}`}
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