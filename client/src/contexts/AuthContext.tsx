import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import type { IUser } from '../types';


interface AuthContextType {
    user: IUser | null;
    isLoading: boolean;
    login: (userData: any) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // При первой загрузке проверяем, жив ли токен (кука)
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const { data } = await api.get('/auth/me');
            setUser(data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (userData: any) => {
        const { data } = await api.post('/auth/login', userData);
        setUser(data.user);
    };

    const register = async (userData: any) => {
        const { data } = await api.post('/auth/register', userData);
        setUser(data.user);
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Хук для удобного использования
export const useAuth = () => useContext(AuthContext);