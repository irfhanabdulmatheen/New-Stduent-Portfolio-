import { useState, useEffect } from 'react';
import { getAnalytics, getPendingProjects, updateProjectStatus, getTeachers } from '../../services/api';
import { HiUsers, HiCollection, HiLightningBolt, HiAcademicCap, HiShieldExclamation, HiCheckCircle, HiCheck, HiX, HiUserGroup, HiEye, HiChevronRight } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [pendingProjects, setPendingProjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsRes, pendingRes, teachersRes] = await Promise.all([
                    getAnalytics(),
                    getPendingProjects(),
                    getTeachers()
                ]);
                setAnalytics(analyticsRes.data);
                setPendingProjects(pendingRes.data);
                setTeachers(teachersRes.data);
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateProjectStatus(id, status);
            setPendingProjects(prev => prev.filter(p => p._id !== id));
            if (status === 'approved' && analytics) {
                setAnalytics(prev => ({
                    ...prev,
                    totalProjects: prev.totalProjects + 1
                }));
            }
        } catch (err) { console.error(err); }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    const statCards = [
        { label: 'Total Students', value: analytics?.totalStudents || 0, icon: HiUsers, color: 'from-blue-500 to-cyan-500' },
        { label: 'Active Students', value: analytics?.activeStudents || 0, icon: HiCheckCircle, color: 'from-emerald-500 to-teal-500' },
        { label: 'Blocked Students', value: analytics?.blockedStudents || 0, icon: HiShieldExclamation, color: 'from-red-500 to-pink-500' },
        { label: 'Total Projects', value: analytics?.totalProjects || 0, icon: HiCollection, color: 'from-violet-500 to-purple-500' },
        { label: 'Certifications', value: analytics?.totalCertifications || 0, icon: HiAcademicCap, color: 'from-indigo-500 to-blue-500' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">System overview and management</p>
            </div>

            {/* Pending Projects */}
            {pendingProjects.length > 0 && (
                <div className="card border-l-4 border-l-amber-500">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <HiLightningBolt className="w-5 h-5 text-amber-500" />
                        Pending Project Approvals
                        <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">{pendingProjects.length}</span>
                    </h2>
                    <div className="space-y-4">
                        {pendingProjects.map(project => (
                            <div key={project._id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{project.description}</p>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                        <span>By: <span className="font-medium text-gray-900 dark:text-white">{project.userId?.name}</span></span>
                                        <span>•</span>
                                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                        {project.githubLink && (
                                            <>
                                                <span>•</span>
                                                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">View Code</a>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleStatusUpdate(project._id, 'approved')}
                                        className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors flex items-center gap-1">
                                        <HiCheck className="w-4 h-4" /> Approve
                                    </button>
                                    <button onClick={() => handleStatusUpdate(project._id, 'rejected')}
                                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors flex items-center gap-1">
                                        <HiX className="w-4 h-4" /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="card-hover group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            </div>
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center
                              group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Faculty Overview */}
            {teachers.length > 0 && (
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <HiUserGroup className="w-5 h-5 text-emerald-500" />
                            Faculty Overview
                        </h2>
                        <Link to="/admin/students" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                            Manage All →
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teachers.map(teacher => (
                            <div
                                key={teacher._id}
                                className="group relative flex flex-col gap-3 p-4 rounded-2xl border border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-gray-800/30 hover:bg-white dark:hover:bg-gray-800/60 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all duration-200 cursor-pointer"
                                onClick={() => navigate(`/admin/students?teacher=${teacher._id}`)}
                            >
                                {/* Teacher avatar + info */}
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                                        {teacher.name?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{teacher.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{teacher.email}</p>
                                    </div>
                                </div>

                                {/* Student count badge */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                                            teacher.studentCount > 0
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                        }`}>
                                            <HiUsers className="w-3.5 h-3.5" />
                                            {teacher.studentCount || 0} {teacher.studentCount === 1 ? 'Student' : 'Students'}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <HiEye className="w-3.5 h-3.5" />
                                        View
                                    </div>
                                </div>

                                {/* Arrow indicator */}
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <HiChevronRight className="w-4 h-4 text-emerald-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Department Distribution */}
            {analytics?.departmentDistribution && Object.keys(analytics.departmentDistribution).length > 0 && (
                <div className="card">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Department Distribution</h2>
                    <div className="space-y-3">
                        {Object.entries(analytics.departmentDistribution).map(([dept, count]) => {
                            const maxCount = Math.max(...Object.values(analytics.departmentDistribution));
                            const percent = (count / maxCount) * 100;
                            return (
                                <div key={dept} className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-36 truncate">{dept}</span>
                                    <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-primary-500 to-violet-500 rounded-full transition-all duration-700"
                                            style={{ width: `${percent}%` }}></div>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white w-8 text-right">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Recent Students */}
            {analytics?.recentStudents?.length > 0 && (
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Registrations</h2>
                        <Link to="/admin/students" className="text-primary-600 hover:text-primary-700 text-sm font-medium">View All →</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-dark-border">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.recentStudents.map((student) => (
                                    <tr key={student._id} className="border-b border-gray-50 dark:border-dark-border/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{student.name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{student.email}</td>
                                        <td className="py-3 px-4">
                                            <span className={student.isActive ? 'badge-success' : 'badge-danger'}>
                                                {student.isActive ? 'Active' : 'Blocked'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(student.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
