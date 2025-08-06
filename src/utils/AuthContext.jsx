import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const AuthContext = createContext();

// Auth Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load user from localStorage if present
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        try {
            if (storedUser && storedUser !== "undefined") {
                const parsed = JSON.parse(storedUser);
                if (parsed && typeof parsed === "object") {
                    setUser(parsed);
                }
            }
        } catch (error) {
            console.error("Error parsing stored user from localStorage:", error);
            localStorage.removeItem("user"); // optional cleanup
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use in components
const useAuth = () => useContext(AuthContext) || {};
export { useAuth };