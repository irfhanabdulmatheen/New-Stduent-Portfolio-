import { useState, useEffect } from 'react';
import { getAdminDepartments, createAdminDepartment } from '../../services/api';
import { HiOfficeBuilding, HiPlus } from 'react-icons/hi';

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newDept, setNewDept] = useState('');

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await getAdminDepartments();
            setDepartments(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await createAdminDepartment({ name: newDept });
            setNewDept('');
            setIsAdding(false);
            fetchDepartments();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Departments</h1>
                <button onClick={() => setIsAdding(!isAdding)} className="btn-primary flex items-center gap-2">
                    <HiPlus className="w-5 h-5" /> Add Department
                </button>
            </div>

            {isAdding && (
                <div className="card">
                    <form onSubmit={handleAdd} className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Department Name"
                            className="input-field flex-1"
                            value={newDept}
                            onChange={e => setNewDept(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn-primary">Save</button>
                        <button type="button" onClick={() => setIsAdding(false)} className="btn-secondary">Cancel</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept, idx) => (
                    <div key={idx} className="card flex items-center gap-4 hover:border-primary-500 transition-colors">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-lg flex items-center justify-center">
                            <HiOfficeBuilding className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{dept.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Departments;
