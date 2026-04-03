import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage, loginUser } from '../services/api';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiAcademicCap, HiUser, HiBadgeCheck, HiBriefcase, HiArrowRight } from 'react-icons/hi';
import DarkModeToggle from '../components/DarkModeToggle';

const UnifiedLogin = () => {
    // The role tab currently selected. Default is 'student'.
    const [selectedRole, setSelectedRole] = useState('student');
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await loginUser(form);

            const normalizeRole = (r) => (typeof r === 'string' ? r.trim().toLowerCase() : '');
            const actualRole = normalizeRole(res.data.user?.role);
            const requestedRole = normalizeRole(selectedRole);

            // Enforce: login must be done from the matching role tab.
            if (actualRole !== requestedRole) {
                setError(`You are a ${actualRole} account. Please login using the ${actualRole} tab.`);
                setLoading(false);
                return;
            }

            login(res.data.token, res.data.user);

            // Redirect based on role (now it's guaranteed to match requestedRole)
            if (actualRole === 'admin') {
                navigate('/admin');
            } else if (actualRole === 'teacher') {
                navigate('/teacher');
            } else {
                navigate('/student');
            }
        } catch (err) {
            setError(getApiErrorMessage(err, 'Login failed'));
        }
        setLoading(false);
    };

    const roleStyles = {
        student: {
            bg: "bg-[#3c3d8a]",
            btn: "bg-[#5046e6] hover:bg-[#4338ca] shadow-[#5046e6]/20 focus:ring-[#5046e6]/20",
            text: "text-[#5046e6] dark:text-[#818cf8]",
            tabActive: "text-[#5046e6] dark:text-[#818cf8]",
            description: "Cultivate your academic presence. Systematically document your scholarly achievements, catalog your technical projects, and establish a distinguished portfolio for prospective opportunities.",
            cards: [
                { icon: HiAcademicCap, text: "Academic Journey" },
                { icon: HiBadgeCheck, text: "Verify Credentials" },
                { icon: HiBriefcase, text: "Exhibit Expertise" }
            ]
        },
        teacher: {
            bg: "bg-[#047857]", // Emerald
            btn: "bg-[#059669] hover:bg-[#047857] shadow-[#059669]/20 focus:ring-[#059669]/20",
            text: "text-[#059669] dark:text-[#34d399]",
            tabActive: "text-[#059669] dark:text-[#34d399]",
            description: "Manage your assigned students, track their academic progress, and review their portfolio projects in one unified dashboard.",
            cards: [
                { icon: HiUser, text: "Monitor Students" },
                { icon: HiBadgeCheck, text: "Assess Progress" },
                { icon: HiBriefcase, text: "Review Portfolios" }
            ]
        },
        admin: {
            bg: "bg-[#334155]", // Slate 700
            btn: "bg-[#475569] hover:bg-[#334155] shadow-[#475569]/20 focus:ring-[#475569]/20",
            text: "text-[#475569] dark:text-[#94a3b8]",
            tabActive: "text-[#475569] dark:text-[#94a3b8]",
            description: "Oversee the entire platform. Manage student and teacher accounts, assign users, and monitor overall system analytics.",
            cards: [
                { icon: HiUser, text: "Manage Accounts" },
                { icon: HiBadgeCheck, text: "System Oversight" },
                { icon: HiBriefcase, text: "Platform Analytics" }
            ]
        }
    };

    const currentStyle = roleStyles[selectedRole];

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-dark-bg font-['Inter']">
            {/* Left side - Decorative & Info */}
            <div className={`hidden lg:flex flex-col flex-1 items-center justify-center ${currentStyle.bg} relative overflow-hidden px-12 py-16 text-center text-white transition-colors duration-500`}>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-[100px]"></div>
                    <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-white blur-[120px]"></div>
                </div>
                
                <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
                    {/* Icon */}
                    <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-8 border border-white/20">
                        <HiAcademicCap className="w-14 h-14 text-white" />
                    </div>
                    
                    {/* Title */}
                    <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                        Student Portfolio System
                    </h1>
                    
                    {/* Description */}
                    <p className="text-[#c7c8fc] text-lg leading-relaxed mb-16 max-w-md h-20">
                        {currentStyle.description}
                    </p>
                    
                    {/* Bottom Feature Cards */}
                    <div className="grid grid-cols-3 gap-4 w-full max-w-lg mt-auto">
                        {currentStyle.cards.map((card, index) => {
                            const Icon = card.icon;
                            return (
                                <div key={index} className="flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition border border-white/10 rounded-2xl p-4">
                                    <Icon className="w-6 h-6 mb-2 text-white/80" />
                                    <span className="text-sm font-medium text-white/90 text-center">{card.text}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white dark:bg-dark-card relative">
                <div className="absolute top-6 right-6">
                    <DarkModeToggle />
                </div>
                
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-[#111827] dark:text-white mb-3">Welcome Back</h2>
                        <p className="text-[#6b7280] dark:text-gray-400">Please sign in to continue to your dashboard.</p>
                    </div>

                    {/* Role Switcher */}
                    <div className="flex bg-[#f3f4f6] dark:bg-gray-800 rounded-xl p-1 mb-10 border border-gray-100 dark:border-gray-700">
                        {['student', 'teacher', 'admin'].map((role) => (
                            <button
                                key={role}
                                type="button"
                                onClick={() => setSelectedRole(role)}
                                className={`flex-1 py-2.5 text-sm font-medium rounded-lg capitalize transition-all duration-200 ${
                                    selectedRole === role 
                                    ? `bg-white dark:bg-dark-card ${roleStyles[role].tabActive} shadow-sm border border-gray-100 dark:border-gray-700` 
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                          text-red-700 dark:text-red-300 text-sm flex items-center justify-center text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-sans">Email or ID</label>
                            <div className="relative">
                                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    className="w-full pl-11 pr-4 py-3 bg-[#f8fafc] w-full border border-gray-200 focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/10 rounded-xl text-sm transition-all dark:bg-dark-bg dark:border-dark-border dark:focus:border-primary-500 text-gray-900 dark:text-white"
                                    placeholder="username@example.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-sans">Password</label>
                            <div className="relative">
                                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full pl-11 pr-11 py-3 bg-[#f8fafc] w-full border border-gray-200 focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/10 rounded-xl text-sm transition-all dark:bg-dark-bg dark:border-dark-border dark:focus:border-primary-500 text-gray-900 dark:text-white"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <a href="#" className={`text-sm font-medium ${currentStyle.text} hover:opacity-80 transition-opacity`}>
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 px-4 ${currentStyle.btn} text-white rounded-xl font-medium shadow-sm transition-all focus:ring-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Signing in...
                                </span>
                            ) : (
                                <>
                                    Sign in as <span className="capitalize">{selectedRole}</span>
                                    <HiArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200 dark:border-gray-700"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-dark-card px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
                            </div>
                        </div>

                        <div className="flex justify-center w-full">
                            <div className="w-full overflow-hidden flex justify-center">
                            {/* Google sign-in removed (use email/password login instead) */}
                            </div>
                        </div>
                    </form>

                    {selectedRole === 'student' && (
                        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-[#5046e6] dark:text-[#818cf8] hover:underline font-semibold">
                                Register
                            </Link>
                        </p>
                    )}
                    
                    <div className="mt-8 text-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                        <p className="text-xs text-gray-800 dark:text-gray-300 font-medium mb-1">Signing in</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Use the email and password from your registration.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnifiedLogin;
