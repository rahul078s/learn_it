import { createContext, useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';

// Blank context or the Global memory box
const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setUser(decodedUser);
            } catch (error) {
                // If token is corrupted, remove it
                console.error("Invalid token found");
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            }
        }
        setLoading(false);
    }, []);

    // Login Functtion
    const login = async (username, password) => {
        const response = await api.post('/api/token/', {
            username,
            password
        });
        // Store new keycards in browser's memory
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);

        const decodedUser = jwtDecode(response.data.access);
        setUser(decodedUser);
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    const contextData = {
        user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? <p>Loading ...</p> : children}
        </AuthContext.Provider>
    );
};

export default AuthContext;