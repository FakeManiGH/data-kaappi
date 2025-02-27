import { createContext, useContext, useState, useEffect } from 'react';
import { BookMarked, CircleGauge, FolderHeart, PackageOpen, UploadCloud } from 'lucide-react';
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
            name: 'Omat tiedostot',
            icon: FolderHeart,
            path: '/omat-tiedostot'
        },
        {
            id: 4,
            name: 'Jaetut tiedostot',
            icon: PackageOpen,
            path: '/jaetut-tiedostot'
        },
        {
            id: 5,
            name: 'Tietoa',
            icon: BookMarked,
            path: '/tietoa'
        }
    ]

    const navigatePage = (path) => {
        setCurrentIndex(path)
        router.push(path)
    }

    return (
        <NavigationContext.Provider value={{ navList, currentIndex, setCurrentIndex, navigatePage }}>
            {children}
        </NavigationContext.Provider>
    );
}

export const useNavigation = () => useContext(NavigationContext);