import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to add the auth token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const registerStudent = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');

// Student Profile
export const getProfile = () => api.get('/student/profile');
export const updateProfile = (data) => api.put('/student/profile', data);
export const getStudentProfile = getProfile; // Alias
export const updateStudentProfile = updateProfile; // Alias

// Student Projects
export const getProjects = () => api.get('/student/projects');
export const addProject = (data) => api.post('/student/projects', data);
export const updateProject = (id, data) => api.put(`/student/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/student/projects/${id}`);
export const getStudentProjects = getProjects; // Alias
export const addStudentProject = addProject; // Alias
export const updateStudentProject = updateProject; // Alias
export const deleteStudentProject = deleteProject; // Alias

// Student Skills
export const getSkills = () => api.get('/student/skills');
export const addSkill = (data) => api.post('/student/skills', data);
export const updateSkill = (id, data) => api.put(`/student/skills/${id}`, data);
export const deleteSkill = (id) => api.delete(`/student/skills/${id}`);
export const getStudentSkills = getSkills; // Alias
export const addStudentSkill = addSkill; // Alias
export const updateStudentSkill = updateSkill; // Alias
export const deleteStudentSkill = deleteSkill; // Alias

// Student Certifications
export const getCertifications = () => api.get('/student/certifications');
export const addCertification = (data) => api.post('/student/certifications', data);
export const deleteCertification = (id) => api.delete(`/student/certifications/${id}`);
export const getStudentCertifications = getCertifications; // Alias
export const addStudentCertification = addCertification; // Alias
export const deleteStudentCertification = deleteCertification; // Alias

// Student Resume
export const getResumeData = () => api.get('/student/resume');

// Admin
export const getStudents = (params) => api.get('/admin/students', { params });
export const getStudentDetail = (id) => api.get(`/admin/students/${id}`);
export const toggleBlockStudent = (id) => api.put(`/admin/students/${id}/block`);
export const adminDeleteProject = (id) => api.delete(`/admin/projects/${id}`);
export const getAnalytics = () => api.get('/admin/analytics');

export default api;
