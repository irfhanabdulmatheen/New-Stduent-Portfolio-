import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Public Pages
import UnifiedLogin from './pages/UnifiedLogin';
import StudentRegister from './pages/StudentRegister';

// Student Pages
import StudentDashboard from './pages/Student/Dashboard';
import StudentProjects from './pages/Student/Projects';
import StudentSkills from './pages/Student/Skills';
import StudentCertifications from './pages/Student/Certifications';
import StudentPlacements from './pages/Student/Placements';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import AdminStudentList from './pages/Admin/StudentList';
import AdminStudentDetail from './pages/Admin/StudentDetail';
import AdminAnalytics from './pages/Admin/Analytics';

// Teacher Pages
import TeacherDashboard from './pages/Teacher/Dashboard';
import TeacherStudentDetail from './pages/Teacher/StudentDetail';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<UnifiedLogin />} />
                    <Route path="/register" element={<StudentRegister />} />

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
                        <Route path="projects" element={<StudentProjects />} />
                        <Route path="skills" element={<StudentSkills />} />
                        <Route path="certifications" element={<StudentCertifications />} />
                        <Route path="placements" element={<StudentPlacements />} />
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

                    {/* Teacher Routes */}
                    <Route
                        path="/teacher"
                        element={
                            <ProtectedRoute role="teacher">
                                <DashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<TeacherDashboard />} />
                        <Route path="students/:id" element={<TeacherStudentDetail />} />
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
