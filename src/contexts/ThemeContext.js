import React, { createContext, useContext, useState, useEffect } from 'react';

const PRIMARY_COLOR = '#0c5426';

const lightTheme = {
  primary: PRIMARY_COLOR,
  primaryDark: '#094218',
  primaryLight: '#0f6b31',
  background: '#FFFFFF',
  surface: '#F9FAFB',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
};

const darkTheme = {
  primary: '#0f6b31',
  primaryDark: PRIMARY_COLOR,
  primaryLight: '#12803a',
  background: '#121212',
  surface: '#1E1E1E',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  border: '#374151',
  success: '#34D399',
  error: '#F87171',
  warning: '#FBBF24',
  info: '#60A5FA',
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('userTheme');
    if (storedTheme) {
      setThemeState(storedTheme);
      applyTheme(storedTheme);
    }
  }, []);

  const applyTheme = themeName => {
    const colors = themeName === 'dark' ? darkTheme : lightTheme;

    document.documentElement.style.setProperty('--primary-color', colors.primary);
    document.documentElement.style.setProperty('--primary-dark', colors.primaryDark);
    document.documentElement.style.setProperty('--primary-light', colors.primaryLight);
    document.documentElement.style.setProperty('--bg-color', colors.background);
    document.documentElement.style.setProperty('--surface-color', colors.surface);
    document.documentElement.style.setProperty('--text-color', colors.text);
    document.documentElement.style.setProperty('--text-secondary', colors.textSecondary);
    document.documentElement.style.setProperty('--border-color', colors.border);
    document.documentElement.style.setProperty('--success-color', colors.success);
    document.documentElement.style.setProperty('--error-color', colors.error);
    document.documentElement.style.setProperty('--warning-color', colors.warning);
    document.documentElement.style.setProperty('--info-color', colors.info);

    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.text;
  };

  const setTheme = newTheme => {
    setThemeState(newTheme);
    localStorage.setItem('userTheme', newTheme);
    applyTheme(newTheme);
  };

  const colors = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
