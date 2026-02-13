import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';
import {
    HiHome, HiUser, HiCollection, HiLightningBolt, HiAcademicCap,
    HiDocumentText, HiLogout, HiUsers, HiChartBar, HiMenu, HiX
} from 'react-icons/hi';
import { useState } from 'react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const studentLinks = [
        { to: '/student', icon: HiHome, label: 'Dashboard', end: true },
        { to: '/student/profile', icon: HiUser, label: 'Profile' },
        { to: '/student/projects', icon: HiCollection, label: 'Projects' },
        { to: '/student/skills', icon: HiLightningBolt, label: 'Skills' },
        { to: '/student/certifications', icon: HiAcademicCap, label: 'Certifications' },
        { to: '/student/resume', icon: HiDocumentText, label: 'Resume' },
    ];

    const adminLinks = [
        { to: '/admin', icon: HiHome, label: 'Dashboard', end: true },
        { to: '/admin/students', icon: HiUsers, label: 'Students' },
        { to: '/admin/analytics', icon: HiChartBar, label: 'Analytics' },
    ];

    const links = user?.role === 'admin' ? adminLinks : studentLinks;

    const navContent = (
        <>
            {/* Logo */}
            <div className="p-6 border-b border-gray-100 dark:border-dark-border">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">P</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-900 dark:text-white text-sm">Portfolio</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role} Panel</p>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-1">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50'
                            }`
                        }
                    >
                        <link.icon className="w-5 h-5" />
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom section */}
            <div className="p-4 border-t border-gray-100 dark:border-dark-border space-y-3">
                <div className="flex items-center justify-between px-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Theme</span>
                    <DarkModeToggle />
                </div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium
                     text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10
                     transition-all duration-200"
                >
                    <HiLogout className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile toggle */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white shadow-lg dark:bg-dark-card"
                onClick={() => setMobileOpen(!mobileOpen)}
            >
                {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-dark-card border-r border-gray-100 
                     dark:border-dark-border flex flex-col z-40 transition-transform duration-300 
                     lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {navContent}
            </aside>
        </>
    );
};

export default Sidebar;
