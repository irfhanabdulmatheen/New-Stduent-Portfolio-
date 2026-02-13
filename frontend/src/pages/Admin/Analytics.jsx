import { useState, useEffect } from 'react';
import { getAnalytics } from '../../services/api';
import { HiUsers, HiCollection, HiLightningBolt, HiAcademicCap, HiTrendingUp } from 'react-icons/hi';

const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await getAnalytics();
                setAnalytics(res.data);
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    const metrics = [
        { label: 'Total Students', value: analytics?.totalStudents || 0, icon: HiUsers, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' },
        { label: 'Total Projects', value: analytics?.totalProjects || 0, icon: HiCollection, color: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20 dark:text-violet-400' },
        { label: 'Total Skills', value: analytics?.totalSkills || 0, icon: HiLightningBolt, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400' },
        { label: 'Certifications', value: analytics?.totalCertifications || 0, icon: HiAcademicCap, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' },
    ];

    const avgProjects = analytics?.totalStudents > 0
        ? (analytics.totalProjects / analytics.totalStudents).toFixed(1) : 0;
    const avgSkills = analytics?.totalStudents > 0
        ? (analytics.totalSkills / analytics.totalStudents).toFixed(1) : 0;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">System insights and statistics</p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m, i) => (
                    <div key={i} className="card">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.color}`}>
                                <m.icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{m.label}</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{m.value}</p>
                    </div>
                ))}
            </div>

            {/* Averages */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="card">
                    <div className="flex items-center gap-2 mb-4">
                        <HiTrendingUp className="w-5 h-5 text-primary-600" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Averages per Student</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600 dark:text-gray-400">Avg. Projects</span>
                                <span className="font-semibold text-gray-900 dark:text-white">{avgProjects}</span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-700"
                                    style={{ width: `${Math.min(avgProjects * 20, 100)}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600 dark:text-gray-400">Avg. Skills</span>
                                <span className="font-semibold text-gray-900 dark:text-white">{avgSkills}</span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700"
                                    style={{ width: `${Math.min(avgSkills * 15, 100)}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Student Health */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Student Health</h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/10">
                            <span className="text-sm text-emerald-700 dark:text-emerald-300">Active Students</span>
                            <span className="font-bold text-emerald-700 dark:text-emerald-300">{analytics?.activeStudents || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-900/10">
                            <span className="text-sm text-red-700 dark:text-red-300">Blocked Students</span>
                            <span className="font-bold text-red-700 dark:text-red-300">{analytics?.blockedStudents || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10">
                            <span className="text-sm text-blue-700 dark:text-blue-300">Active Rate</span>
                            <span className="font-bold text-blue-700 dark:text-blue-300">
                                {analytics?.totalStudents > 0
                                    ? Math.round((analytics.activeStudents / analytics.totalStudents) * 100) : 0}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Department Distribution */}
            {analytics?.departmentDistribution && Object.keys(analytics.departmentDistribution).length > 0 && (
                <div className="card">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Students by Department</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(analytics.departmentDistribution).map(([dept, count]) => (
                            <div key={dept} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                <span className="font-medium text-gray-900 dark:text-white">{dept}</span>
                                <span className="badge-primary">{count} student{count !== 1 ? 's' : ''}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;
