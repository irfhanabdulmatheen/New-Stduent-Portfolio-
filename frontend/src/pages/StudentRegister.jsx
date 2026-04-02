import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerStudent, updateProfile } from '../services/api';
import { HiMail, HiLockClosed, HiUser, HiEye, HiEyeOff, HiAcademicCap } from 'react-icons/hi';
import DarkModeToggle from '../components/DarkModeToggle';

const StudentRegister = () => {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [profileForm, setProfileForm] = useState({
        rollNo: '', degree: '', department: '', year: '', phone: '', currentArrears: '0', cgpaSemesters: ['', '', '', '', '', '', '', ''], cgpa: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const res = await registerStudent({ name: form.name, email: form.email, password: form.password });
            login(res.data.token, res.data.user);
            setStep(2);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
        setLoading(false);
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = { ...profileForm, cgpaSemesters: JSON.stringify(profileForm.cgpaSemesters) };
            await updateProfile(data);
            navigate('/student');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to complete profile');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-dark-bg">
            {/* Left side - Decorative */}
            <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-700 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-white blur-3xl"></div>
                    <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-white blur-3xl"></div>
                </div>
                <div className="relative z-10 text-center text-white p-12 max-w-lg">
                    <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
                        <HiUser className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Join Us Today</h3>
                    <p className="text-emerald-100 text-lg leading-relaxed">
                        Create your professional portfolio and start showcasing your work to the world.
                    </p>
                </div>
            </div>

            {/* Right side - Form */}
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

                    {step === 1 ? (
                    <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create account</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">Start building your portfolio</p>
                    </>
                    ) : (
                    <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Complete Profile</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">Add your academic details</p>
                    </>
                    )}

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                          text-red-700 dark:text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    {step === 1 ? (
                    <>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Full Name</label>
                            <div className="relative">
                                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    className="input-field pl-12"
                                    placeholder="John Doe"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

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
                                    placeholder="Min. 6 characters"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                    minLength={6}
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

                        <div>
                            <label className="label">Confirm Password</label>
                            <div className="relative">
                                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    className="input-field pl-12"
                                    placeholder="••••••••"
                                    value={form.confirmPassword}
                                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                    required
                                />
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
                                    Creating account...
                                </span>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign In</Link>
                    </p>
                    </>
                    ) : (
                    <form onSubmit={handleProfileSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block tracking-widest text-[10px] font-bold text-gray-500 uppercase mb-2">Roll Number</label>
                                <input required type="text" value={profileForm.rollNo} onChange={e => setProfileForm({...profileForm, rollNo: e.target.value})} className="input-field" placeholder="e.g. 7376231CS101" />
                            </div>
                            <div>
                                <label className="block tracking-widest text-[10px] font-bold text-gray-500 uppercase mb-2">Phone</label>
                                <input required type="text" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} className="input-field" placeholder="+91 98765 43210" />
                            </div>
                            <div>
                                <label className="block tracking-widest text-[10px] font-bold text-gray-500 uppercase mb-2">Degree</label>
                                <select required value={profileForm.degree} onChange={e => setProfileForm({...profileForm, degree: e.target.value})} className="input-field">
                                    <option value="">Select Degree</option>
                                    <option value="B.E.">B.E.</option>
                                    <option value="B.Tech.">B.Tech.</option>
                                    <option value="M.E.">M.E.</option>
                                </select>
                            </div>
                            <div>
                                <label className="block tracking-widest text-[10px] font-bold text-gray-500 uppercase mb-2">Department</label>
                                <input required type="text" value={profileForm.department} onChange={e => setProfileForm({...profileForm, department: e.target.value})} className="input-field" placeholder="Computer Science" />
                            </div>
                            <div>
                                <label className="block tracking-widest text-[10px] font-bold text-gray-500 uppercase mb-2">Year</label>
                                <select required value={profileForm.year} onChange={e => setProfileForm({...profileForm, year: e.target.value})} className="input-field">
                                    <option value="">Select Year</option>
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                </select>
                            </div>
                            <div>
                                <label className="block tracking-widest text-[10px] font-bold text-gray-500 uppercase mb-2">Arrears</label>
                                <input required type="number" min="0" value={profileForm.currentArrears} onChange={e => setProfileForm({...profileForm, currentArrears: e.target.value})} className="input-field" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block tracking-widest text-[10px] font-bold text-gray-500 uppercase mb-2">Overall CGPA</label>
                                <input required type="number" step="0.01" min="0" max="10" value={profileForm.cgpa} onChange={e => setProfileForm({...profileForm, cgpa: e.target.value})} className="input-field" placeholder="e.g. 8.5" />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-dark-border pt-4 mt-2">
                            <label className="block tracking-widest text-[10px] font-bold text-gray-500 uppercase mb-3 text-center">Semester-wise CGPA </label>
                            <div className="grid grid-cols-4 gap-2">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i}>
                                        <input type="number" step="0.01" min="0" max="10" 
                                            value={profileForm.cgpaSemesters[i] || ''} 
                                            onChange={e => {
                                                const newArr = [...profileForm.cgpaSemesters];
                                                newArr[i] = e.target.value;
                                                setProfileForm({...profileForm, cgpaSemesters: newArr});
                                            }}
                                            className="w-full px-2 py-1.5 rounded-lg border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white text-xs text-center" placeholder={`S${i+1}`} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed mt-4">
                            {loading ? 'Saving...' : 'Finish Setup'}
                        </button>
                    </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentRegister;
