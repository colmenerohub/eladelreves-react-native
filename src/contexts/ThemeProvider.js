import React, { createContext, useContext, useEffect, useState } from 'react';
import dark from "@themes/dark";
import light from "@themes/light";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export function useTheme() {
    return useContext(ThemeContext);
}

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(light); // Establece un tema predeterminado

    useEffect(() => {
        // Recupera el tema almacenado en AsyncStorage
        const fetchTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('theme');
                if (savedTheme !== null) {
                    setTheme(savedTheme === 'dark' ? dark : light);
                }
            } catch (error) {
                console.error('Error retrieving theme from AsyncStorage:', error);
            }
        };

        fetchTheme();
    }, []);

    const toggleTheme = async () => {
        try {
            const newTheme = theme === light ? dark : light;
            await AsyncStorage.setItem('theme', newTheme === dark ? 'dark' : 'light');
            setTheme(newTheme);
        } catch (error) {
            console.error('Error saving theme to AsyncStorage:', error);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
