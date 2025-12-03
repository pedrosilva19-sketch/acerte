// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Só roda no cliente
        if (typeof window !== 'undefined') {
            // Verificar localStorage
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');
            
            if (token && username) {
                setUser({ name: username, token });
            }
            setLoading(false);
        }
    }, []);

    const login = (token, username) => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        setUser({ name: username, token });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setUser(null);
        
        // Limpar cookie do servidor também
        fetch('/api/auth/logout', { method: 'POST' })
            .finally(() => {
                window.location.href = '/';
            });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);