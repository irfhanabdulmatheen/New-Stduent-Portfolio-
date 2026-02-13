import { useState, useEffect } from 'react';
import { getCertifications, addCertification, deleteCertification } from '../../services/api';
import { HiPlus, HiTrash, HiX, HiAcademicCap, HiDownload } from 'react-icons/hi';

const Certifications = () => {
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ courseName: '', issuedBy: '', completionDate: '' });
    const [file, setFile] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchCerts(); }, []);

    const fetchCerts = async () => {
        try {
            const res = await getCertifications();
            setCerts(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('courseName', form.courseName);
            formData.append('issuedBy', form.issuedBy);
            formData.append('completionDate', form.completionDate);
            if (file) formData.append('certificateFile', file);

            await addCertification(formData);
            setShowModal(false);
            setForm({ courseName: '', issuedBy: '', completionDate: '' });
            setFile(null);
            fetchCerts();
        } catch (err) { console.error(err); }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this certification?')) return;
        try {
            await deleteCertification(id);
            setCerts(certs.filter(c => c._id !== id));
        } catch (err) { console.error(err); }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Certifications</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{certs.length} certification{certs.length !== 1 ? 's' : ''}</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
                    <HiPlus className="w-5 h-5" /> Add Certification
                </button>
            </div>

            {certs.length === 0 ? (
                <div className="card text-center py-16">
                    <HiAcademicCap className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No certifications</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Upload your certifications to showcase your achievements</p>
                    <button onClick={() => setShowModal(true)} className="btn-primary inline-flex items-center gap-2">
                        <HiPlus className="w-5 h-5" /> Add Certification
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {certs.map((cert) => (
                        <div key={cert._id} className="card-hover">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                                        <HiAcademicCap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{cert.courseName}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{cert.issuedBy}</p>
                                        {cert.completionDate && (
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                Completed: {new Date(cert.completionDate).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {cert.certificateFile && (
                                        <a href={cert.certificateFile} target="_blank" rel="noopener noreferrer"
                                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-primary-600 transition-colors">
                                            <HiDownload className="w-4 h-4" />
                                        </a>
                                    )}
                                    <button onClick={() => handleDelete(cert._id)}
                                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
                                        <HiTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-dark-border">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add Certification</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <HiX className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="label">Course Name *</label>
                                <input type="text" className="input-field" placeholder="e.g., AWS Cloud Practitioner" value={form.courseName}
                                    onChange={(e) => setForm({ ...form, courseName: e.target.value })} required />
                            </div>
                            <div>
                                <label className="label">Issued By</label>
                                <input type="text" className="input-field" placeholder="e.g., Amazon Web Services" value={form.issuedBy}
                                    onChange={(e) => setForm({ ...form, issuedBy: e.target.value })} />
                            </div>
                            <div>
                                <label className="label">Completion Date</label>
                                <input type="date" className="input-field" value={form.completionDate}
                                    onChange={(e) => setForm({ ...form, completionDate: e.target.value })} />
                            </div>
                            <div>
                                <label className="label">Certificate File (PDF/Image)</label>
                                <input type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files[0])}
                                    className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                             file:bg-primary-50 file:text-primary-700 file:font-medium file:cursor-pointer
                             dark:file:bg-primary-900/30 dark:file:text-primary-300" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
                                    {saving ? 'Saving...' : 'Add Certification'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certifications;
