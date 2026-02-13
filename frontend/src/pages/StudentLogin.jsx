import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import DarkModeToggle from '../components/DarkModeToggle';

const StudentLogin = () => {
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
            if (res.data.user.role !== 'student') {
                setError('Please use the admin login page');
                setLoading(false);
                return;
            }
            login(res.data.token, res.data.user);
            navigate('/student');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-dark-bg">
            {/* Left side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="flex items-center justify-between mb-8">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center">
                                <span className="text-white font-bold">P</span>
                            </div>
                            <span className="font-bold text-lg text-gray-900 dark:text-white">Portfolio</span>
                        </Link>
                        <DarkModeToggle />
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">Sign in to your student account</p>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                          text-red-700 dark:text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="label">Email</label>
                            <div className="relative">
                                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    className="input-field pl-12"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <div className="relative">
                                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="input-field pl-12 pr-12"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">Sign Up</Link>
                    </p>
                </div>
            </div>

            {/* Right side - Decorative */}
            <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary-600 to-violet-700 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white blur-3xl"></div>
                </div>
                <div className="relative z-10 text-center text-white p-12 max-w-lg">
                    <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
                        <HiLockClosed className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Student Portal</h3>
                    <p className="text-primary-100 text-lg leading-relaxed">
                        Manage your portfolio, showcase your projects, and build your professional brand — all in one place.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StudentLogin;
