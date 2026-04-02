import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudentDetail, toggleBlockStudent, adminDeleteProject } from '../../services/api';
import { HiArrowLeft, HiBan, HiCheckCircle, HiTrash, HiExternalLink, HiMail, HiPhone, HiAcademicCap } from 'react-icons/hi';

const StudentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const res = await getStudentDetail(id);
                setData(res.data);
            } catch (err) {
                console.error(err);
                navigate('/admin/students');
            }
            setLoading(false);
        };
        fetchStudent();
    }, [id]);

    const handleToggleBlock = async () => {
        try {
            const res = await toggleBlockStudent(id);
            setData(prev => ({ ...prev, user: { ...prev.user, isActive: res.data.isActive } }));
        } catch (err) { console.error(err); }
    };

    const handleDeleteProject = async (projectId) => {
        if (!window.confirm('Delete this project?')) return;
        try {
            await adminDeleteProject(projectId);
            setData(prev => ({
                ...prev,
                projects: prev.projects.filter(p => p._id !== projectId)
            }));
        } catch (err) { console.error(err); }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!data) return null;
    const { user, profile, projects, certifications } = data;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/admin/students')}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <HiArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                </div>
                <button onClick={handleToggleBlock}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${user?.isActive
                            ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400'
                        }`}>
                    {user?.isActive ? <><HiBan className="w-5 h-5" /> Block Student</> : <><HiCheckCircle className="w-5 h-5" /> Activate Student</>}
                </button>
            </div>

            {/* Profile Info */}
            <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    {profile?.department && (
                        <div><span className="text-gray-500 dark:text-gray-400">Department</span><p className="font-medium text-gray-900 dark:text-white">{profile.department}</p></div>
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
                    <div>
                        <span className="text-gray-500 dark:text-gray-400">Assigned Mentor</span>
                        <p className="font-bold text-primary-600 dark:text-primary-400 uppercase text-xs">
                            {data.user.profile?.teacherId ? 'Assigned' : 'Unassigned'}
                        </p>
                    </div>
                    <div><span className="text-gray-500 dark:text-gray-400">Status</span><p><span className={user.isActive ? 'badge-success' : 'badge-danger'}>{user.isActive ? 'Active' : 'Blocked'}</span></p></div>
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
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No projects</p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {projects?.map((project) => (
                            <div key={project._id} className="p-4 rounded-xl border border-gray-100 dark:border-dark-border relative">
                                <div className="absolute top-4 right-12">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                        project.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                        project.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-amber-100 text-amber-700'
                                    }`}>
                                        {project.status || 'pending'}
                                    </span>
                                </div>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{project.title}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{project.description}</p>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {project.technologies?.map((tech, i) => (
                                                <span key={i} className="badge-primary text-xs">{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 ml-2">
                                        {project.githubLink && (
                                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                                                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-primary-600 transition-colors">
                                                <HiExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                        <button onClick={() => handleDeleteProject(project._id)}
                                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                                            title="Delete project">
                                            <HiTrash className="w-4 h-4" />
                                        </button>
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
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No certifications</p>
                ) : (
                    <div className="space-y-3">
                        {certifications?.map((cert) => (
                            <div key={cert._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                <div className="flex items-center gap-3">
                                    <HiAcademicCap className="w-5 h-5 text-emerald-500" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-sm text-gray-900 dark:text-white uppercase">{cert.courseName}</p>
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
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                    cert.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                    cert.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                    'bg-amber-100 text-amber-700'
                                }`}>
                                    {cert.status || 'pending'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDetail;
