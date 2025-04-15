import Image from 'next/image'
import Link from 'next/link'
import { useNavigation } from '@/app/contexts/NavigationContext'
import { BadgeCheck, Settings2 } from 'lucide-react'
import SpaceMeterBar from '@/app/_components/_common/SpaceMeterBar'
import { useUserdata } from '@/app/contexts/UserdataContext'

function SideNav() {
    const { navList, currentIndex } = useNavigation()
    const { userData } = useUserdata();

    return (
        <div className='relative z-10 flex flex-col w-72 h-full overflow-y-auto'
        >
            <Link 
                href='/' 
                className='p-4 flex items-center gap-2 mb-1 rounded-br-lg text-foreground hover:text-primary transition-colors'
            >
                <Image src='/logo.svg' alt="Logo" width={40} height={40} />
                <strong>Datakaappi</strong>
            </Link>

            <div className='flex flex-col gap-1 w-full'>
                {navList && navList.map((item) => (
                    <Link 
                        href={item.path} 
                        key={item.id} 
                        className={`flex items-center text-sm font-light group gap-2 p-3 px-5 rounded-r-lg w-full hover:bg-primary hover:text-white transition-colors 
                            ${currentIndex === item.path ? 'bg-primary text-white' : 'bg-sky-100 dark:bg-contrast'}`}
                    >     
                        <item.icon />
                        <p>{item.name}</p>
                    </Link>
                ))}
            </div>

            <div className='flex flex-col gap-2 p-4 bg-sky-100 dark:bg-contrast rounded-r-lg mt-auto mb-6'>
                <SpaceMeterBar usedSpace={userData?.usedSpace} totalSpace={userData?.totalSpace} />
            </div>
            
        </div>
    )
}

export default SideNav