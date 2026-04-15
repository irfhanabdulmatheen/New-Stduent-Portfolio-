import axios from 'axios';

export const API_ORIGIN = import.meta.env.VITE_API_URL || 'https://new-stduent-portfolio.onrender.com';
export const API_BASE_URL = `${API_ORIGIN}/api`;

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
});

export const getApiErrorMessage = (error, fallback = 'Request failed') => {
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }

    if (Array.isArray(error?.response?.data?.errors) && error.response.data.errors.length > 0) {
        return error.response.data.errors[0]?.msg || fallback;
    }

    if (error?.code === 'ECONNABORTED') {
        return 'The server took too long to respond. Please try again.';
    }

    if (error?.request && !error?.response) {
        return `Cannot reach the backend at ${API_ORIGIN}. Check the deployed backend URL and CORS settings.`;
    }

    return fallback;
};

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
export const googleLogin = (idToken) => api.post('/auth/google-login', { idToken });
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


// Student Certifications
export const getCertifications = () => api.get('/student/certifications');
export const addCertification = (data) => api.post('/student/certifications', data);
export const deleteCertification = (id) => api.delete(`/student/certifications/${id}`);
export const getStudentCertifications = getCertifications; // Alias
export const addStudentCertification = addCertification; // Alias
export const deleteStudentCertification = deleteCertification; // Alias

// Student Placements
export const getPlacements = () => api.get('/student/placements');
export const addPlacement = (data) => api.post('/student/placements', data);
export const deletePlacement = (id) => api.delete(`/student/placements/${id}`);
export const getStudentPlacements = getPlacements; // Alias
export const addStudentPlacement = addPlacement; // Alias
export const deleteStudentPlacement = deletePlacement; // Alias

// Admin
export const getStudents = (params) => api.get('/admin/students', { params });
export const getTeachers = () => api.get('/admin/teachers');
export const getTeacherStudents = (teacherId) => api.get(`/admin/teachers/${teacherId}/students`);
export const createUser = (data) => api.post('/admin/users', data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const assignStudentToTeacher = (studentId, teacherId) => api.put(`/admin/students/${studentId}/assign`, { teacherId });
export const getStudentDetail = (id) => api.get(`/admin/students/${id}`);
export const toggleBlockStudent = (id) => api.put(`/admin/students/${id}/block`);
export const adminDeleteProject = (id) => api.delete(`/admin/projects/${id}`);
export const getAnalytics = () => api.get('/admin/analytics');
export const getPendingProjects = () => api.get('/admin/projects/pending');
export const updateProjectStatus = (id, status) => api.put(`/admin/projects/${id}/status`, { status });
export const getAdminDepartments = () => api.get('/admin/departments');
export const createAdminDepartment = (data) => api.post('/admin/departments', data);

// Teacher
export const getAssignedStudents = (params) => api.get('/teacher/students', { params });
export const getAssignedStudentDetail = (id) => api.get(`/teacher/students/${id}`);
export const teacherUpdateProjectStatus = (id, status) => api.put(`/teacher/projects/${id}/status`, { status });
export const teacherUpdateCertStatus = (id, status) => api.put(`/teacher/certifications/${id}/status`, { status });
export const addTeacherReview = (data) => api.post('/teacher/reviews', data);
export const getTeacherReports = () => api.get('/teacher/reports');

export default api;
