import Image from 'next/image'
import Link from 'next/link'
import { useNavigation } from '@/app/contexts/NavigationContext'
import { BadgeCheck } from 'lucide-react'

function SideNav() {
    const { navList, currentIndex } = useNavigation()

    return (
        <div className='flex flex-col w-64 h-full overflow-y-auto'
        >
            <Link 
                href='/' 
                className='p-4 flex items-center gap-2 text-foreground hover:text-primary transition-colors'
            >
                <Image src='/logo.svg' alt="Logo" width={40} height={40} />
                <strong>Datakaappi</strong>
            </Link>
            <div className='flex flex-col w-full'>
                {navList && navList.map((item) => (
                    <Link 
                        href={item.path} 
                        key={item.id} 
                        className={`flex items-center text-sm font-light group gap-2 p-4 px-5 w-full hover:text-foreground
                            ${currentIndex === item.path ? 'text-foreground' : 'text-navlink'}`}
                    >     
                        <item.icon className={`group-hover:text-primary ${currentIndex === item.path ? 'text-primary' : 'text-navlink'}`} />
                        <p>{item.name}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SideNav