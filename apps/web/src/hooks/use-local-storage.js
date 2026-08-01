import { useState, useEffect } from 'react';
export function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        }
        catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });
    const setValue = (value) => {
        try {
            setStoredValue(value);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(value));
            }
        }
        catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    };
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === key && e.newValue) {
                try {
                    setStoredValue(JSON.parse(e.newValue));
                }
                catch {
                    // Ignore parse errors on external changes
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key]);
    return [storedValue, setValue];
}
//# sourceMappingURL=use-local-storage.js.map