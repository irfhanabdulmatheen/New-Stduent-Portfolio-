import { useState, useEffect } from 'react';
import { getSkills, addSkill, updateSkill, deleteSkill } from '../../services/api';
import { HiPlus, HiPencil, HiTrash, HiX, HiLightningBolt } from 'react-icons/hi';

const levelPercent = { 'Beginner': 33, 'Intermediate': 66, 'Advanced': 100 };
const levelColor = {
    'Beginner': 'bg-amber-500',
    'Intermediate': 'bg-blue-500',
    'Advanced': 'bg-emerald-500'
};

const Skills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ skillName: '', level: 'Beginner', experience: 0 });
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchSkills(); }, []);

    const fetchSkills = async () => {
        try {
            const res = await getSkills();
            setSkills(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const openAdd = () => {
        setForm({ skillName: '', level: 'Beginner', experience: 0 });
        setEditingId(null);
        setShowModal(true);
    };

    const openEdit = (skill) => {
        setForm({ skillName: skill.skillName, level: skill.level, experience: skill.experience });
        setEditingId(skill._id);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingId) {
                await updateSkill(editingId, form);
            } else {
                await addSkill(form);
            }
            setShowModal(false);
            fetchSkills();
        } catch (err) { console.error(err); }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this skill?')) return;
        try {
            await deleteSkill(id);
            setSkills(skills.filter(s => s._id !== id));
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Skills</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{skills.length} skill{skills.length !== 1 ? 's' : ''}</p>
                </div>
                <button onClick={openAdd} className="btn-primary flex items-center gap-2">
                    <HiPlus className="w-5 h-5" /> Add Skill
                </button>
            </div>

            {skills.length === 0 ? (
                <div className="card text-center py-16">
                    <HiLightningBolt className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No skills added</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Add your technical skills to showcase your expertise</p>
                    <button onClick={openAdd} className="btn-primary inline-flex items-center gap-2">
                        <HiPlus className="w-5 h-5" /> Add Your First Skill
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {skills.map((skill) => (
                        <div key={skill._id} className="card-hover">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                                        <HiLightningBolt className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{skill.skillName}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {skill.experience} year{skill.experience !== 1 ? 's' : ''} experience
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`badge ${skill.level === 'Advanced' ? 'badge-success' :
                                            skill.level === 'Intermediate' ? 'badge-primary' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                        }`}>{skill.level}</span>
                                    <button onClick={() => openEdit(skill)}
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                                        <HiPencil className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(skill._id)}
                                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
                                        <HiTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ease-out ${levelColor[skill.level]}`}
                                    style={{ width: `${levelPercent[skill.level]}%` }}
                                ></div>
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
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {editingId ? 'Edit Skill' : 'Add Skill'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <HiX className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="label">Skill Name *</label>
                                <input type="text" className="input-field" placeholder="e.g., React.js" value={form.skillName}
                                    onChange={(e) => setForm({ ...form, skillName: e.target.value })} required />
                            </div>
                            <div>
                                <label className="label">Proficiency Level</label>
                                <select className="input-field" value={form.level}
                                    onChange={(e) => setForm({ ...form, level: e.target.value })}>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <div>
                                <label className="label">Experience (years)</label>
                                <input type="number" className="input-field" min="0" step="0.5" value={form.experience}
                                    onChange={(e) => setForm({ ...form, experience: parseFloat(e.target.value) || 0 })} />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
                                    {saving ? 'Saving...' : editingId ? 'Update' : 'Add Skill'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Skills;
