import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { getUserDocument } from '../file-requests/api';
import { useAlert } from './AlertContext';


const UserdataContext = createContext();

export const UserdataProvider = ({ children }) => {
    const { isLoaded, user } = useUser();
    const { showAlert } = useAlert();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserdata = async () => {
            if (isLoaded && user) {
                try {
                    const response = await getUserDocument(user.id);
                    if (response.success) {
                        setUserData(response.document);
                    } else {
                        throw new Error("Käyttäjätietojen hakeminen epäonnistui.");
                    }
                } catch (err) {
                    console.error("Error fetching userdata: " + err);
                    showAlert((err.message || 'Käyttäjätietojen hakeminen epäonnistui.'), 'error');
                }
            }
        };

        fetchUserdata();
    }, [isLoaded, user, showAlert]);

    return (
        <UserdataContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserdataContext.Provider>
    );
};

// Custom hook to access UserdataContext
export const useUserdata = () => {
    const context = useContext(UserdataContext);
    if (!context) {
        throw new Error('useUserdata must be used within a UserdataProvider');
    }
    return context;
};