import { createContext, useEffect, useState } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

    const login = async (inputs) => {
        // We are using proxy in package.json or manually setting url
        // Since we are using Vite, we need proper CORS or full URL. Let's use full URL for now to be safe or set axios global.
        const res = await api.post('/auth/login', inputs);
        setCurrentUser(res.data);
    };

    const register = async (inputs) => {
        await api.post('/auth/register', inputs);
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setCurrentUser(null);
    };

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
