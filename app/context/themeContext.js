"use client";

import {createContext, useContext, useState, useEffect, useMemo, useCallback} from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
	const [isDark, setIsDark] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	// Load theme from localStorage on mount
	useEffect(() => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme === 'dark') {
			setIsDark(true);
		} else if (savedTheme === 'light') {
			setIsDark(false);
		} else {
			// Default to light theme
			setIsDark(false);
		}
		setIsLoaded(true);
	}, []);

	// Update localStorage when theme changes
	useEffect(() => {
		if (isLoaded) {
			localStorage.setItem('theme', isDark ? 'dark' : 'light');
			// Update document class for Tailwind dark mode
			if (isDark) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	}, [isDark, isLoaded]);

	const toggleTheme = useCallback(() => {
		setIsDark(prev => !prev);
	}, []);

	const contextValue = useMemo(() => ({
		isDark,
		toggleTheme,
		isLoaded
	}), [isDark, toggleTheme, isLoaded]);

	return (
		<ThemeContext.Provider value={contextValue}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};