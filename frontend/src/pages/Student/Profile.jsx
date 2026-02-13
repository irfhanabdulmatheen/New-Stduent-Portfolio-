import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { HiCamera, HiCheck } from 'react-icons/hi';

const Profile = () => {
    const { user } = useAuth();
    const [form, setForm] = useState({
        name: '', department: '', year: '', cgpa: '', bio: '', phone: ''
    });
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [currentImage, setCurrentImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getProfile();
                const { profile, user: userData } = res.data;
                setForm({
                    name: userData?.name || '',
                    department: profile?.department || '',
                    year: profile?.year || '',
                    cgpa: profile?.cgpa || '',
                    bio: profile?.bio || '',
                    phone: profile?.phone || ''
                });
                if (profile?.profileImage) setCurrentImage(profile.profileImage);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);
        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => formData.append(key, form[key]));
            if (profileImage) formData.append('profileImage', profileImage);

            const res = await updateProfile(formData);
            if (res.data.profileImage) setCurrentImage(res.data.profileImage);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your personal information</p>
            </div>

            {success && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 
                        text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-2">
                    <HiCheck className="w-5 h-5" /> Profile updated successfully!
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Image */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Photo</h2>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-dark-border">
                                {(imagePreview || currentImage) ? (
                                    <img src={imagePreview || currentImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                                        {user?.name?.[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center 
                                justify-center cursor-pointer hover:bg-primary-700 transition-colors shadow-lg">
                                <HiCamera className="w-4 h-4" />
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Upload a photo</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPG, PNG or GIF. Max 5MB.</p>
                        </div>
                    </div>
                </div>

                {/* Personal Info */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Full Name</label>
                            <input type="text" className="input-field" value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="label">Email</label>
                            <input type="email" className="input-field bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                                value={user?.email || ''} disabled />
                        </div>
                        <div>
                            <label className="label">Phone</label>
                            <input type="tel" className="input-field" placeholder="+91 XXXXX XXXXX" value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                        </div>
                        <div>
                            <label className="label">Department</label>
                            <input type="text" className="input-field" placeholder="Computer Science" value={form.department}
                                onChange={(e) => setForm({ ...form, department: e.target.value })} />
                        </div>
                        <div>
                            <label className="label">Year</label>
                            <select className="input-field" value={form.year}
                                onChange={(e) => setForm({ ...form, year: e.target.value })}>
                                <option value="">Select Year</option>
                                <option value="1st Year">1st Year</option>
                                <option value="2nd Year">2nd Year</option>
                                <option value="3rd Year">3rd Year</option>
                                <option value="4th Year">4th Year</option>
                                <option value="Graduate">Graduate</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">CGPA</label>
                            <input type="text" className="input-field" placeholder="8.5" value={form.cgpa}
                                onChange={(e) => setForm({ ...form, cgpa: e.target.value })} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="label">Bio</label>
                        <textarea className="input-field h-24 resize-none" placeholder="Tell us about yourself..."
                            value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                        {saving ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Saving...
                            </span>
                        ) : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
