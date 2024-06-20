import { auth } from "config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { logout } from "services/Auth";

export const AuthenticatedUserContext = createContext({})

export function useUser() {
    return useContext(AuthenticatedUserContext);
}

export const AuthenticatedUserProvider = ({ children }) => {
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,
            async authenticatedUser => {
                authenticatedUser ? setUser(authenticatedUser) : setUser(null)
            }
        )
        return () => unsubscribe();
    }, [user]);

    const handleLogout = () => {
        logout()
        setUser(null);
    };

    return (
        <AuthenticatedUserContext.Provider value={{ user, setUser, handleLogout }}>
            {children}
        </AuthenticatedUserContext.Provider>
    )
}