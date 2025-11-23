import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

import './App.css';

// Import components
import LoginPage from './components/LoginPage';
import AdminPanel from './components/AdminPanel';
import WorkerDashboard from './components/WorkerDashboard';

// Utilities
// Corrected import: Use the actual exported functions from dateUtils.js
import { injectVazirFontCss, convertJalaliStringToGregorianForDisplay } from './utils/dateUtils';
import { fetchUsers, fetchTasks, fetchReportLinks, fetchSubCategories } from './api';

function App() {
    const [language, setLanguage] = useState('fa');
    const [loggedInUserRole, setLoggedInUserRole] = useState(null);
    const [username, setUsername] = useState('');
    const [timeTableUrl, setTimeTableUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [reportLinks, setReportLinks] = useState([]);
    const [reportSubCategories, setReportSubCategories] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        injectVazirFontCss();
    }, []);

    const loadInitialData = useCallback(async () => {
        setLoading(true);
        setError('');
        const startTime = Date.now();

        try {
            const [usersData, tasksData, reportLinksData, subCategoriesData] = await Promise.all([
                fetchUsers(),
                fetchTasks(),
                fetchReportLinks(),
                fetchSubCategories()
            ]);

            setUsers(usersData);
            setReportLinks(reportLinksData);
            setReportSubCategories(subCategoriesData);

            const sortedTasks = tasksData
                .map(task => ({ ...task }))
                .sort((a, b) => {
                    // ✅ تبدیل رشته تاریخ شمسی از دیتابیس به میلادی برای مرتب‌سازی
                    const dateA = new Date(convertJalaliStringToGregorianForDisplay(a.startDate));
                    const dateB = new Date(convertJalaliStringToGregorianForDisplay(b.startDate));
                    return dateA.getTime() - dateB.getTime();
                });

            setTasks(sortedTasks);

        } catch (e) {
            setError(language === 'fa'
                ? `خطا در بارگذاری اولیه داده‌ها: ${e.message}`
                : `Failed to load initial data: ${e.message}`);
            console.error("Error loading initial data:", e);
        } finally {
            const endTime = Date.now();
            const elapsedTime = endTime - startTime;
            const minLoadTime = 500;

            if (elapsedTime < minLoadTime) {
                await new Promise(resolve => setTimeout(resolve, minLoadTime - elapsedTime));
            }

            setLoading(false);
            console.log("loadInitialData: Finished fetching data.");
        }
    }, []); // language intentionally removed

    useEffect(() => {
        const storedRole = localStorage.getItem('userRole');
        const storedUsername = localStorage.getItem('username');
        const storedTimeTableUrl = localStorage.getItem('timeTableUrl');

        if (storedRole && storedUsername) {
            setLoggedInUserRole(storedRole);
            setUsername(storedUsername);
            setTimeTableUrl(storedTimeTableUrl);
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handleLoggedInUserFlow = async () => {
            if (loggedInUserRole) {
                await loadInitialData();

                // ✅ جلوگیری از navigate بی‌دلیل وقتی روی مسیر صحیح هستیم
                if (window.location.pathname !== '/dashboard') {
                    navigate('/dashboard');
                }
            }
        };

        handleLoggedInUserFlow();
    }, [loggedInUserRole, loadInitialData, navigate]);

    const handleLoginSuccess = (role, user, url) => {
        setLoggedInUserRole(role);
        setUsername(user);
        setTimeTableUrl(url);
        localStorage.setItem('userRole', role);
        localStorage.setItem('username', user);
        localStorage.setItem('timeTableUrl', url || '');
    };

    const handleLogout = () => {
        setLoggedInUserRole(null);
        setUsername('');
        setTimeTableUrl(null);
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
        localStorage.removeItem('timeTableUrl');
        navigate('/');
    };

    const toggleLanguage = () => {
        setLanguage(prev => (prev === 'fa' ? 'en' : 'fa'));
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 font-vazirmatn">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                <p className="mt-4 text-gray-700">{language === 'fa' ? 'در حال بارگذاری...' : 'Loading...'}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4 font-vazirmatn text-red-700">
                <h2 className="text-xl font-bold mb-4">{language === 'fa' ? 'خطا!' : 'Error!'}</h2>
                <p>{error}</p>
                <p className="mt-4">{language === 'fa' ? 'لطفاً صفحه را رفرش کنید یا با پشتیبانی تماس بگیرید.' : 'Please refresh the page or contact support.'}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-vazirmatn flex flex-col items-center" dir={language === 'fa' ? 'rtl' : 'ltr'}>
            <header className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {language === 'fa' ? 'داشبورد مدیریتی پروژه' : 'Project Management Dashboard'}
                    </h1>
                    <div className="flex space-x-4 rtl:space-x-reverse">
                        <button
                            onClick={toggleLanguage}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg transition-colors duration-200 shadow-sm"
                        >
                            {language === 'fa' ? 'English' : 'فارسی'}
                        </button>
                        {loggedInUserRole && (
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200 shadow-sm"
                            >
                                {language === 'fa' ? 'خروج' : 'Logout'}
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="w-full max-w-4xl">
                <Routes>
                    <Route path="/" element={
                        loggedInUserRole ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <LoginPage
                                setLoggedIn={handleLoginSuccess}
                                language={language}
                                setError={setError}
                                setLoading={setLoading}
                            />
                        )
                    } />
                    <Route path="/dashboard" element={
                        loggedInUserRole ? (
                            loggedInUserRole === 'admin' ? (
                                <AdminPanel
                                    userRole={loggedInUserRole}
                                    username={username}
                                    language={language}
                                    setError={setError}
                                    setLoading={setLoading}
                                />
                            ) : (
                                <WorkerDashboard
                                    userRole={loggedInUserRole}
                                    username={username}
                                    timeTableUrl={timeTableUrl}
                                    language={language}
                                    setError={setError}
                                    setLoading={setLoading}
                                    users={users}
                                    tasks={tasks}
                                    reportLinks={reportLinks}
                                    reportSubCategories={reportSubCategories}
                                    refreshData={loadInitialData}
                                />
                            )
                        ) : (
                            <Navigate to="/" replace />
                        )
                    } />
                </Routes>
            </main>
        </div>
    );
}

export default App;
