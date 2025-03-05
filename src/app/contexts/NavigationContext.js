import { createContext, useContext, useState, useEffect } from 'react';
import { BookMarked, CircleGauge, GalleryVerticalEnd, Home, LucideFolderTree, PackageOpen, UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
    const [currentIndex, setCurrentIndex] = useState('')
    const router = useRouter()

    useEffect(() => {
        const path = `/${window.location.pathname.split('/')[1]}`;
        setCurrentIndex(path);
        console.log(path);
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
            icon: LucideFolderTree,
            path: '/kansiot'
        },
        {
            id: 4,
            name: 'Kaikki tiedostot',
            icon: GalleryVerticalEnd,
            path: '/kaikki-tiedostot'
        },
        {
            id: 5,
            name: 'Jaetut tiedostot',
            icon: PackageOpen,
            path: '/jaetut-tiedostot'
        },
        {
            id: 6,
            name: 'Tietoa',
            icon: BookMarked,
            path: '/tietoa'
        }
    ];

    const publicNav = [
        {
            id: 1,
            name: 'Etusivu',
            icon: Home,
            path: '/'
        },
        {
            id: 2,
            name: 'Tallenna',
            icon: UploadCloud,
            path: '/tallenna'
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