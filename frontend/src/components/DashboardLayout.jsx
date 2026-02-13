import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
            <Sidebar />
            <main className="lg:ml-64 min-h-screen">
                <div className="p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
