// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextProps {
    isUserAdmin: boolean;
    setIsAdmin: (isAdmin: boolean) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isUserAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            setIsAdmin(localStorage.getItem("Role") === "Administrator");
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isUserAdmin, setIsAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
