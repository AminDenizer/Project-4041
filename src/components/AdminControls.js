import React from 'react';

const AdminControls = ({ loggedInUserRole, availableUsers, setViewingUser, viewingUser, language }) => {
    if (loggedInUserRole !== 'admin') return null;
    return (
        <div className="mb-6 flex flex-wrap gap-3 items-center">
            <span className="text-gray-700 font-semibold">
                {language === 'fa' ? 'مشاهده تسک‌های:' : 'View tasks for:'}
            </span>
            {availableUsers.filter(user => user.role !== 'admin').map(user => (
                <button
                    key={user.username}
                    onClick={() => setViewingUser(user.username)}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${viewingUser === user.username ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                >
                    {user.username}
                </button>
            ))}
            <button
                onClick={() => setViewingUser('admin')}
                className={`py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${viewingUser === 'admin' ? 'bg-purple-600 text-white shadow-md' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
            >
                {language === 'fa' ? 'همه' : 'All'}
            </button>
        </div>
    );
};

export default AdminControls;
