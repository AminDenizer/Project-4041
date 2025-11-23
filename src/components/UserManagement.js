// components/UserManagement.js
import React, { useState } from 'react';
import { createUser, updateUser, toggleUserActiveStatus } from '../api/index.js';

const UserManagement = ({ users, language, setAppError, setAppLoading, loadAllData, showMessage, handleDeleteConfirmation, isDeleting }) => {
    const [newUsername, setNewUsername] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserRole, setNewUserRole] = useState('worker');
    const [newTimeTableUrl, setNewTimeTableUrl] = useState('');
    const [editingUser, setEditingUser] = useState(null);

    const handleAddUser = async () => {
        if (!newUsername || !newUserPassword || !newUserRole) {
            setAppError(language === 'fa' ? 'لطفاً تمام فیلدهای کاربر را پر کنید.' : 'Please fill all user fields.');
            return;
        }
        if (newUsername === 'admin') {
            setAppError(language === 'fa' ? 'نام کاربری "admin" رزرو شده است و قابل افزودن نیست.' : 'The username "admin" is reserved and cannot be added.');
            return;
        }

        setAppLoading(true);
        setAppError('');
        try {
            await createUser({
                username: newUsername,
                password: newUserPassword,
                role: newUserRole,
                timeTableUrl: newTimeTableUrl
            });
            showMessage(language === 'fa' ? 'کاربر با موفقیت ایجاد شد!' : 'User created successfully!', 'success');
            setNewUsername('');
            setNewUserPassword('');
            setNewUserRole('worker');
            setNewTimeTableUrl('');
            loadAllData();
        } catch (e) {
            setAppError(language === 'fa' ? `خطا در افزودن کاربر: ${e.message}` : `Error adding user: ${e.message}`);
            console.error("Error adding user:", e);
        } finally {
            setAppLoading(false);
        }
    };

    const handleEditUserClick = (user) => {
        setEditingUser({
            ...user,
            password: ''
        });
    };

    const handleUpdateUser = async () => {
        if (!editingUser || !editingUser.username || !editingUser.role) {
            setAppError(language === 'fa' ? 'نام کاربری و نقش الزامی هستند.' : 'Username and role are required.');
            return;
        }
        setAppLoading(true);
        setAppError('');
        try {
            await updateUser({
                userId: editingUser.id,
                username: editingUser.username,
                password: editingUser.password || undefined,
                role: editingUser.role,
                isActive: editingUser.isActive,
                timeTableUrl: editingUser.timeTableUrl || null
            });
            showMessage(language === 'fa' ? 'کاربر با موفقیت به‌روزرسانی شد!' : 'User updated successfully!', 'success');
            setEditingUser(null);
            loadAllData();
        } catch (e) {
            setAppError(language === 'fa' ? `خطا در به‌روزرسانی کاربر: ${e.message}` : `Error updating user: ${e.message}`);
            console.error("Error updating user:", e);
        } finally {
            setAppLoading(false);
        }
    };

    const handleCancelEditUser = () => {
        setEditingUser(null);
    };

    const handleToggleUserActiveStatus = async (userIdToUpdate, newStatus) => {
        setAppLoading(true);
        setAppError('');
        try {
            await toggleUserActiveStatus(userIdToUpdate, newStatus);
            showMessage(language === 'fa' ? 'وضعیت کاربر با موفقیت به‌روزرسانی شد!' : 'User status updated successfully!', 'success');
            loadAllData();
        } catch (e) {
            setAppError(language === 'fa' ? `خطا در به‌روزرسانی وضعیت کاربر: ${e.message}` : `Error updating user status: ${e.message}`);
            console.error("Error toggling user active status:", e);
        } finally {
            setAppLoading(false);
        }
    };

    return (
        <div className="mb-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h2 className="text-xl font-semibold text-yellow-700 mb-4">
                {editingUser ? (language === 'fa' ? 'ویرایش کاربر' : 'Edit User') : (language === 'fa' ? 'مدیریت کاربران داشبورد گانت' : 'Gantt Dashboard User Management')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="userUsername" className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'fa' ? 'نام کاربری:' : 'Username:'}
                    </label>
                    <input
                        type="text"
                        id="userUsername"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                        value={editingUser ? editingUser.username : newUsername}
                        onChange={(e) => editingUser ? setEditingUser({ ...editingUser, username: e.target.value }) : setNewUsername(e.target.value)}
                        disabled={!!editingUser}
                    />
                </div>
                <div>
                    <label htmlFor="userPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'fa' ? 'رمز عبور:' : 'Password:'}
                    </label>
                    <input
                        type="text"
                        id="userPassword"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                        value={editingUser ? editingUser.password : newUserPassword}
                        onChange={(e) => editingUser ? setEditingUser({ ...editingUser, password: e.target.value }) : setNewUserPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="userRole" className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'fa' ? 'نقش:' : 'Role:'}
                    </label>
                    <select
                        id="userRole"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 bg-white"
                        value={editingUser ? editingUser.role : newUserRole}
                        onChange={(e) => editingUser ? setEditingUser({ ...editingUser, role: e.target.value }) : setNewUserRole(e.target.value)}
                    >
                        <option value="admin">admin</option>
                        <option value="worker">worker</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="userTimeTableUrl" className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'fa' ? 'لینک برنامه زمانی:' : 'Time Table URL:'}
                    </label>
                    <input
                        type="url"
                        id="userTimeTableUrl"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder={language === 'fa' ? 'مثال: https://example.com/timetable_amin.pdf' : 'e.g., https://example.com/timetable_amin.pdf'}
                        value={editingUser ? editingUser.timeTableUrl || '' : newTimeTableUrl}
                        onChange={(e) => editingUser ? setEditingUser({ ...editingUser, timeTableUrl: e.target.value }) : setNewTimeTableUrl(e.target.value)}
                    />
                </div>
            </div>
            {editingUser ? (
                <div className="flex gap-2">
                    <button
                        onClick={handleUpdateUser}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                        disabled={!editingUser.username || !editingUser.role}
                    >
                        {language === 'fa' ? 'ذخیره تغییرات کاربر' : 'Save User Changes'}
                    </button>
                    <button
                        onClick={handleCancelEditUser}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                    >
                        {language === 'fa' ? 'لغو' : 'Cancel'}
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleAddUser}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                    disabled={!newUsername || !newUserPassword || !newUserRole}
                >
                    {language === 'fa' ? 'افزودن کاربر' : 'Add User'}
                </button>
            )}

            <h3 className="text-lg font-semibold text-yellow-700 mt-6 mb-3">
                {language === 'fa' ? 'لیست کاربران داشبورد گانت:' : 'Gantt Dashboard User List:'}
            </h3>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="py-3 px-3 text-center text-sm font-semibold text-gray-700">
                                {language === 'fa' ? 'نام کاربری' : 'Username'}
                            </th>
                            <th className="py-3 px-3 text-center text-sm font-semibold text-gray-700">
                                {language === 'fa' ? 'نقش' : 'Role'}
                            </th>
                            <th className="py-3 px-3 text-center text-sm font-semibold text-gray-700">
                                {language === 'fa' ? 'برنامه زمانی' : 'Time Table'}
                            </th>
                            <th className="py-3 px-3 text-center text-sm font-semibold text-gray-700">
                                {language === 'fa' ? 'عملیات' : 'Actions'}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.filter(user => user.username !== 'admin').map(user => (
                            <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-3 text-center text-sm text-gray-800">{user.username}</td>
                                <td className="py-3 px-3 text-center text-sm text-gray-800">{user.role}</td>
                                <td className="py-3 px-3 text-center text-sm text-blue-600 hover:underline">
                                    {user.timeTableUrl ? (
                                        <a href={user.timeTableUrl} target="_blank" rel="noopener noreferrer">
                                            {language === 'fa' ? 'مشاهده' : 'View'}
                                        </a>
                                    ) : (
                                        <span className="text-gray-500">{language === 'fa' ? 'ندارد' : 'N/A'}</span>
                                    )}
                                </td>
                                <td className="py-3 px-3 text-sm">
                                    <div className="flex gap-2 justify-center">
                                        <button
                                            onClick={() => handleEditUserClick(user)}
                                            className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded-md text-xs shadow-sm"
                                        >
                                            {language === 'fa' ? 'ویرایش' : 'Edit'}
                                        </button>
                                        <button
                                            onClick={() => handleToggleUserActiveStatus(user.id, !user.isActive)}
                                            className={`py-1 px-3 rounded-md text-xs shadow-sm ${user.isActive ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                                        >
                                            {user.isActive ? (language === 'fa' ? 'غیرفعال کردن' : 'Deactivate') : (language === 'fa' ? 'فعال کردن' : 'Activate')}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteConfirmation(user.id, 'user', language === 'fa' ? 'آیا از حذف این کاربر اطمینان دارید؟' : 'Are you sure you want to delete this user?')}
                                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-xs shadow-sm"
                                            disabled={isDeleting}
                                        >
                                            {language === 'fa' ? 'حذف' : 'Delete'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
