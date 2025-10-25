import { useState, useEffect } from 'react';
import { loginRequest } from '../api/requests/authRequest';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const login = async (credentials) => {
        setLoading(true);
        try {
            const response = await loginRequest(credentials);
            const { token, user } = response;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Login failed';
            setToast({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        return !!(token && user);
    };

    const getUser = () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    };

    const closeToast = () => setToast(null);

    return {
        loading,
        toast,
        closeToast,
        login,
        logout,
        isAuthenticated: isAuthenticated(),
        user: getUser()
    };
};