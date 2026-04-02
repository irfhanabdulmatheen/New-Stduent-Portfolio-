import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProfile, getProjects, getCertifications, updateProfile } from '../../services/api';
import {
    HiLogout, HiPhone, HiDocumentText,
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
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Generate deterministic pseudo-random data based on user id/email
    const userHash = [user?._id, user?.email, 'default'].join('').split('').reduce((acc, char) => {
        return ((acc << 5) - acc) + char.charCodeAt(0) | 0;
    }, 0);
    const absHash = Math.abs(userHash);
    
    // Random Grades
    const dummyCgpa = (7.0 + (absHash % 300) / 100).toFixed(2);
    const dummySgpa = Array.from({length: 5}, (_, i) => {
        const val = 6.5 + ((absHash + i * 13) % 350) / 100;
        return Math.min(10, val).toFixed(2);
    }).map(Number);
    const dummyFeesDue = "12,000";
    const dummyRegNo = "7376231CS" + (100 + absHash % 900);
    const dummyDept = "B.E. - COMPUTER SCIENCE AND ENGINEERING";
    
    // Dummy Data for Projects & Certifications
    const allDummyProjects = [
        { _id: 'dm1', title: 'Cloud AI Image Analyzer', description: 'A serverless application using AWS Lambda and Google Cloud Vision AI.', technologies: ['AWS', 'GCP', 'Node.js'] },
        { _id: 'dm2', title: 'Predictive Maintenance API', description: 'AI-driven cloud API for predicting machine failures using sensor data.', technologies: ['Azure', 'Python', 'FastAPI'] },
        { _id: 'dm3', title: 'Fullstack E-Commerce Platform', description: 'A modern e-commerce application with payment and auth integration.', technologies: ['MongoDB', 'React', 'Node.js'] },
        { _id: 'dm4', title: 'Serverless Task Manager', description: 'Cloud native task management system utilizing fullstack serverless architecture.', technologies: ['Firebase', 'React', 'Tailwind'] },
        { _id: 'dm5', title: 'AI Customer Support Bot', description: 'Chatbot integrating OpenAI API for intelligent customer support.', technologies: ['OpenAI', 'Next.js', 'Vercel'] }
    ];
    const pickedProjects = [
        allDummyProjects[absHash % allDummyProjects.length],
        allDummyProjects[(absHash + 1) % allDummyProjects.length]
    ];
    
    const allDummyCertifications = [
        { id: 1, title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: 'Aug 2025' },
        { id: 2, title: 'Professional Cloud Architect', issuer: 'Google Cloud', date: 'Jan 2026' },
        { id: 3, title: 'Meta Front-End Developer', issuer: 'Coursera', date: 'Mar 2025' },
        { id: 4, title: 'Azure Fundamentals', issuer: 'Microsoft', date: 'Nov 2024' },
        { id: 5, title: 'Full Stack Web Developer', issuer: 'Udacity', date: 'Dec 2024' }
    ];
    const pickedCertifications = [
        allDummyCertifications[(absHash + 2) % allDummyCertifications.length],
        allDummyCertifications[(absHash + 3) % allDummyCertifications.length]
    ];
    const dummyStudentPhone = "+91 98765 43210";
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, projectsRes, certsRes] = await Promise.allSettled([
                    getProfile(),
                    getProjects(),
                    getCertifications()
                ]);
                
                const p = profileRes.status === 'fulfilled' ? profileRes.value.data.profile : null;
                const pList = projectsRes.status === 'fulfilled' ? projectsRes.value.data : [];
                const cList = certsRes.status === 'fulfilled' ? certsRes.value.data : [];

                setProfile(p);
                setProjects(pList || []);
                setCerts(cList || []);
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile Summary */}
                <div className="space-y-6">
                    <div className="card text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary-500 to-violet-600 opacity-10"></div>
                        <div className="relative pt-4">
                            <div className="relative inline-block mb-4">
                                <img
                                    src={profile?.profileImage ? `http://localhost:5001${profile.profileImage}` : defaultAvatar}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md mx-auto"
                                />
                                <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                            </div>
                            <h2 className="text-xl font-bold dark:text-white uppercase">{user?.name}</h2>
                            <p className="text-sm font-mono text-gray-500 dark:text-gray-400 mt-1 tracking-widest">{profile?.rollNo || dummyRegNo}</p>

                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                <span className="badge-primary uppercase tracking-tighter">{profile?.degree || 'Continuing'}</span>
                                <span className="badge-success uppercase tracking-tighter">{profile?.year || '3rd Year'}</span>
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
                            <h3 className="text-2xl font-bold dark:text-white mt-1">{profile?.currentArrears || '0'}</h3>
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
                            {(profile?.cgpaSemesters?.length > 0 ? profile.cgpaSemesters.slice(0, 8) : dummySgpa).map((val, index) => {
                                const score = Number(val);
                                if (!score || score <= 0) return null;
                                return (
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
                                );
                            })}
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
                            {!projects || projects.length === 0 ? (
                                <div className="col-span-full py-6 text-center text-gray-400 text-sm bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800">
                                    No projects added yet.
                                </div>
                            ) : projects.slice(0, 2).map((project, index) => (
                                <div key={project._id || index} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
                                    <h4 className="text-sm font-bold dark:text-white truncate">{project.title}</h4>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{project.description}</p>
                                    <div className="mt-3 flex items-center gap-3">
                                        {project.githubLink && project.githubLink !== '#' && (
                                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-500">
                                                <FaGithub className="w-4 h-4" />
                                            </a>
                                        )}
                                        <div className="flex-1 flex flex-wrap gap-1">
                                            {project.technologies?.slice(0, 3).map(tech => (
                                                <span key={tech} className="text-[9px] px-2 py-0.5 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 dark:text-gray-300 font-bold uppercase">{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Certifications Preview */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <HiLightningBolt className="w-5 h-5 text-amber-500" />
                                Certifications
                            </h3>
                            <button onClick={() => navigate('/student/certifications')} className="text-xs font-bold text-primary-600 hover:underline">View All →</button>
                        </div>
                        <div className="flex flex-col gap-3">
                            {!certs || certs.filter(c => c.status === 'approved').length === 0 ? (
                                <p className="text-xs text-gray-500 text-center py-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-100 dark:border-gray-800">
                                    No approved certifications yet.
                                </p>
                            ) : certs.filter(c => c.status === 'approved').slice(0, 3).map((cert, i) => (
                                <div key={cert._id || i} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/10 hover:bg-white/60 dark:hover:bg-gray-800/20 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                        <HiCheckCircle className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{cert.courseName || cert.title}</h4>
                                            {cert.link && (
                                                <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                                                    <HiExternalLink className="w-3 h-3" />
                                                </a>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500">{cert.issuedBy || cert.issuer}</p>
                                    </div>
                                    <div className="text-xs font-bold text-gray-400 whitespace-nowrap">
                                        {cert.completionDate ? new Date(cert.completionDate).toLocaleDateString() : cert.date}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default StudentDashboard;
