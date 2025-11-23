// components/AdminPanel.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    fetchUsers, fetchTasks, fetchReportLinks, fetchSubCategories,
    deleteUser, deleteTask, deleteReportLink, deleteSubCategory // FIX: Re-imported delete functions
} from '../api/index.js';
import { calendarConfig } from '../utils/dateUtils';
import ConfirmModal from './ConfirmModal';

// Import new modular components
import UserManagement from './UserManagement';
import TaskManagement from './TaskManagement';
import ReportLinkManagement from './ReportLinkManagement';
import SubCategoryManagement from './SubCategoryManagement';

const AdminPanel = ({ userRole, username, language, setError: setAppError, setLoading: setAppLoading }) => {
    // State های اصلی برای نگهداری داده ها
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [reportLinks, setReportLinks] = useState([]);
    const [reportSubCategories, setReportSubCategories] = useState([]);

    // تنظیمات تقویم و لوکال بر اساس زبان انتخاب شده (برای پاس دادن به کامپوننت های فرزند)
    const currentCalendarConfig = calendarConfig[language] || calendarConfig.en;

    // State های عمومی UI برای مودال تایید و وضعیت حذف
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [itemToDelete, setItemToDelete] = useState(null);

    // State برای نمایش پیام های UI (جایگزین alert)
    const [uiMessage, setUiMessage] = useState(null);
    const [uiMessageType, setUiMessageType] = useState('success');

    // تابع برای نمایش پیام های UI
    const showMessage = (message, type = 'success') => {
        setUiMessage(message);
        setUiMessageType(type);
        setTimeout(() => {
            setUiMessage(null);
            setUiMessageType('success');
        }, 3000);
    };

    // ایجاد رفرنس برای setAppError و setAppLoading
    const setAppErrorRef = useRef(setAppError);
    const setAppLoadingRef = useRef(setAppLoading);

    // به روزرسانی رفرنس ها در صورت تغییر props (اگرچه برای useState setters نباید تغییر کنند)
    useEffect(() => {
        setAppErrorRef.current = setAppError;
        setAppLoadingRef.current = setAppLoading;
    }, [setAppError, setAppLoading]);

    // --- توابع واکشی داده ها ---
    // این تابع تمام داده ها را واکشی می کند و memoize شده است تا از ایجاد مجدد غیرضروری جلوگیری شود.
    const loadAllData = useCallback(async () => {
        console.log("loadAllData: Function called (should be stable reference).");
        setAppLoadingRef.current(false); // فقط برای بارگذاری اولیه
        setAppErrorRef.current('');
        try {
            // واکشی همزمان تمام داده ها
            const [usersData, tasksData, reportLinksData, subCategoriesData] = await Promise.all([
                fetchUsers(),
                fetchTasks(),
                fetchReportLinks(),
                fetchSubCategories()
            ]);

            setUsers(usersData);
            setReportLinks(reportLinksData);
            setReportSubCategories(subCategoriesData);

            // تاریخ‌ها را به صورت رشته (همانطور که از بک‌اند می‌آیند) در state ذخیره می‌کنیم
            const fetchedTasks = tasksData.map(task => {
                return {
                    ...task,
                };
            });
            fetchedTasks.sort((a, b) => {
                const dateA = new Date(a.startDate); // Assuming startDate is already in a sortable format (e.g., YYYY-MM-DD)
                const dateB = new Date(b.startDate);
                return dateA.getTime() - dateB.getTime();
            });
            setTasks(fetchedTasks);

        } catch (e) {
            setAppErrorRef.current(language === 'fa' ? `خطا در بارگذاری داده‌ها: ${e.message}` : `Failed to load data: ${e.message}`);
            console.error("Error loading all data:", e);
        } finally {
            setAppLoadingRef.current(false); // فقط برای بارگذاری اولیه
            console.log("loadAllData: Finished fetching data.");
        }
    }, []); // language is a dependency because error message depends on it

    // useEffect برای بارگذاری اولیه داده ها.
    // این Effect تنها یک بار هنگام mount شدن کامپوننت (به دلیل وابستگی userRole و loadAllData پایدار) اجرا می شود.
    useEffect(() => {
        if (userRole === 'admin') {
            loadAllData(); // فراخوانی loadAllData پایدار
        }
    }, [userRole, loadAllData]);


    // تابع برای اجرای حذف پس از تایید مودال
    const performDeletion = useCallback(async () => {
        if (!itemToDelete) return;

        setAppLoadingRef.current(true);
        setIsDeleting(true);
        setAppErrorRef.current('');

        try {
            switch (itemToDelete.type) {
                case 'task':
                    await deleteTask(itemToDelete.id); // FIX: deleteTask is now imported
                    showMessage(language === 'fa' ? 'تسک با موفقیت حذف شد!' : 'Task deleted successfully!', 'success');
                    break;
                case 'reportLink':
                    await deleteReportLink(itemToDelete.id); // FIX: deleteReportLink is now imported
                    showMessage(language === 'fa' ? 'لینک گزارش با موفقیت حذف شد!' : 'Report link deleted successfully!', 'success');
                    break;
                case 'subCategory':
                    await deleteSubCategory(itemToDelete.id); // FIX: deleteSubCategory is now imported
                    showMessage(language === 'fa' ? 'زیردسته با موفقیت حذف شد!' : 'Sub-category deleted successfully!', 'success');
                    break;
                case 'user':
                    await deleteUser(itemToDelete.id); // FIX: deleteUser is now imported
                    showMessage(language === 'fa' ? 'کاربر با موفقیت حذف شد!' : 'User deleted successfully!', 'success');
                    break;
                default:
                    console.error("Unknown item type for deletion:", itemToDelete.type);
            }
            loadAllData(); // Refresh all data after deletion
        } catch (e) {
            setAppErrorRef.current(language === 'fa' ? `خطا در حذف: ${e.message}` : `Error deleting: ${e.message}`);
            console.error("Error during deletion:", e);
        } finally {
            setAppLoadingRef.current(false);
            setShowConfirmModal(false);
            setIsDeleting(false);
            setItemToDelete(null);
        }
    }, [itemToDelete, language, loadAllData]);

    // تابع برای نمایش مودال تایید حذف
    const handleDeleteConfirmation = useCallback((id, type, message) => {
        setConfirmMessage(message);
        setItemToDelete({ id, type });
        setShowConfirmModal(true);
    }, []);


    if (userRole !== 'admin') {
        return <p>{language === 'fa' ? 'شما اجازه دسترسی به پنل ادمین را ندارید.' : 'You do not have permission to view the admin panel.'}</p>;
    }

    return (
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
            {/* پیام های UI */}
            {uiMessage && (
                <div className={`fixed top-4 left-1/2 -translate-x-1/2 p-4 rounded-md shadow-lg z-50 transition-all duration-300 ${
                    uiMessageType === 'success' ? 'bg-green-500 text-white' :
                    uiMessageType === 'error' ? 'bg-red-500 text-white' :
                    'bg-blue-500 text-white'
                }`}>
                    {uiMessage}
                </div>
            )}

            {/* User Management Section */}
            <UserManagement
                users={users}
                language={language}
                setAppError={setAppErrorRef.current}
                setAppLoading={setAppLoadingRef.current}
                loadAllData={loadAllData}
                showMessage={showMessage}
                handleDeleteConfirmation={handleDeleteConfirmation}
                isDeleting={isDeleting}
            />

            {/* Task Management Section */}
            <TaskManagement
                tasks={tasks}
                users={users}
                language={language}
                setAppError={setAppErrorRef.current}
                setAppLoading={setAppLoadingRef.current}
                loadAllData={loadAllData}
                showMessage={showMessage}
                handleDeleteConfirmation={handleDeleteConfirmation}
                currentCalendarConfig={currentCalendarConfig}
                isDeleting={isDeleting}
            />

            {/* Report Link Management Section */}
            <ReportLinkManagement
                reportLinks={reportLinks}
                users={users}
                reportSubCategories={reportSubCategories}
                language={language}
                setAppError={setAppErrorRef.current}
                setAppLoading={setAppLoadingRef.current}
                loadAllData={loadAllData}
                showMessage={showMessage}
                handleDeleteConfirmation={handleDeleteConfirmation}
                reportCategories={[
                    { fa: '30 ساعته', en: '30 Hours' },
                    { fa: 'گزارش دوهفته', en: 'Twice a week' }
                ]}
                isDeleting={isDeleting}
            />

            {/* Report Sub-Category Management Section */}
            <SubCategoryManagement
                reportSubCategories={reportSubCategories}
                language={language}
                setAppError={setAppErrorRef.current}
                setAppLoading={setAppLoadingRef.current}
                loadAllData={loadAllData}
                showMessage={showMessage}
                handleDeleteConfirmation={handleDeleteConfirmation}
                isDeleting={isDeleting}
            />

            <ConfirmModal
                show={showConfirmModal}
                message={confirmMessage}
                onConfirm={performDeletion}
                onCancel={() => {
                    setShowConfirmModal(false);
                    setIsDeleting(false);
                    setItemToDelete(null);
                }}
                isDeleting={isDeleting}
                language={language}
            />
        </div>
    );
};

export default AdminPanel;
