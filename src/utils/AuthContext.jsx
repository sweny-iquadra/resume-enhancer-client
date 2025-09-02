import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const AuthContext = createContext({
    user: {},
    setUser: () => { },
    login: () => { },
    logout: () => { },
    isAuthenticated: false,
    accessToken: null,
    tokenType: null
});

// Auth Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [tokenType, setTokenType] = useState(null);

    // Load user from localStorage if present
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const savedAccessToken = localStorage.getItem("access_token");
        const savedTokenType = localStorage.getItem("token_type");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        if (savedAccessToken) {
            setAccessToken(savedAccessToken);
        }
        if (savedTokenType) {
            setTokenType(savedTokenType);
        }
    }, []);
    // Save user to localStorage when changed
    useEffect(() => {
        if (user && accessToken && tokenType) {
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("token_type", tokenType);
            setIsAuthenticated((prev) => true);
        } else {
            localStorage.removeItem("user");
            localStorage.removeItem("access_token");
            localStorage.removeItem("token_type");
            setIsAuthenticated((prev) => false);
        }
    }, [user, accessToken, tokenType, isAuthenticated]);

    // Functions to update / clear user
    const login = (userData) => {
        if (userData?.user) {
            setUser(userData.user);
            localStorage.setItem("user", JSON.stringify(userData.user));
        }
        if (userData?.accessToken) {
            setAccessToken(userData.accessToken);
            localStorage.setItem("access_token", userData.accessToken);
        }
        if (userData?.tokenType) {
            setTokenType(userData.tokenType);
            localStorage.setItem("token_type", userData.tokenType);
        }
        setIsAuthenticated((prev) => true);

    };

    const logout = () => {
        setUser(null);
        setAccessToken(null);
        setTokenType(null);
        setIsAuthenticated(false);
    };
    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, isAuthenticated, accessToken, tokenType }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use in components
const useAuth = () => useContext(AuthContext) ||
    { user: {}, setUser: () => { }, login: () => { }, logout: () => { }, isAuthenticated: false, accessToken: null, tokenType: null };
export { useAuth };