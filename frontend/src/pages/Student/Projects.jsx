import { useState, useEffect } from 'react';
import { getProjects, addProject, updateProject, deleteProject } from '../../services/api';
import { HiPlus, HiPencil, HiTrash, HiExternalLink, HiX, HiPhotograph } from 'react-icons/hi';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ title: '', description: '', technologies: '', githubLink: '' });
    const [image, setImage] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await getProjects();
            setProjects(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const openAdd = () => {
        setForm({ title: '', description: '', technologies: '', githubLink: '' });
        setImage(null);
        setEditingId(null);
        setShowModal(true);
    };

    const openEdit = (project) => {
        setForm({
            title: project.title,
            description: project.description,
            technologies: project.technologies?.join(', ') || '',
            githubLink: project.githubLink || ''
        });
        setImage(null);
        setEditingId(project._id);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('description', form.description);
            formData.append('technologies', form.technologies);
            formData.append('githubLink', form.githubLink);
            if (image) formData.append('image', image);

            if (editingId) {
                await updateProject(editingId, formData);
            } else {
                await addProject(formData);
            }
            setShowModal(false);
            fetchProjects();
        } catch (err) { console.error(err); }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project?')) return;
        try {
            await deleteProject(id);
            setProjects(projects.filter(p => p._id !== id));
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
                </div>
                <button onClick={openAdd} className="btn-primary flex items-center gap-2">
                    <HiPlus className="w-5 h-5" /> Add Project
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="card text-center py-16">
                    <HiPhotograph className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No projects yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Start showcasing your work by adding your first project</p>
                    <button onClick={openAdd} className="btn-primary inline-flex items-center gap-2">
                        <HiPlus className="w-5 h-5" /> Add Your First Project
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project._id} className="card-hover group overflow-hidden p-0">
                            {/* Image */}
                            <div className="h-44 bg-gradient-to-br from-primary-100 to-violet-100 dark:from-primary-900/20 dark:to-violet-900/20 overflow-hidden">
                                {project.image ? (
                                    <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <HiPhotograph className="w-12 h-12 text-primary-300 dark:text-primary-700" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{project.description}</p>

                                {/* Tech Tags */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {project.technologies?.map((tech, i) => (
                                        <span key={i} className="badge-primary text-xs">{tech}</span>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-dark-border">
                                    {project.githubLink && (
                                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                                            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                            <HiExternalLink className="w-4 h-4" /> GitHub
                                        </a>
                                    )}
                                    <div className="flex items-center gap-2 ml-auto">
                                        <button onClick={() => openEdit(project)}
                                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                                            <HiPencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(project._id)}
                                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
                                            <HiTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-dark-border">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {editingId ? 'Edit Project' : 'Add Project'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <HiX className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="label">Title *</label>
                                <input type="text" className="input-field" placeholder="My Awesome Project" value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                            </div>
                            <div>
                                <label className="label">Description</label>
                                <textarea className="input-field h-24 resize-none" placeholder="Describe your project..."
                                    value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                            </div>
                            <div>
                                <label className="label">Technologies (comma-separated)</label>
                                <input type="text" className="input-field" placeholder="React, Node.js, MongoDB"
                                    value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} />
                            </div>
                            <div>
                                <label className="label">GitHub Link</label>
                                <input type="url" className="input-field" placeholder="https://github.com/..."
                                    value={form.githubLink} onChange={(e) => setForm({ ...form, githubLink: e.target.value })} />
                            </div>
                            <div>
                                <label className="label">Project Image</label>
                                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])}
                                    className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                             file:bg-primary-50 file:text-primary-700 file:font-medium file:cursor-pointer
                             dark:file:bg-primary-900/30 dark:file:text-primary-300" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
                                    {saving ? 'Saving...' : editingId ? 'Update' : 'Add Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;
