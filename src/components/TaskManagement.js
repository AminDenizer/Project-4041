import React, { useState } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import moment from 'moment-jalaali';
import { createTask, updateTask } from '../api/index.js';
import { formatGregorianToJalaliForDisplay, formatGregorianForDisplay } from '../utils/dateUtils';
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

// ✅ تابع کمکی برای تبدیل تاریخ به فرمت استاندارد میلادی جهت ذخیره‌سازی
const convertDateObjectToGregorianString = (dateObj) => {
    if (!dateObj) {
        console.warn("convertDateObjectToGregorianString: Input dateObj is null or undefined.");
        return null;
    }

    let actualDateObject = dateObj;
    if (!(dateObj instanceof DateObject)) {
        console.warn("convertDateObjectToGregorianString: dateObj is not a DateObject instance. Type:", typeof dateObj, "Value:", dateObj);
        if (dateObj instanceof Date) {
            actualDateObject = new DateObject({ date: dateObj, calendar: gregorian });
            console.log("convertDateObjectToGregorianString: Wrapped plain Date into DateObject.");
        } else {
            console.error("convertDateObjectToGregorianString: Unexpected type for dateObj. Cannot convert to Gregorian string.");
            return null;
        }
    }

    try {
        // ✅ تبدیل DateObject به یک آبجکت Date استاندارد جاوااسکریپت (میلادی)
        const jsDate = actualDateObject.toDate();
        // ✅ استفاده از moment برای فرمت‌دهی نهایی به YYYY-MM-DD با ارقام انگلیسی
        return moment(jsDate).format('YYYY-MM-DD');
    } catch (e) {
        console.error("convertDateObjectToGregorianString: Error during date conversion:", e);
        return null;
    }
};


const TaskManagement = ({
    tasks,
    users,
    language,
    setAppError,
    setAppLoading,
    loadAllData,
    showMessage,
    handleDeleteConfirmation,
    currentCalendarConfig,
    isDeleting
}) => {
    const [newTaskStartDate, setNewTaskStartDate] = useState(new DateObject({ calendar: currentCalendarConfig.calendar, locale: currentCalendarConfig.locale }));
    const [newTaskEndDate, setNewTaskEndDate] = useState(new DateObject({ calendar: currentCalendarConfig.calendar, locale: currentCalendarConfig.locale }));
    const [newTaskFa, setNewTaskFa] = useState('');
    const [newTaskEn, setNewTaskEn] = useState('');
    const [newTaskOwnerId, setNewTaskOwnerId] = useState('');
    const [editingTask, setEditingTask] = useState(null);

    const handleAddTask = async () => {
        if (!newTaskFa || !newTaskEn || !newTaskOwnerId || !newTaskStartDate || !newTaskEndDate) {
            setAppError(language === 'fa' ? 'لطفاً تمام فیلدهای تسک را پر کنید.' : 'Please fill all task fields.');
            return;
        }
        setAppLoading(true);
        setAppError('');
        try {
            // ✅ تبدیل تاریخ‌ها به فرمت میلادی استاندارد قبل از ارسال
            const formattedStartDate = convertDateObjectToGregorianString(newTaskStartDate);
            const formattedEndDate = convertDateObjectToGregorianString(newTaskEndDate);

            await createTask({
                fa: newTaskFa,
                en: newTaskEn,
                ownerId: newTaskOwnerId,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                isComplete: false,
            });
            showMessage(language === 'fa' ? 'تسک با موفقیت اضافه شد!' : 'Task added successfully!', 'success');
            setNewTaskFa('');
            setNewTaskEn('');
            setNewTaskOwnerId('');
            setNewTaskStartDate(new DateObject({ calendar: currentCalendarConfig.calendar, locale: currentCalendarConfig.locale }));
            setNewTaskEndDate(new DateObject({ calendar: currentCalendarConfig.calendar, locale: currentCalendarConfig.locale }));
            loadAllData();
        } catch (e) {
            setAppError(language === 'fa' ? `خطا در افزودن تسک: ${e.message}` : `Error adding task: ${e.message}`);
            console.error("Error adding task:", e);
        } finally {
            setAppLoading(false);
        }
    };

    // ✅ منطق ویرایش تسک به طور کامل اصلاح شد
    const handleEditTaskClick = (task) => {
        // تاریخ از دیتابیس همیشه میلادی است (مثلاً "2025-07-22").
        // برای نمایش در DatePicker، آن را به DateObject با تقویم و زبان فعلی کاربر تبدیل می‌کنیم.
        const startDateString = task.startDate;
        const endDateString = task.endDate;

        let startDateObj = null;
        let endDateObj = null;

        // --- Start Date ---
        // Parse the Gregorian date string from DB into a standard JavaScript Date object
        const jsStartDate = startDateString ? new Date(startDateString) : null;
        if (jsStartDate && !isNaN(jsStartDate.getTime())) { // Check if date is valid
            // Create DateObject directly from the JS Date object, specifying the target calendar and locale
            startDateObj = new DateObject({
                date: jsStartDate,
                calendar: currentCalendarConfig.calendar,
                locale: currentCalendarConfig.locale,
            });
        } else {
            console.warn("handleEditTaskClick: Could not parse startDateString or it's invalid:", startDateString);
        }

        // --- End Date ---
        const jsEndDate = endDateString ? new Date(endDateString) : null;
        if (jsEndDate && !isNaN(jsEndDate.getTime())) { // Check if date is valid
            endDateObj = new DateObject({
                date: jsEndDate,
                calendar: currentCalendarConfig.calendar,
                locale: currentCalendarConfig.locale,
            });
        } else {
            console.warn("handleEditTaskClick: Could not parse endDateString or it's invalid:", endDateString);
        }

        setEditingTask({
            ...task,
            startDate: startDateObj,
            endDate: endDateObj,
        });
    };


    const handleUpdateTask = async () => {
        if (!editingTask || !editingTask.fa || !editingTask.en || !editingTask.ownerId || !editingTask.startDate || !editingTask.endDate) {
            setAppError(language === 'fa' ? 'لطفاً تمام فیلدهای تسک را پر کنید.' : 'Please fill all task fields.');
            return;
        }
        setAppLoading(true);
        setAppError('');
        try {
            // ✅ تبدیل تاریخ‌ها به فرمت میلادی استاندارد قبل از ارسال
            const formattedStartDate = convertDateObjectToGregorianString(editingTask.startDate);
            const formattedEndDate = convertDateObjectToGregorianString(editingTask.endDate);

            await updateTask(editingTask.id, {
                fa: editingTask.fa,
                en: editingTask.en,
                ownerId: editingTask.ownerId,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                isComplete: editingTask.isComplete,
            });
            showMessage(language === 'fa' ? 'تسک با موفقیت به‌روزرسانی شد!' : 'Task updated successfully!', 'success');
            setEditingTask(null);
            loadAllData();
        } catch (e) {
            setAppError(language === 'fa' ? `خطا در به‌روزرسانی تسک: ${e.message}` : `Error updating task: ${e.message}`);
            console.error("Error updating task:", e);
        } finally {
            setAppLoading(false);
        }
    };

    const handleToggleComplete = async (task) => {
        setAppLoading(true);
        setAppError('');
        try {
            // برای toggle complete، تاریخ‌ها را همانطور که هستند (رشته میلادی) ارسال می‌کنیم
            // چون فقط وضعیت isComplete تغییر می‌کند و نیازی به تبدیل مجدد تاریخ نیست.
            await updateTask(task.id, {
                ...task,
                isComplete: !task.isComplete,
            });
            showMessage(language === 'fa' ? 'وضعیت تسک با موفقیت به‌روزرسانی شد!' : 'Task status updated successfully!', 'success');
            loadAllData();
        } catch (e) {
            setAppError(language === 'fa' ? `خطا در به‌روزرسانی وضعیت تسک: ${e.message}` : `Error updating task status: ${e.message}`);
            console.error("Error toggling complete status:", e);
        } finally {
            setAppLoading(false);
        }
    };

    return (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
                {editingTask ? (language === 'fa' ? 'ویرایش تسک' : 'Edit Task') : (language === 'fa' ? 'افزودن تسک جدید' : 'Add New Task')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="taskFa" className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'fa' ? 'تسک (فارسی):' : 'Task (Persian):'}
                    </label>
                    <input
                        type="text"
                        id="taskFa"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={editingTask ? editingTask.fa : newTaskFa}
                        onChange={(e) => editingTask ? setEditingTask({ ...editingTask, fa: e.target.value }) : setNewTaskFa(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="taskEn" className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'fa' ? 'تسک (انگلیسی):' : 'Task (English):'}
                    </label>
                    <input
                        type="text"
                        id="taskEn"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={editingTask ? editingTask.en : newTaskEn}
                        onChange={(e) => editingTask ? setEditingTask({ ...editingTask, en: e.target.value }) : setNewTaskEn(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="taskOwner" className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'fa' ? 'مسئول:' : 'Owner:'}
                    </label>
                    <select
                        id="taskOwner"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                        value={editingTask ? editingTask.ownerId : newTaskOwnerId}
                        onChange={(e) => editingTask ? setEditingTask({ ...editingTask, ownerId: e.target.value }) : setNewTaskOwnerId(e.target.value)}
                    >
                        <option value="" disabled>{language === 'fa' ? 'یک مسئول انتخاب کنید' : 'Select an owner'}</option>
                        {users.filter(u => u.isActive && u.username !== 'admin').map(user => (
                            <option key={user.id} value={user.username}>{user.username}</option>
                        ))}
                    </select>
                </div>
                {/* Start Date Picker */}
                <div>
                    <label htmlFor="taskStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'fa' ? 'تاریخ شروع:' : 'Start Date:'}
                    </label>
                    <DatePicker
                        value={editingTask ? editingTask.startDate : newTaskStartDate}
                        onChange={(date) => editingTask ? setEditingTask({ ...editingTask, startDate: date }) : setNewTaskStartDate(date)}
                        calendar={currentCalendarConfig.calendar}
                        locale={currentCalendarConfig.locale}
                        inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        id="taskStartDate"
                    />
                </div>
                {/* End Date Picker */}
                <div>
                    <label htmlFor="taskEndDate" className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'fa' ? 'تاریخ پایان:' : 'End Date:'}
                    </label>
                    <DatePicker
                        value={editingTask ? editingTask.endDate : newTaskEndDate}
                        onChange={(date) => editingTask ? setEditingTask({ ...editingTask, endDate: date }) : setNewTaskEndDate(date)}
                        calendar={currentCalendarConfig.calendar}
                        locale={currentCalendarConfig.locale}
                        inputClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        id="taskEndDate"
                    />
                </div>
            </div>
            {editingTask ? (
                <div className="flex gap-2">
                    <button
                        onClick={handleUpdateTask}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                        disabled={!editingTask.fa || !editingTask.en || !editingTask.ownerId || !editingTask.startDate || !editingTask.endDate}
                    >
                        {language === 'fa' ? 'ذخیره تغییرات' : 'Save Changes'}
                    </button>
                    <button
                        onClick={() => setEditingTask(null)}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                    >
                        {language === 'fa' ? 'لغو' : 'Cancel'}
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleAddTask}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                    disabled={!newTaskFa || !newTaskEn || !newTaskOwnerId || !newTaskStartDate || !newTaskEndDate}
                >
                    {language === 'fa' ? 'افزودن تسک' : 'Add Task'}
                </button>
            )}

            <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-8">
                {language === 'fa' ? 'تسک‌های پروژه' : 'Project Tasks'}
            </h2>
            <div className="overflow-x-auto mb-8">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="py-3 px-3 text-center text-sm font-semibold text-gray-700">
                                {language === 'fa' ? 'تسک (فارسی)' : 'Task (Persian)'}
                            </th>
                            <th className="py-3 px-3 text-center text-sm font-semibold text-gray-700">
                                {language === 'fa' ? 'تسک (انگلیسی)' : 'Task (English)'}
                            </th>
                            <th className="py-3 px-3 text-center text-sm font-semibold text-gray-700">
                                {language === 'fa' ? 'مسئول' : 'Owner'}
                            </th>
                            <th className="py-3 px-3 text-center text-sm font-semibold text-gray-700">
                                {language === 'fa' ? 'شروع' : 'Start'}
                            </th>
                            <th className="py-3 px-3 text-center text-sm font-semibold text-gray-700">
                                {language === 'fa' ? 'پایان' : 'End'}
                            </th>
                            <th className="py-3 px-3 text-center text-sm font-semibold text-gray-700">
                                {language === 'fa' ? 'وضعیت' : 'Status'}
                            </th>
                            <th className="py-3 px-3 text-center text-sm font-semibold text-gray-700">
                                {language === 'fa' ? 'عملیات' : 'Actions'}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                            <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-3 text-center text-sm text-gray-800 whitespace-nowrap">{task.fa}</td>
                                <td className="py-3 px-3 text-center text-sm text-gray-800 whitespace-nowrap">{task.en}</td>
                                <td className="py-3 px-3 text-center text-sm text-gray-800 whitespace-nowrap">{task.ownerId}</td>
                                <td className="py-3 px-3 text-center text-sm text-gray-800 whitespace-nowrap">
                                    {/* نمایش تاریخ شروع: اگر زبان فارسی باشد، به شمسی تبدیل و نمایش می‌دهد، در غیر این صورت میلادی */}
                                    {language === 'fa'
                                        ? formatGregorianToJalaliForDisplay(task.startDate)
                                        : formatGregorianForDisplay(task.startDate)}
                                </td>
                                <td className="py-3 px-3 text-center text-sm text-gray-800 whitespace-nowrap">
                                    {/* نمایش تاریخ پایان: اگر زبان فارسی باشد، به شمسی تبدیل و نمایش می‌دهد، در غیر این صورت میلادی */}
                                    {language === 'fa'
                                        ? formatGregorianToJalaliForDisplay(task.endDate)
                                        : formatGregorianForDisplay(task.endDate)}
                                </td>
                                <td className="py-3 px-3 text-center text-sm text-gray-800 whitespace-nowrap">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${task.isComplete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {task.isComplete ? (language === 'fa' ? 'انجام شده' : 'Completed') : (language === 'fa' ? 'در حال انجام' : 'In Progress')}
                                    </span>
                                </td>
                                <td className="py-3 px-3 text-sm">
                                    <div className="flex gap-2 justify-center">
                                        <button
                                            onClick={() => handleEditTaskClick(task)}
                                            className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded-md text-xs shadow-sm"
                                        >
                                            {language === 'fa' ? 'ویرایش' : 'Edit'}
                                        </button>
                                        <button
                                            onClick={() => handleToggleComplete(task)}
                                            className={`py-1 px-3 rounded-md text-xs shadow-sm ${task.isComplete ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                                        >
                                            {task.isComplete ? (language === 'fa' ? 'عدم تکمیل' : 'Unmark') : (language === 'fa' ? 'تکمیل' : 'Complete')}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteConfirmation(task.id, 'task', language === 'fa' ? 'آیا از حذف این تسک اطمینان دارید؟' : 'Are you sure you want to delete this task?')}
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

export default TaskManagement;
