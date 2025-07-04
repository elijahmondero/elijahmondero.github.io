import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface ThemeContextProps {
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Default to light theme during SSR
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This runs only on the client side
    setIsClient(true);
    const savedTheme = Cookies.get('theme');
    const shouldBeDark = savedTheme === 'dark';
    setIsDarkTheme(shouldBeDark);
    document.body.className = shouldBeDark ? 'dark-theme' : 'light-theme';
  }, []);

  useEffect(() => {
    if (isClient) {
      document.body.className = isDarkTheme ? 'dark-theme' : 'light-theme';
      Cookies.set('theme', isDarkTheme ? 'dark' : 'light', { expires: 365 });
    }
  }, [isDarkTheme, isClient]);

  const toggleTheme = () => {
    setIsDarkTheme(prevTheme => !prevTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
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
