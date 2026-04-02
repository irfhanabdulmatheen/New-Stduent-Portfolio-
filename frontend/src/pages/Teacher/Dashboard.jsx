import { useState, useEffect } from 'react';
import { getAssignedStudents } from '../../services/api';
import { HiSearch, HiEye } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            const res = await getAssignedStudents(params);
            setStudents(res.data);
        } catch (err) { 
            console.error(err); 
        }
        setLoading(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchStudents();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Assigned Students</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">You have {students.length} student{students.length !== 1 ? 's' : ''} assigned</p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="card">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" className="input-field pl-12" placeholder="Search by name..."
                            value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <button type="submit" className="btn-primary px-6">Search</button>
                </div>
            </form>

            {/* Student Table */}
            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
            ) : students.length === 0 ? (
                <div className="card text-center py-12 text-gray-500 dark:text-gray-400">
                    No assigned students found matching your criteria.
                </div>
            ) : (
                <div className="card p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/50">
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Projects</th>
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                                {students.map((student) => (
                                    <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white font-bold text-sm">{student.name?.[0]?.toUpperCase()}</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white text-sm">{student.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                                            {student.profile?.department || '—'}
                                        </td>
                                        <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                                            {student.projectCount || 0}
                                        </td>

                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <Link to={`/teacher/students/${student._id}`}
                                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-primary-600 transition-colors"
                                                    title="View Details">
                                                    <HiEye className="w-4 h-4" />
                                                </Link>
                                            </div>
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

export default TeacherDashboard;
