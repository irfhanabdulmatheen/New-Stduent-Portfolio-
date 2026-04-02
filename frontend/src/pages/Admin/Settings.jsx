import { useState } from 'react';
import { HiCog } from 'react-icons/hi';

const Settings = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Settings</h1>
            
            <div className="card max-w-2xl">
                <div className="flex items-center gap-4 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                    <HiCog className="w-8 h-8 text-primary-500" />
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">General Settings</h2>
                        <p className="text-sm text-gray-500">Manage your application configuration</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="label">Institution Name</label>
                        <input type="text" className="input-field" defaultValue="Modern University" />
                    </div>
                    <div>
                        <label className="label">Contact Email</label>
                        <input type="email" className="input-field" defaultValue="admin@university.edu" />
                    </div>
                    <div className="pt-4">
                        <button className="btn-primary">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
