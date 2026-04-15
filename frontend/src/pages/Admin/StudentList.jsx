import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getStudents, getTeachers, getAnalytics, toggleBlockStudent, createUser, deleteUser, assignStudentToTeacher } from '../../services/api';
import { HiSearch, HiEye, HiBan, HiCheckCircle, HiTrash, HiPlus, HiUserAdd, HiUsers, HiUserGroup, HiAcademicCap, HiShieldCheck, HiPencil, HiCollection, HiX } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const StudentList = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('students');
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('');
    const [teacherFilter, setTeacherFilter] = useState(() => searchParams.get('teacher') || '');

    // Modals state
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedTeacherId, setSelectedTeacherId] = useState('');

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            if (deptFilter) params.department = deptFilter;
            
            const [studentsRes, teachersRes, analyticsRes] = await Promise.allSettled([
                getStudents(params),
                getTeachers(),
                getAnalytics()
            ]);

            if (studentsRes.status === 'fulfilled') setStudents(studentsRes.value.data);
            if (teachersRes.status === 'fulfilled') setTeachers(teachersRes.value.data);
            if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value.data);
            else setAnalytics(null);
        } catch (err) { 
            console.error(err); 
            toast.error('Failed to load data');
            setAnalytics(null);
        }
        setLoading(false);
    };

    const handleToggleBlock = async (id) => {
        try {
            const res = await toggleBlockStudent(id);
            setStudents(students.map(s =>
                s._id === id ? { ...s, isActive: res.data.isActive } : s
            ));
            toast.success(res.data.isActive ? 'Student activated' : 'Student blocked');
        } catch (err) { console.error(err); }
    };

    const handleDeleteUser = async (id, role) => {
        if (!window.confirm(`Are you sure you want to delete this ${role}?`)) return;
        try {
            await deleteUser(id);
            if (role === 'student') {
                setStudents(students.filter(s => s._id !== id));
            } else {
                setTeachers(teachers.filter(t => t._id !== id));
            }
            toast.success(`${role} deleted successfully`);
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete user');
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await createUser(formData);
            toast.success(`${formData.role} created successfully`);
            setShowAddModal(false);
            setFormData({ name: '', email: '', password: '', role: 'student' });
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to create user');
        }
    };

    const handleAssignTeacher = async (e) => {
        e.preventDefault();
        try {
            await assignStudentToTeacher(selectedStudent._id, selectedTeacherId);
            toast.success('Assignment updated successfully');
            setShowAssignModal(false);
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to assign student');
        }
    };

    const renderStudents = () => (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="text-left border-b border-gray-100 dark:border-dark-border">
                        <th className="pb-4 font-bold text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-widest pl-2">Student</th>
                        <th className="pb-4 font-bold text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-widest">Academic Details</th>
                        <th className="pb-4 font-bold text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-widest">Assigned Mentor</th>
                        <th className="pb-4 font-bold text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-widest text-right pr-2">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                    {students.filter(student => !teacherFilter || student.profile?.teacherId?.toString() === teacherFilter.toString()).map((student) => (
                        <tr key={student._id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                            <td className="py-5 pl-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold border-2 border-white dark:border-gray-800 shadow-sm">
                                        {student.name?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-tight">{student.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{student.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-gray-900 dark:text-white uppercase">{student.profile?.department || 'N/A'}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-600 dark:text-gray-400">YR: {student.profile?.year || 'N/A'}</span>
                                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/20 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">CGPA: {student.profile?.cgpa || 'N/A'}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="flex items-center gap-2">
                                    {student.profile?.teacherId ? (
                                        <div className="flex items-center gap-2 py-1 px-3 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50">
                                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white">
                                                <HiUserGroup className="w-3 h-3" />
                                            </div>
                                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-tighter">
                                                {teachers.find(t => t._id.toString() === student.profile?.teacherId?.toString())?.name || 'Assigned'}
                                            </span>
                                            <button 
                                                onClick={() => { setSelectedStudent(student); setSelectedTeacherId(student.profile.teacherId); setShowAssignModal(true); }}
                                                className="ml-1 text-emerald-400 hover:text-emerald-600 transition-colors"
                                            >
                                                <HiPencil className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => { setSelectedStudent(student); setSelectedTeacherId(''); setShowAssignModal(true); }}
                                            className="flex items-center gap-1 py-1 px-3 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50 hover:bg-amber-100 transition-all shadow-sm"
                                        >
                                            <HiUserAdd className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase">Allot Teacher</span>
                                        </button>
                                    )}
                                </div>
                            </td>
                            <td className="py-5 pr-2 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => navigate(`/admin/students/${student._id}`)}
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                                        title="View Portfolio"
                                    >
                                        <HiEye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleToggleBlock(student._id)}
                                        className={`p-2 rounded-lg transition-colors ${student.isActive ? 'text-emerald-500 hover:bg-emerald-50' : 'text-red-500 hover:bg-red-50'}`}
                                        title={student.isActive ? 'Active' : 'Blocked'}
                                    >
                                        <HiShieldCheck className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(student._id, 'student')}
                                        className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                                        title="Delete Student"
                                    >
                                        <HiTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderTeachers = () => (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="text-left border-b border-gray-100 dark:border-dark-border">
                        <th className="pb-4 font-bold text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-widest pl-2">Teacher Name</th>
                        <th className="pb-4 font-bold text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-widest">Email Address</th>
                        <th className="pb-4 font-bold text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-widest">Assigned Students</th>
                        <th className="pb-4 font-bold text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-widest text-right pr-2">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                    {teachers.map((teacher) => (
                        <tr key={teacher._id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                            <td className="py-5 pl-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 font-bold border-2 border-white dark:border-gray-800 shadow-sm">
                                        {teacher.name?.[0]?.toUpperCase()}
                                    </div>
                                    <p className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-tight">{teacher.name}</p>
                                </div>
                            </td>
                            <td className="py-5">
                                <p className="text-sm text-gray-500 dark:text-gray-400">{teacher.email}</p>
                            </td>
                            <td className="py-5">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${teacher.studentCount > 0 ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {teacher.studentCount || 0} STUDENTS
                                    </span>
                                </div>
                            </td>
                            <td className="py-5 pr-2 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setTeacherFilter(teacher._id);
                                            setActiveTab('students');
                                        }}
                                        className="py-1 px-3 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors flex items-center gap-1 border border-transparent hover:border-emerald-200 dark:hover:bg-emerald-900/20 dark:hover:border-emerald-900/50"
                                        title="View Students"
                                    >
                                        <HiEye className="w-4 h-4" /> <span className="text-[10px] font-bold">VIEW STUDENTS</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(teacher._id, 'teacher')}
                                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                                        title="Remove Teacher"
                                    >
                                        <HiTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">User Management</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">Administrative control panel for students and faculty</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card-hover p-6 bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/10 dark:to-dark-card border-l-4 border-l-primary-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl text-primary-600">
                            <HiUsers className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Students</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{students.length}</h3>
                        </div>
                    </div>
                </div>

                <div className="card-hover p-6 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/10 dark:to-dark-card border-l-4 border-l-emerald-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600">
                            <HiUserGroup className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Teachers</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{teachers.length}</h3>
                        </div>
                    </div>
                </div>

                <div className="card-hover p-6 bg-gradient-to-br from-violet-50 to-white dark:from-violet-900/10 dark:to-dark-card border-l-4 border-l-violet-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-xl text-violet-600">
                            <HiCollection className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Projects</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{analytics?.totalProjects || 0}</h3>
                        </div>
                    </div>
                </div>

                <div className="card-hover p-6 bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/10 dark:to-dark-card border-l-4 border-l-amber-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600">
                            <HiAcademicCap className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Certifications</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{analytics?.totalCertifications || 0}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="card p-0 overflow-hidden border-none shadow-xl">
                {/* Tabs Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4 bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-dark-border">
                    <div className="flex bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border w-fit">
                        <button
                            onClick={() => setActiveTab('students')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'students' ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                        >
                            STUDENTS
                        </button>
                        <button
                            onClick={() => setActiveTab('teachers')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'teachers' ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                        >
                            TEACHERS
                        </button>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {activeTab === 'students' && (
                            <div className="flex items-center gap-2 flex-wrap">
                                {teacherFilter && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50">
                                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                            Mentor: {teachers.find(t => t._id === teacherFilter)?.name || 'Unknown'}
                                        </span>
                                        <button onClick={() => setTeacherFilter('')} className="text-emerald-500 hover:text-emerald-700 flex items-center">
                                            <HiX className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                                <div className="relative">
                                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search student..."
                                        className="input-field pl-10 w-56"
                                    />
                                </div>
                                <input
                                    value={deptFilter}
                                    onChange={(e) => setDeptFilter(e.target.value)}
                                    placeholder="Department filter..."
                                    className="input-field w-48"
                                />
                                <button
                                    onClick={fetchData}
                                    className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-primary-600 border border-primary-200 dark:border-primary-900/50 text-xs font-bold hover:bg-primary-50 transition-all flex items-center gap-2 shadow-sm"
                                >
                                    Apply
                                </button>
                                <button
                                    onClick={() => {
                                        setSearch('');
                                        setDeptFilter('');
                                        setTeacherFilter('');
                                        setTimeout(() => fetchData(), 0);
                                    }}
                                    className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                                >
                                    Clear
                                </button>
                            </div>
                        )}

                        {activeTab === 'students' && (
                            <button
                                onClick={() => { setFormData({ name: '', email: '', password: '', role: 'student' }); setShowAddModal(true); }}
                                className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-primary-600 border border-primary-200 dark:border-primary-900/50 text-xs font-bold hover:bg-primary-50 transition-all flex items-center gap-2 shadow-sm"
                            >
                                <HiPlus className="w-4 h-4" /> ADD STUDENT
                            </button>
                        )}

                        {activeTab === 'teachers' && (
                            <button
                                onClick={() => { setFormData({ name: '', email: '', password: '', role: 'teacher' }); setShowAddModal(true); }}
                                className="px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 transition-all flex items-center gap-2 shadow-lg shadow-primary-200"
                            >
                                <HiPlus className="w-4 h-4" /> ADD TEACHER
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === 'students' ? renderStudents() : renderTeachers()}
                </div>
            </div>

            {/* Modals */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-md p-8 shadow-2xl scale-in">
                        <h2 className="text-2xl font-black mb-6 text-gray-900 dark:text-white uppercase tracking-tight">Add New {formData.role}</h2>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="label uppercase text-[10px] font-bold tracking-widest text-gray-400">FullName</label>
                                <input type="text" className="input-field" required
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="label uppercase text-[10px] font-bold tracking-widest text-gray-400">Email Address</label>
                                <input type="email" className="input-field" required
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="label uppercase text-[10px] font-bold tracking-widest text-gray-400">Password</label>
                                <input type="password" className="input-field" required minLength={6}
                                    value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1 py-3 text-xs font-bold">CANCEL</button>
                                <button type="submit" className="btn-primary flex-1 py-3 text-xs font-bold shadow-lg shadow-primary-200">CREATE {formData.role.toUpperCase()}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showAssignModal && selectedStudent && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-md p-8 shadow-2xl">
                        <h2 className="text-2xl font-black mb-2 text-gray-900 dark:text-white uppercase tracking-tight">Allot Mentor</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-medium">Assign a faculty mentor to <span className="text-primary-600 font-bold">{selectedStudent.name}</span></p>
                        <form onSubmit={handleAssignTeacher} className="space-y-4">
                            <div>
                                <label className="label uppercase text-[10px] font-bold tracking-widest text-gray-400">Select Faculty</label>
                                <select className="input-field bg-gray-50 dark:bg-gray-800" value={selectedTeacherId} onChange={e => setSelectedTeacherId(e.target.value)}>
                                    <option value="">-- No Mentor Assigned --</option>
                                    {teachers.map(t => (
                                        <option key={t._id} value={t._id}>{t.name} ({t.email})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowAssignModal(false)} className="btn-secondary flex-1 py-3 text-xs font-bold">CANCEL</button>
                                <button type="submit" className="btn-primary flex-1 py-3 text-xs font-bold shadow-lg shadow-primary-200">CONFIRM ALLOTMENT</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentList;
