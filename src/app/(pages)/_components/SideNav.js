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
        <div className='relative z-10 flex flex-col w-64 h-full overflow-y-auto'
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

            <div className='flex flex-col gap-2 p-2 bg-gradient-to-b from-secondary to-contrast rounded-lg mx-2 mt-auto mb-6'>
                <SpaceMeterBar usedSpace={userData?.usedSpace} totalSpace={userData?.totalSpace} />

                <Link href='/kojelauta' className='flex items-center gap-1 text-navlink hover:text-foreground text-sm group'>
                    <Settings2 className='text-navlink group-hover:text-primary' size={20} />
                    Hallitse tallennustilaa
                </Link>
            </div>
            
        </div>
    )
}

export default SideNav