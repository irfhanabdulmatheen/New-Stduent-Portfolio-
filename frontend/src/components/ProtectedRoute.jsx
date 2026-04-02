import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading, isAuthenticated } = useAuth();
    const normalizeRole = (r) => (typeof r === 'string' ? r.trim().toLowerCase() : '');

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (role && normalizeRole(user?.role) !== normalizeRole(role)) {
        const currentRole = normalizeRole(user?.role);
        const redirectTo =
            currentRole === 'admin' ? '/admin' :
            currentRole === 'teacher' ? '/teacher' :
            '/student';

        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default ProtectedRoute;
