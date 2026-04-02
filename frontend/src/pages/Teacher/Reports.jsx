import { useState, useEffect } from 'react';
import { getTeacherReports } from '../../services/api';
import { HiDocumentReport } from 'react-icons/hi';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTeacherReports().then(res => {
            setReports(res.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Reports</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report, idx) => (
                    <div key={idx} className="card flex flex-col items-center text-center hover:border-primary-500 transition-colors cursor-pointer">
                        <HiDocumentReport className="w-12 h-12 text-primary-500 mb-4" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">{report.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Generated on: {new Date(report.date).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reports;
