import { createContext, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';

// Blank context or the Global memory box
const AuthContext = createContext();

const getUserFromStoredToken = () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        return null;
    }

    try {
        return jwtDecode(token);
    } catch {
        // If token is corrupted, remove it
        console.error("Invalid token found");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return null;
    }
};

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(getUserFromStoredToken);

    // Login Functtion
    const login = async (username, password) => {
        const response = await api.post('/users/api/login/', {
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
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
