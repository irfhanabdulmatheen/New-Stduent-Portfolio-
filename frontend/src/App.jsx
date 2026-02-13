import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Public Pages
import Landing from './pages/Landing';
import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/StudentRegister';
import AdminLogin from './pages/AdminLogin';

// Student Pages
import StudentDashboard from './pages/Student/Dashboard';
import StudentProfile from './pages/Student/Profile';
import StudentProjects from './pages/Student/Projects';
import StudentSkills from './pages/Student/Skills';
import StudentCertifications from './pages/Student/Certifications';
import StudentResume from './pages/Student/Resume';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import AdminStudentList from './pages/Admin/StudentList';
import AdminStudentDetail from './pages/Admin/StudentDetail';
import AdminAnalytics from './pages/Admin/Analytics';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<StudentLogin />} />
                    <Route path="/register" element={<StudentRegister />} />
                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* Student Routes */}
                    <Route
                        path="/student"
                        element={
                            <ProtectedRoute role="student">
                                <DashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<StudentDashboard />} />
                        <Route path="profile" element={<StudentProfile />} />
                        <Route path="projects" element={<StudentProjects />} />
                        <Route path="skills" element={<StudentSkills />} />
                        <Route path="certifications" element={<StudentCertifications />} />
                        <Route path="resume" element={<StudentResume />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute role="admin">
                                <DashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<AdminDashboard />} />
                        <Route path="students" element={<AdminStudentList />} />
                        <Route path="students/:id" element={<AdminStudentDetail />} />
                        <Route path="analytics" element={<AdminAnalytics />} />
                    </Route>

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop theme="colored" />
        </AuthProvider>
    );
}

export default App;
