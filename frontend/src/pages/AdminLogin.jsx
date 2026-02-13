import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiShieldCheck } from 'react-icons/hi';
import DarkModeToggle from '../components/DarkModeToggle';

const AdminLogin = () => {
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
            if (res.data.user.role !== 'admin') {
                setError('This account is not an admin. Please use student login.');
                setLoading(false);
                return;
            }
            login(res.data.token, res.data.user);
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary-600/20 blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-md p-8">
                <div className="flex items-center justify-between mb-8">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center">
                            <span className="text-white font-bold">P</span>
                        </div>
                        <span className="font-bold text-lg text-white">Portfolio</span>
                    </Link>
                    <DarkModeToggle />
                </div>

                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8">
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center">
                            <HiShieldCheck className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white text-center mb-1">Admin Login</h2>
                    <p className="text-gray-400 text-center mb-6 text-sm">Authorized personnel only</p>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-800 text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                            <div className="relative">
                                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-700 bg-gray-800 
                             text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                             focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="admin@portfolio.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                            <div className="relative">
                                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full px-4 py-3 pl-12 pr-12 rounded-xl border border-gray-700 bg-gray-800 
                             text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                             focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
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
                                    Authenticating...
                                </span>
                            ) : 'Access Dashboard'}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Student?{' '}
                    <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold">Sign in here</Link>
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
