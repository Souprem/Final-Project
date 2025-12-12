import { createContext, useEffect, useState } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (err) {
            console.error("Failed to parse user from local storage", err);
            return null;
        }
    });

    const login = async (inputs) => {
        // We are using proxy in package.json or manually setting url
        // Since we are using Vite, we need proper CORS or full URL. Let's use full URL for now to be safe or set axios global.
        const res = await api.post('/auth/login', inputs);

        // Extract token from response (backend must send it in JSON body now)
        // Wait, authController currently sends it in cookie AND maybe body? 
        // Let's assume we will update backend to send it in body if not already.
        // Actually, previous view of authController showed: .json({ ...otherDetails }) which explicitly EXCLUDED password but included nothing else?
        // Wait, line 34: const token = ...; line 39: .json({ ...otherDetails }). 
        // It DOES NOT send token in body. I need to update Backend first or concurrently.
        // I'll update backend to send it.
        const { token, ...userData } = res.data;

        localStorage.setItem('access_token', token); // Save token separately
        setCurrentUser(userData);
    };

    const register = async (inputs) => {
        await api.post('/auth/register', inputs);
    };

    const logout = async () => {
        await api.post('/auth/logout');
        localStorage.removeItem('access_token'); // Clear token
        setCurrentUser(null);
    };

    const updateUser = (data) => {
        setCurrentUser(data);
    };

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(currentUser));
    }, [currentUser]);

    useEffect(() => {
        const refreshUser = async () => {
            if (currentUser?._id) {
                try {
                    const res = await api.get(`/users/${currentUser._id}`);
                    setCurrentUser(res.data);
                } catch (err) {
                    console.log("Failed to refresh user:", err);
                    // Optional: logout if user not found (404)
                }
            }
        };
        refreshUser();
    }, []); // Run once on mount

    return (
        <AuthContext.Provider value={{ currentUser, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
