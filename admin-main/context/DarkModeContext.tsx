import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface DarkModeContextValue {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

const DarkModeContext = createContext<DarkModeContextValue | null>(null);

const DARK_MODE_KEY = 'admin-dark-mode';

// Helper to check localStorage synchronously
const getInitialDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const saved = localStorage.getItem(DARK_MODE_KEY);
    console.log('[DarkMode] Init - localStorage value:', saved);
    if (saved !== null) {
      const result = saved === 'true';
      console.log('[DarkMode] Using saved value:', result);
      return result;
    }
    const systemPref = window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log('[DarkMode] Using system preference:', systemPref);
    return systemPref;
  } catch (e) {
    console.log('[DarkMode] Error reading localStorage:', e);
    return false;
  }
};

// Apply dark mode class
const applyDarkModeClass = (isDark: boolean) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (isDark) {
    root.classList.add('dark');
    root.style.background = '#111827';
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.background = '#f9fafb';
    root.style.colorScheme = 'light';
  }
};

interface DarkModeProviderProps {
  children: React.ReactNode;
}

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children }) => {
  const isInitialMount = useRef(true);
  
  // FIX: Start with a neutral state. Do NOT call applyDarkModeClass here.
  // This ensures the Server and the Client render the same thing initially.
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Initial sync: Runs ONLY on the client, AFTER the first render.
  useEffect(() => {
    const initial = getInitialDarkMode();
    setIsDarkMode(initial);
    applyDarkModeClass(initial);
    setMounted(true);
  }, []);

  // Apply changes whenever isDarkMode updates
  useEffect(() => {
    // Only run side-effects after we are safely mounted
    if (!mounted) return;

    applyDarkModeClass(isDarkMode);
    
    if (isInitialMount.current) {
      isInitialMount.current = false;
      console.log('[DarkMode] Initial mount - sync complete');
    } else {
      console.log('[DarkMode] User changed - saving to localStorage:', isDarkMode);
      try {
        localStorage.setItem(DARK_MODE_KEY, String(isDarkMode));
      } catch {}
    }
  }, [isDarkMode, mounted]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const setDarkMode = useCallback((value: boolean) => {
    setIsDarkMode(value);
  }, []);

  // FIX: To prevent the "removeChild" error, we must ensure the 
  // initial HTML matches exactly. We only render the real Provider 
  // values once 'mounted' is true.
  return (
    <DarkModeContext.Provider value={{ 
      isDarkMode: mounted ? isDarkMode : false, 
      toggleDarkMode, 
      setDarkMode 
    }}>
      {/* We wrap children in a div that is hidden until mounted 
          to prevent the user from seeing the 'light' version 
          flash briefly if they are in dark mode.
      */}
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = (): DarkModeContextValue => {
  const context = useContext(DarkModeContext);
  if (!context) {
    return {
      isDarkMode: false,
      toggleDarkMode: () => {},
      setDarkMode: () => {},
    };
  }
  return context;
};

export default DarkModeContext;