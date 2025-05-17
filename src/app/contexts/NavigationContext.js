import { createContext, useContext, useState, useEffect } from 'react';
import { BookMarked, CircleGauge, FolderOpen, Home, Image, MailPlus, UploadCloud, UserCog, UsersRound } from 'lucide-react';
import { useRouter } from 'next/navigation';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
    const [currentIndex, setCurrentIndex] = useState('')
    const router = useRouter()

    useEffect(() => {
        const path = `/${window.location.pathname.split('/')[1]}`;
        setCurrentIndex(path);
    }, []);

    const navList = [
        {
            id: 1,
            name: 'Kojelauta',
            icon: CircleGauge,
            path: '/kojelauta'
        },
        {
            id: 2,
            name: 'Tallenna',
            icon: UploadCloud,
            path: '/tallenna'
        },
        {
            id: 3,
            name: 'Kansiot',
            icon: FolderOpen,
            path: '/kansiot'
        },
        {
            id: 4,
            name: 'Selaa mediaa',
            icon: Image,
            path: '/selaa'
        },
        {
            id: 5,
            name: 'Ryhmät',
            icon: UsersRound,
            path: '/ryhmat'
        },
        {
            id: 6,
            name: 'Tuki',
            icon: UserCog,
            path: '/tuki'
        },
        {
            id: 7,
            name: 'Anna palautetta',
            icon: MailPlus,
            path: '/palaute'
        },
    ];

    const publicNav = [
        {
            id: 1,
            name: 'Etusivu',
            icon: Home,
            path: '/'
        },
        {
            id: 3,
            name: 'Tietoa palvelusta',
            icon: BookMarked,
            path: '/tietoa'
        }
    ];


    const navigatePage = (path) => {
        setCurrentIndex(path)
        router.push(path)
    }

    return (
        <NavigationContext.Provider value={{ navList, publicNav, currentIndex, setCurrentIndex, navigatePage }}>
            {children}
        </NavigationContext.Provider>
    );
}

export const useNavigation = () => useContext(NavigationContext);