import { useState, useEffect } from 'react';
import { HiBriefcase, HiOfficeBuilding, HiBadgeCheck, HiXCircle } from 'react-icons/hi';
import { getProfile } from '../../services/api';

const Placements = () => {
    const [loading, setLoading] = useState(true);
    
    // Using dummy numbers as per requirements ("shows no of companies attended and no of offers student have")
    // In a real database this would be tied to the profile or a placements collection.
    const placementData = {
        companiesAttended: 8,
        offersReceived: 2,
        highestCTC: "12 LPA",
        applications: [
            { id: 1, company: 'Google', role: 'Software Engineer', status: 'In Progress', date: '2025-02-15' },
            { id: 2, company: 'Amazon', role: 'SDE-1', status: 'Offered', date: '2025-01-20' },
            { id: 3, company: 'TCS', role: 'System Engineer', status: 'Offered', date: '2024-11-05' },
            { id: 4, company: 'Microsoft', role: 'Software Engineer', status: 'Rejected', date: '2024-12-10' },
            { id: 5, company: 'Infosys', role: 'System Engineer Specialist', status: 'Applied', date: '2025-03-01' }
        ]
    };

    useEffect(() => {
        // Simulating API fetch
        const fetchPlacements = async () => {
            try {
                // Fake delay to simulate network request
                setTimeout(() => setLoading(false), 800);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchPlacements();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Offered': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Offered</span>;
            case 'In Progress': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">In Progress</span>;
            case 'Rejected': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Rejected</span>;
            default: return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">Applied</span>;
        }
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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <HiBriefcase className="w-7 h-7 text-primary-500" />
                        Placements
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Track your campus placement opportunities and job offers.</p>
                </div>
            </div>

            {/* Placement Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center">
                        <HiOfficeBuilding className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Companies Attended</p>
                        <h3 className="text-3xl font-black text-blue-700 dark:text-blue-300">{placementData.companiesAttended}</h3>
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-100 dark:border-emerald-800 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center">
                        <HiBadgeCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Offers Received</p>
                        <h3 className="text-3xl font-black text-emerald-700 dark:text-emerald-300">{placementData.offersReceived}</h3>
                    </div>
                </div>
                
                <div className="card bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 border-purple-100 dark:border-purple-800 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-800/50 flex items-center justify-center">
                        <HiBriefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Highest CTC</p>
                        <h3 className="text-3xl font-black text-purple-700 dark:text-purple-300">{placementData.highestCTC}</h3>
                    </div>
                </div>
            </div>

            {/* Applications List */}
            <div className="card mt-8 border-t-4 border-t-primary-500">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Application History</h3>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                <th className="pb-4 pl-4">Company</th>
                                <th className="pb-4">Role</th>
                                <th className="pb-4">Date Applied</th>
                                <th className="pb-4 text-right pr-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50 text-sm">
                            {placementData.applications.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="py-4 pl-4 font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">
                                            {app.company.charAt(0)}
                                        </div>
                                        {app.company}
                                    </td>
                                    <td className="py-4 text-gray-600 dark:text-gray-300 font-medium">
                                        {app.role}
                                    </td>
                                    <td className="py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">
                                        {new Date(app.date).toLocaleDateString('en-GB')}
                                    </td>
                                    <td className="py-4 text-right pr-4">
                                        {getStatusBadge(app.status)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>
    );
};

export default Placements;
