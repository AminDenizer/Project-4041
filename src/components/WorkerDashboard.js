import React, { useState, useEffect, useCallback } from 'react';
// Assuming these are correctly imported from your API service
import { fetchTasks, fetchReportLinks, fetchUsers, fetchSubCategories } from '../api';
// Assuming these are correctly imported from your date utility
import { formatGregorianToJalaliForDisplay, formatGregorianForDisplay } from '../utils/dateUtils';

const WorkerDashboard = ({ userRole, username, timeTableUrl, language }) => { // Removed setError and setLoading from props
    const [tasks, setTasks] = useState([]);
    const [reportLinks, setReportLinks] = useState([]);
    const [users, setUsers] = useState([]); // To map ownerId to username
    const [reportSubCategories, setReportSubCategories] = useState([]); // To get display names
    const [error, setError] = useState(''); // Managed internally if needed for display

    // Helper to get display name for report category
    const reportCategories = [
        { fa: '30 ساعته', en: '30 Hours' },
        { fa: 'گزارش دوهفته', en: 'Twice a week' }
    ];
    const getReportCategoryDisplayName = (categoryEn, lang) => {
        const category = reportCategories.find(c => c.en === categoryEn);
        return category ? category[lang] : categoryEn;
    };

    // Helper to get display name for report sub-category
    const getReportSubCategoryDisplayName = (subCategoryEn, lang) => {
        const subCategory = reportSubCategories.find(sc => sc.en === subCategoryEn);
        return subCategory ? (subCategory[lang] || subCategory.en) : subCategoryEn;
    };

    // Memoize the data loading function to prevent unnecessary re-creations
    const loadWorkerData = useCallback(async () => {
        // Prevent fetching if userRole is not 'worker'
        if (userRole !== 'worker') {
            return;
        }

        setError(''); // Clear any previous error
        try {
            const [allUsers, allTasks, allReportLinks, allSubCategories] = await Promise.all([
                fetchUsers(),
                fetchTasks(),
                fetchReportLinks(),
                fetchSubCategories()
            ]);

            setUsers(allUsers);
            setReportSubCategories(allSubCategories);

            const loggedInUser = allUsers.find(u => u.username === username);
            if (loggedInUser) {
                // Filter tasks for the logged-in worker
                // Assuming ownerId is username for filtering
                const workerTasks = allTasks.filter(task => task.ownerId === loggedInUser.username); 
                setTasks(workerTasks.map(task => ({
                    ...task,
                })));

                // Filter report links for the logged-in worker or 'All'
                const workerReportLinks = allReportLinks.filter(link =>
                    link.ownerId === loggedInUser.username || link.ownerId === 'All'
                );
                setReportLinks(workerReportLinks);
            } else {
                setError(language === 'fa' ? 'اطلاعات کاربر یافت نشد.' : 'User information not found.');
            }
        } catch (e) {
            setError(language === 'fa' ? `خطا در بارگذاری داده‌ها: ${e.message}` : `Failed to load data: ${e.message}`);
            console.error("Error loading worker data:", e);
        }
    }, [username, userRole, language]); // Dependencies for useCallback

    // Effect to trigger data loading
    useEffect(() => {
        // Only call loadWorkerData if userRole is 'worker'
        if (userRole === 'worker') {
            loadWorkerData();
        }
    }, [userRole, loadWorkerData]); // Dependencies for useEffect

    // Render a message if the user does not have worker permissions
    if (userRole !== 'worker') {
        return <p className="text-red-500 font-medium text-center p-4">{language === 'fa' ? 'شما اجازه دسترسی به داشبورد کارگر را ندارید.' : 'You do not have permission to view the worker dashboard.'}</p>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200 font-inter">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                {language === 'fa' ? 'داشبورد کارگر' : 'Worker Dashboard'}
            </h2>
            <div className="text-lg text-gray-700 mb-4 text-center">
                {language === 'fa' ? 'کاربر وارد شده:' : 'Logged in as:'}{' '}
                <span className="font-bold text-blue-600">{username}</span>
            </div>

            {error && ( // Display error message if there is an error
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                    {error}
                </div>
            )}

            {/* My Tasks Section */}
            {/* This section was previously removed but user clarified they meant 'My Time Table' */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
                <h3 className="text-xl font-semibold text-blue-700 mb-4 text-center">
                    {language === 'fa' ? 'تسک‌های من' : 'My Tasks'}
                </h3>
                <div className="overflow-x-auto rounded-lg">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200">
                                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700 rounded-tl-lg">
                                    {language === 'fa' ? 'تسک (فارسی)' : 'Task (Persian)'}
                                </th>
                                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">
                                    {language === 'fa' ? 'تسک (انگلیسی)' : 'Task (English)'}
                                </th>
                                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">
                                    {language === 'fa' ? 'شروع' : 'Start'}
                                </th>
                                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">
                                    {language === 'fa' ? 'پایان' : 'End'}
                                </th>
                                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700 rounded-tr-lg">
                                    {language === 'fa' ? 'وضعیت' : 'Status'}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.length > 0 ? (
                                tasks.map(task => (
                                    <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-800">{task.fa}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{task.en}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">
                                            {/* Using the correct formatting functions based on language */}
                                            {task.startDate ? (language === 'fa' ? formatGregorianToJalaliForDisplay(task.startDate) : formatGregorianForDisplay(task.startDate)) : 'N/A'}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-800">
                                            {task.endDate ? (language === 'fa' ? formatGregorianToJalaliForDisplay(task.endDate) : formatGregorianForDisplay(task.endDate)) : 'N/A'}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-800">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${task.isComplete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {task.isComplete ? (language === 'fa' ? 'انجام شده' : 'Completed') : (language === 'fa' ? 'در حال انجام' : 'In Progress')}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                                        {language === 'fa' ? 'هیچ تسکی برای نمایش وجود ندارد.' : 'No tasks to display.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* My Report Links Section */}
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 shadow-sm">
                <h3 className="text-xl font-semibold text-purple-700 mb-4 text-center">
                    {language === 'fa' ? 'لینک‌های گزارش من' : 'My Report Links'}
                </h3>
                <div className="overflow-x-auto rounded-lg">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200">
                                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700 rounded-tl-lg">
                                    {language === 'fa' ? 'نام گزارش (فارسی)' : 'Report Name (Persian)'}
                                </th>
                                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">
                                    {language === 'fa' ? 'دسته بندی' : 'Category'}
                                </th>
                                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">
                                    {language === 'fa' ? 'زیر دسته' : 'Sub-Category'}
                                </th>
                                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700 rounded-tr-lg">
                                    {language === 'fa' ? 'لینک' : 'Link'}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportLinks.length > 0 ? (
                                reportLinks
                                    .filter(link => link.url)
                                    .map(link => (
                                        <tr key={link.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-800">{language === 'fa' ? link.nameFa : link.nameEn}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">
                                                {getReportCategoryDisplayName(link.reportCategory, language)}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-800">
                                                {getReportSubCategoryDisplayName(link.reportSubCategory, language)}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-blue-600 hover:underline">
                                                <a href={link.url} target="_blank" rel="noopener noreferrer">{language === 'fa' ? 'مشاهده' : 'View'}</a>
                                            </td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-4 px-4 text-center text-gray-500">
                                        {language === 'fa' ? 'هیچ لینک گزارشی برای نمایش وجود ندارد.' : 'No report links to display.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default WorkerDashboard;
