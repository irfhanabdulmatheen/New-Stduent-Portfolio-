import { useState, useEffect, useRef } from 'react';
import { getResumeData } from '../../services/api';
import { HiDownload, HiMail, HiPhone, HiAcademicCap, HiExternalLink } from 'react-icons/hi';

const Resume = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const resumeRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getResumeData();
                setData(res.data);
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleDownload = async () => {
        const element = resumeRef.current;
        if (!element) return;

        try {
            const html2pdf = (await import('html2pdf.js')).default;
            const opt = {
                margin: 0.5,
                filename: `${data?.user?.name || 'resume'}_resume.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(element).save();
        } catch (err) {
            console.error('PDF generation error:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!data) return <div className="card text-center py-8 text-gray-500">Failed to load resume data</div>;

    const { user, profile, projects, skills, certifications } = data;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Preview</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Preview and download your resume</p>
                </div>
                <button onClick={handleDownload} className="btn-primary flex items-center gap-2">
                    <HiDownload className="w-5 h-5" /> Download PDF
                </button>
            </div>

            {/* Resume Document */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-3xl mx-auto" ref={resumeRef}>
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-violet-700 p-8 text-white">
                    <h1 className="text-3xl font-bold mb-1">{user?.name || 'Your Name'}</h1>
                    <p className="text-primary-100 text-lg mb-4">{profile?.department || 'Department'} {profile?.year ? `• ${profile.year}` : ''}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                        {user?.email && (
                            <span className="flex items-center gap-1.5"><HiMail className="w-4 h-4" /> {user.email}</span>
                        )}
                        {profile?.phone && (
                            <span className="flex items-center gap-1.5"><HiPhone className="w-4 h-4" /> {profile.phone}</span>
                        )}
                        {profile?.cgpa && (
                            <span className="flex items-center gap-1.5"><HiAcademicCap className="w-4 h-4" /> CGPA: {profile.cgpa}</span>
                        )}
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Bio */}
                    {profile?.bio && (
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-primary-500 pb-1 mb-3">About Me</h2>
                            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                        </section>
                    )}

                    {/* Skills */}
                    {skills?.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-primary-500 pb-1 mb-3">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <span key={skill._id} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                                        {skill.skillName} <span className="text-gray-400">• {skill.level}</span>
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {projects?.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-primary-500 pb-1 mb-3">Projects</h2>
                            <div className="space-y-4">
                                {projects.map((project) => (
                                    <div key={project._id}>
                                        <div className="flex items-start justify-between">
                                            <h3 className="font-semibold text-gray-900">{project.title}</h3>
                                            {project.githubLink && (
                                                <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                                                    className="text-primary-600 text-sm flex items-center gap-1">
                                                    <HiExternalLink className="w-3.5 h-3.5" /> GitHub
                                                </a>
                                            )}
                                        </div>
                                        <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                                        {project.technologies?.length > 0 && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                <span className="font-medium">Tech:</span> {project.technologies.join(', ')}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Certifications */}
                    {certifications?.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-gray-900 border-b-2 border-primary-500 pb-1 mb-3">Certifications</h2>
                            <div className="space-y-2">
                                {certifications.map((cert) => (
                                    <div key={cert._id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">{cert.courseName}</p>
                                            <p className="text-sm text-gray-500">{cert.issuedBy}</p>
                                        </div>
                                        {cert.completionDate && (
                                            <span className="text-xs text-gray-400">{new Date(cert.completionDate).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Resume;
