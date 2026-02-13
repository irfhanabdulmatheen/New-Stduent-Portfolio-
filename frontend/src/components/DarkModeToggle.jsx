import { useState, useEffect } from 'react';
import { HiSun, HiMoon } from 'react-icons/hi';

const DarkModeToggle = () => {
    const [dark, setDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [dark]);

    return (
        <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 
                 transition-all duration-200 text-gray-600 dark:text-gray-300"
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {dark ? <HiSun className="w-5 h-5 text-amber-400" /> : <HiMoon className="w-5 h-5" />}
        </button>
    );
};

export default DarkModeToggle;
