import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProfile, getProjects, getResumeData } from '../../services/api';
import {
    HiLogout, HiPhone, HiDownload, HiDocumentText,
    HiFolderOpen, HiExternalLink, HiAcademicCap,
    HiCollection, HiLightningBolt, HiCheckCircle
} from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dummy fallback data for UI demonstration (as seen in previous version)
    const dummySgpa = [7.14, 7.43, 7.95, 7.68, 7.32];
    const dummyCgpa = "7.52";
    const dummyFeesDue = "12,000";
    const dummyRegNo = "7376231CS181";
    const dummyDept = "B.E. - COMPUTER SCIENCE AND ENGINEERING";
    const dummyStudentPhone = "+91 98765 43210";
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, projectsRes] = await Promise.all([
                    getProfile(),
                    getProjects()
                ]);
                setProfile(profileRes.data.profile);
                setProjects(projectsRes.data);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">
                        Welcome, {user?.name}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your portfolio today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary py-2 flex items-center gap-2">
                        <HiDownload className="w-4 h-4" />
                        Download CV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile Summary */}
                <div className="space-y-6">
                    <div className="card text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary-500 to-violet-600 opacity-10"></div>
                        <div className="relative pt-4">
                            <div className="relative inline-block mb-4">
                                <img
                                    src={profile?.profileImage ? `http://localhost:5000${profile.profileImage}` : defaultAvatar}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md mx-auto"
                                />
                                <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                            </div>
                            <h2 className="text-xl font-bold dark:text-white uppercase">{user?.name}</h2>
                            <p className="text-sm font-mono text-gray-500 dark:text-gray-400 mt-1 tracking-widest">{profile?.registerNumber || dummyRegNo}</p>

                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                <span className="badge-primary uppercase tracking-tighter">Continuing</span>
                                <span className="badge-success uppercase tracking-tighter">Active</span>
                            </div>

                            <div className="mt-6 space-y-4 border-t border-gray-100 dark:border-gray-800 pt-6 text-left">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Department & Year</p>
                                    <p className="text-sm font-semibold dark:text-gray-200 uppercase">{profile?.department || dummyDept}</p>
                                    <p className="text-xs text-gray-500 mt-1">{profile?.year || '3rd Year - Semester VI'}</p>
                                </div>
                                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                                    <HiPhone className="w-4 h-4" />
                                    <span className="text-sm font-bold">{profile?.phone || dummyStudentPhone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Summary Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="card p-4 border-l-4 border-l-primary-500">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CGPA</p>
                            <h3 className="text-2xl font-bold dark:text-white mt-1">{profile?.cgpa || dummyCgpa}</h3>
                        </div>
                        <div className="card p-4 border-l-4 border-l-red-500">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Arrears</p>
                            <h3 className="text-2xl font-bold dark:text-white mt-1">0</h3>
                        </div>
                    </div>
                </div>

                {/* Right/Main Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Performance Analysis Graph (Recreated Bar Chart) */}
                    <div className="card overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">SGPA ANALYSIS</h3>
                            <HiAcademicCap className="w-5 h-5 text-primary-500" />
                        </div>
                        <div className="h-48 flex items-end justify-between px-4 pb-2 relative border-b border-gray-100 dark:border-gray-800">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30 px-2">
                                {[10, 8, 6, 4, 2, 0].map(val => (
                                    <div key={val} className="w-full border-t border-gray-100 dark:border-gray-800 h-0"></div>
                                ))}
                            </div>

                            {/* Bars */}
                            {dummySgpa.map((score, index) => (
                                <div key={index} className="flex flex-col items-center z-10 group w-8 sm:w-12">
                                    <div
                                        className="w-full bg-gradient-to-t from-primary-600 to-violet-500 rounded-t-md transition-all duration-300 hover:scale-x-110 relative"
                                        style={{ height: `${(score / 10) * 160}px` }}
                                    >
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {score}
                                        </span>
                                    </div>
                                    <span className="mt-2 text-[10px] text-gray-400 font-bold">
                                        SEM {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][index]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Previous Marksheet Section */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800 dark:text-white">Recent Academic Results</h3>
                            <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 rounded-full border border-primary-100 dark:border-primary-800 uppercase">SEMESTER V</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-[10px] text-gray-400 uppercase border-b border-gray-100 dark:border-gray-800">
                                    <tr>
                                        <th className="py-3 text-left">Code</th>
                                        <th className="py-3 text-left">Subject</th>
                                        <th className="py-3 text-center">Grade</th>
                                        <th className="py-3 text-center">Result</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                    {[
                                        { code: '21CS501', name: 'Software Engineering', grade: 'O', result: 'P' },
                                        { code: '21CS502', name: 'Computer Networks', grade: 'A+', result: 'P' },
                                        { code: '21CS503', name: 'Theory of Computation', grade: 'A', result: 'P' },
                                        { code: '21CS504', name: 'Cloud Computing', grade: 'O', result: 'P' }
                                    ].map((sub, i) => (
                                        <tr key={i} className="group hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                                            <td className="py-4 text-gray-400 font-mono text-[10px] uppercase">{sub.code}</td>
                                            <td className="py-4 font-bold text-gray-700 dark:text-gray-300 text-xs">{sub.name}</td>
                                            <td className="py-4 text-center">
                                                <span className={`font-black text-xs ${sub.grade === 'O' ? 'text-emerald-500' : 'text-primary-500'}`}>{sub.grade}</span>
                                            </td>
                                            <td className="py-4 text-center">
                                                <HiCheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Projects Preview */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <HiCollection className="w-5 h-5 text-primary-500" />
                                Featured Projects
                            </h3>
                            <button onClick={() => navigate('/student/projects')} className="text-xs font-bold text-primary-600 hover:underline">View All →</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {projects.slice(0, 2).map((project) => (
                                <div key={project._id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
                                    <h4 className="text-sm font-bold dark:text-white truncate">{project.title}</h4>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{project.description}</p>
                                    <div className="mt-3 flex items-center gap-3">
                                        {project.githubLink && (
                                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-500">
                                                <FaGithub className="w-4 h-4" />
                                            </a>
                                        )}
                                        <div className="flex-1 flex flex-wrap gap-1">
                                            {project.technologies?.slice(0, 2).map(tech => (
                                                <span key={tech} className="text-[9px] px-2 py-0.5 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 dark:text-gray-300 font-bold uppercase">{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {projects.length === 0 && (
                                <div className="col-span-full py-8 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
                                    <p className="text-sm text-gray-500">No projects added yet.</p>
                                    <button onClick={() => navigate('/student/projects')} className="text-xs font-bold text-primary-600 mt-2">Add Your First Project</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
