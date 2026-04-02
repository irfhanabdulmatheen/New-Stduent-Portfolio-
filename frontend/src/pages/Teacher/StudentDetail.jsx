import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssignedStudentDetail, teacherUpdateProjectStatus, teacherUpdateCertStatus } from '../../services/api';
import { HiArrowLeft, HiExternalLink, HiPhone, HiAcademicCap, HiCheck, HiX } from 'react-icons/hi';
import { toast } from 'react-toastify';

const TeacherStudentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const res = await getAssignedStudentDetail(id);
                setData(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load student details. You might not have access.');
            }
            setLoading(false);
        };
        fetchStudent();
    }, [id]);

    const handleStatusUpdate = async (itemId, type, newStatus) => {
        setProcessingId(itemId);
        try {
            if (type === 'project') {
                await teacherUpdateProjectStatus(itemId, newStatus);
                setData(prev => ({
                    ...prev,
                    projects: prev.projects.map(p => p._id === itemId ? { ...p, status: newStatus } : p)
                }));
            } else {
                await teacherUpdateCertStatus(itemId, newStatus);
                setData(prev => ({
                    ...prev,
                    certifications: prev.certifications.map(c => c._id === itemId ? { ...c, status: newStatus } : c)
                }));
            }
            toast.success(`Item ${newStatus} successfully`);
        } catch (err) {
            console.error(err);
            toast.error('Failed to update status');
        }
        setProcessingId(null);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">Approved</span>;
            case 'rejected': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-wider">Rejected</span>;
            default: return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">Pending</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <p className="text-red-500 mb-4">{error}</p>
                <button onClick={() => navigate('/teacher')} className="btn-primary">
                    Go Back
                </button>
            </div>
        );
    }

    if (!data) return null;
    const { user, profile, projects, certifications } = data;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/teacher')}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <HiArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">{user?.name}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                </div>
            </div>

            {/* Profile Info */}
            <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    {profile?.department && (
                        <div><span className="text-gray-500 dark:text-gray-400">Department</span><p className="font-medium text-gray-900 dark:text-white uppercase">{profile.department}</p></div>
                    )}
                    {profile?.year && (
                        <div><span className="text-gray-500 dark:text-gray-400">Year</span><p className="font-medium text-gray-900 dark:text-white">{profile.year}</p></div>
                    )}
                    {profile?.cgpa && (
                        <div><span className="text-gray-500 dark:text-gray-400">CGPA</span><p className="font-medium text-gray-900 dark:text-white">{profile.cgpa}</p></div>
                    )}
                    {profile?.phone && (
                        <div><span className="text-gray-500 dark:text-gray-400">Phone</span><p className="font-medium text-gray-900 dark:text-white flex items-center gap-1"><HiPhone className="w-4 h-4" />{profile.phone}</p></div>
                    )}
                    <div><span className="text-gray-500 dark:text-gray-400">Joined</span><p className="font-medium text-gray-900 dark:text-white">{new Date(user.createdAt).toLocaleDateString()}</p></div>
                </div>
                {profile?.bio && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border">
                        <span className="text-gray-500 dark:text-gray-400 text-sm">Bio</span>
                        <p className="text-gray-900 dark:text-white mt-1">{profile.bio}</p>
                    </div>
                )}
            </div>

            {/* Projects */}
            <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Projects ({projects?.length || 0})</h2>
                {projects?.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">No projects added by student.</p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {projects?.map((project) => (
                            <div key={project._id} className="p-4 rounded-xl border border-gray-100 dark:border-dark-border group transition-all hover:bg-gray-50/50">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase">{project.title}</h3>
                                            {getStatusBadge(project.status)}
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{project.description}</p>
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {project.technologies?.map((tech, i) => (
                                                <span key={i} className="px-2 py-0.5 rounded bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 text-[10px] font-semibold">{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        {project.githubLink && (
                                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                                                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-800 text-gray-500 hover:text-primary-600 shadow-sm transition-all">
                                                <HiExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                        <div className="flex flex-col gap-1">
                                            <button 
                                                disabled={processingId === project._id}
                                                onClick={() => handleStatusUpdate(project._id, 'project', 'approved')}
                                                className={`p-1.5 rounded-lg transition-all ${project.status === 'approved' ? 'bg-emerald-500 text-white' : 'hover:bg-emerald-50 text-emerald-500'}`}
                                                title="Approve">
                                                <HiCheck className="w-4 h-4" />
                                            </button>
                                            <button 
                                                disabled={processingId === project._id}
                                                onClick={() => handleStatusUpdate(project._id, 'project', 'rejected')}
                                                className={`p-1.5 rounded-lg transition-all ${project.status === 'rejected' ? 'bg-red-500 text-white' : 'hover:bg-red-50 text-red-500'}`}
                                                title="Reject">
                                                <HiX className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            {/* Certifications */}
            <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Certifications ({certifications?.length || 0})</h2>
                {certifications?.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">No certifications added by student.</p>
                ) : (
                    <div className="space-y-3">
                        {certifications?.map((cert) => (
                            <div key={cert._id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-dark-border hover:bg-gray-50/50 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                                        <HiAcademicCap className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-sm text-gray-900 dark:text-white uppercase">{cert.courseName}</p>
                                            {getStatusBadge(cert.status)}
                                            {cert.link && (
                                                <a href={cert.link} target="_blank" rel="noopener noreferrer" 
                                                    className="text-primary-600 hover:text-primary-700 transition-colors"
                                                    title="View Certification Link">
                                                    <HiExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{cert.issuedBy}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        disabled={processingId === cert._id}
                                        onClick={() => handleStatusUpdate(cert._id, 'cert', 'approved')}
                                        className={`p-2 rounded-xl transition-all ${cert.status === 'approved' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'hover:bg-emerald-50 text-emerald-500'}`}
                                        title="Approve">
                                        <HiCheck className="w-5 h-5" />
                                    </button>
                                    <button 
                                        disabled={processingId === cert._id}
                                        onClick={() => handleStatusUpdate(cert._id, 'cert', 'rejected')}
                                        className={`p-2 rounded-xl transition-all ${cert.status === 'rejected' ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'hover:bg-red-50 text-red-500'}`}
                                        title="Reject">
                                        <HiX className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherStudentDetail;
