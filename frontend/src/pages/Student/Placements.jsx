import { useState, useEffect } from 'react';
import { getStudentPlacements, addStudentPlacement, deleteStudentPlacement } from '../../services/api';
import { HiPlus, HiTrash, HiBriefcase } from 'react-icons/hi';

const Placements = () => {
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ company: '', role: '', package: '', date: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPlacements();
    }, []);

    const fetchPlacements = async () => {
        try {
            const res = await getStudentPlacements();
            setPlacements(res.data);
        } catch (error) {
            console.error('Failed to fetch placements', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this placement record?')) return;
        try {
            await deleteStudentPlacement(id);
            setPlacements(placements.filter(p => p._id !== id));
        } catch (error) {
            console.error('Failed to delete', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await addStudentPlacement(formData);
            setPlacements([...placements, res.data]);
            setIsAdding(false);
            setFormData({ company: '', role: '', package: '', date: '' });
        } catch (error) {
            console.error('Failed to add placement', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-10">Loading placements...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Placements</h1>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn-primary flex items-center gap-2"
                >
                    <HiPlus className="w-5 h-5" /> Add Placement
                </button>
            </div>

            {isAdding && (
                <div className="card">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Add New Placement</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Company Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="label">Role *</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="label">Package (CTC)</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.package}
                                    onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="label">Date/Year</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="btn-secondary"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={saving}
                            >
                                {saving ? 'Adding...' : 'Add Placement'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {placements.length === 0 && !isAdding ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <HiBriefcase className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No placement records</h3>
                    <p className="text-gray-500">You haven't added any placements yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {placements.map((placement) => (
                        <div key={placement._id} className="card flex flex-col h-full bg-white dark:bg-gray-800 relative group overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleDelete(placement._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <HiTrash className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="mb-4 flex items-start gap-3">
                                <div className="p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg">
                                    <HiBriefcase className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 dark:text-white truncate" title={placement.role}>
                                        {placement.role}
                                    </h3>
                                    <p className="text-sm font-medium text-primary-600 dark:text-primary-400 truncate">
                                        {placement.company}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Package:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{placement.package || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Date:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{placement.date || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm pt-1">
                                    <span className="text-gray-500 dark:text-gray-400">Status:</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                        placement.status === 'Placed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                        placement.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    }`}>
                                        {placement.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Placements;
