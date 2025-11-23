// components/ReportLinkManagement.js
import React, { useState, useEffect } from 'react';
import { createReportLink, updateReportLink } from '../api/index.js';

const ReportLinkManagement = ({ reportLinks, users, reportSubCategories, language, setAppError, setAppLoading, loadAllData, showMessage, handleDeleteConfirmation, reportCategories, isDeleting }) => {
    const [newReportNameFa, setNewReportNameFa] = useState('');
    const [newReportNameEn, setNewReportNameEn] = useState('');
    const [newReportUrl, setNewReportUrl] = useState('');
    const [newReportOwnerId, setNewReportOwnerId] = useState('');
    const [newReportCategory, setNewReportCategory] = useState(reportCategories[0].en);
    const [newReportSubCategory, setNewReportSubCategory] = useState('');
    const [editingReportLink, setEditingReportLink] = useState(null);

    // این useEffect مسئول تنظیم زیردسته پیش‌فرض برای فرم است.
    // تنها زمانی اجرا می‌شود که زیردسته‌ها بارگذاری شده باشند تا از حلقه‌های رندر مجدد جلوگیری شود.
    useEffect(() => {
        if (reportSubCategories.length > 0 && !newReportSubCategory) {
            setNewReportSubCategory(reportSubCategories[0].en);
        }
    }, [reportSubCategories, newReportSubCategory]);

    // تابع کمکی برای نمایش نام دسته بندی گزارش بر اساس زبان
    const getReportCategoryDisplayName = (categoryEn, lang) => {
        const category = reportCategories.find(c => c.en === categoryEn);
        return category ? category[lang] : categoryEn;
    };

    // تابع کمکی برای نمایش نام زیردسته گزارش بر اساس زبان
    const getReportSubCategoryDisplayName = (subCategoryEn, lang) => {
        const subCategory = reportSubCategories.find(sc => sc.en === subCategoryEn);
        return subCategory ? (subCategory[lang] || subCategory.en) : subCategoryEn;
    };

    const handleAddReportLink = async () => {
        if (!newReportNameFa || !newReportNameEn || !newReportUrl || !newReportOwnerId || !newReportCategory || !newReportSubCategory) {
            setAppError(language === 'fa' ? 'لطفاً تمام فیلدهای لینک گزارش را پر کنید.' : 'Please fill all report link fields.');
            return;
        }
        setAppLoading(true);
        setAppError('');
        try {
            await createReportLink({
                nameFa: newReportNameFa,
                nameEn: newReportNameEn,
                url: newReportUrl,
                ownerId: newReportOwnerId,
                reportCategory: newReportCategory,
                reportSubCategory: newReportSubCategory,
            });
            showMessage(language === 'fa' ? 'لینک گزارش با موفقیت اضافه شد!' : 'Report link added successfully!', 'success');
            setNewReportNameFa('');
            setNewReportNameEn('');
            setNewReportUrl('');
            setNewReportOwnerId('');
            setNewReportCategory(reportCategories[0].en);
            setNewReportSubCategory('');
            loadAllData();
        } catch (e) {
            setAppError(language === 'fa' ? `خطا در افزودن لینک گزارش: ${e.message}` : `Error adding report link: ${e.message}`);
            console.error("Error adding report link:", e);
        } finally {
            setAppLoading(false);
        }
    };

    const handleEditReportLinkClick = (link) => { // This function was unused
        setEditingReportLink({ ...link });
        setNewReportNameFa(link.nameFa);
        setNewReportNameEn(link.nameEn);
        setNewReportUrl(link.url);
        setNewReportOwnerId(link.ownerId);
        setNewReportCategory(link.reportCategory);
        setNewReportSubCategory(link.reportSubCategory);
    };

    const handleUpdateReportLink = async () => {
        if (!editingReportLink || !newReportNameFa || !newReportNameEn || !newReportUrl || !newReportOwnerId || !newReportCategory || !newReportSubCategory) {
            setAppError(language === 'fa' ? 'لطفاً تمام فیلدهای لینک گزارش را پر کنید.' : 'Please fill all report link fields.');
            return;
        }
        setAppLoading(true);
        setAppError('');
        try {
            await updateReportLink(editingReportLink.id, {
                nameFa: newReportNameFa,
                nameEn: newReportNameEn,
                url: newReportUrl,
                ownerId: newReportOwnerId,
                reportCategory: newReportCategory,
                reportSubCategory: newReportSubCategory,
            });
            showMessage(language === 'fa' ? 'لینک گزارش با موفقیت به‌روزرسانی شد!' : 'Report link updated successfully!', 'success');
            setEditingReportLink(null);
            setNewReportNameFa('');
            setNewReportNameEn('');
            setNewReportUrl('');
            setNewReportOwnerId('');
            setNewReportCategory(reportCategories[0].en);
            setNewReportSubCategory('');
            loadAllData();
        } catch (e) {
            setAppError(language === 'fa' ? `خطا در به‌روزرسانی لینک گزارش: ${e.message}` : `Error updating report link: ${e.message}`);
            console.error("Error updating report link:", e);
        } finally {
            setAppLoading(false);
        }
    };

    return (
        <div className="mt-12 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h2 className="text-xl font-semibold text-purple-700 mb-4">
                {editingReportLink ? (language === 'fa' ? 'ویرایش لینک گزارش' : 'Edit Report Link') : (language === 'fa' ? 'افزودن لینک گزارش جدید' : 'Add New Report Link')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="reportNameFa" className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'fa' ? 'نام گزارش (فارسی):' : 'Report Name (Persian):'}
                    </label>
                    <input
                        type="text"
                        id="reportNameFa"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        value={editingReportLink ? editingReportLink.nameFa : newReportNameFa}
                        onChange={(e) => editingReportLink ? setEditingReportLink({ ...editingReportLink, nameFa: e.target.value }) : setNewReportNameFa(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="reportNameEn" className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'fa' ? 'نام گزارش (انگلیسی):' : 'Report Name (English):'}
                    </label>
                    <input
                        type="text"
                        id="reportNameEn"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        value={editingReportLink ? editingReportLink.nameEn : newReportNameEn}
                        onChange={(e) => editingReportLink ? setEditingReportLink({ ...editingReportLink, nameEn: e.target.value }) : setNewReportNameEn(e.target.value)}
                    />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="reportUrl" className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'fa' ? 'لینک URL:' : 'URL Link:'}
                    </label>
                    <input
                        type="url"
                        id="reportUrl"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        value={editingReportLink ? editingReportLink.url : newReportUrl}
                        onChange={(e) => editingReportLink ? setEditingReportLink({ ...editingReportLink, url: e.target.value }) : setNewReportUrl(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="reportOwner" className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'fa' ? 'مسئول گزارش:' : 'Report Owner:'}
                    </label>
                    <select
                        id="reportOwner"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white"
                        value={editingReportLink ? editingReportLink.ownerId : newReportOwnerId}
                        onChange={(e) => editingReportLink ? setEditingReportLink({ ...editingReportLink, ownerId: e.target.value }) : setNewReportOwnerId(e.target.value)}
                    >
                        <option value="" disabled>{language === 'fa' ? 'یک مسئول انتخاب کنید' : 'Select an owner'}</option>
                        {users.filter(u => u.isActive && u.username !== 'admin').map(user => (
                            <option key={user.id} value={user.username}>{user.username}</option>
                        ))}
                        <option value="All">{language === 'fa' ? 'همه' : 'All'}</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="reportCategory" className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'fa' ? 'دسته بندی گزارش:' : 'Report Category:'}
                    </label>
                    <select
                        id="reportCategory"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white"
                        value={editingReportLink ? editingReportLink.reportCategory : newReportCategory}
                        onChange={(e) => editingReportLink ? setEditingReportLink({ ...editingReportLink, reportCategory: e.target.value }) : setNewReportCategory(e.target.value)}
                    >
                        {reportCategories.map(category => (
                            <option key={category.en} value={category.en}>
                                {category[language]}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="reportSubCategory" className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'fa' ? 'زیر دسته بندی گزارش:' : 'Report Sub-Category:'}
                    </label>
                    <select
                        id="reportSubCategory"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white"
                        value={editingReportLink ? editingReportLink.reportSubCategory : newReportSubCategory}
                        onChange={(e) => editingReportLink ? setEditingReportLink({ ...editingReportLink, reportSubCategory: e.target.value }) : setNewReportSubCategory(e.target.value)}
                    >
                        <option value="" disabled>{language === 'fa' ? 'یک زیردسته انتخاب کنید' : 'Select a sub-category'}</option>
                        {reportSubCategories.map(subCategory => (
                            <option key={subCategory.id} value={subCategory.en}>
                                {subCategory[language] || subCategory.en}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {editingReportLink ? (
                <div className="flex gap-2">
                    <button
                        onClick={handleUpdateReportLink}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                        disabled={!editingReportLink.nameFa || !editingReportLink.nameEn || !editingReportLink.url || !editingReportLink.ownerId || !editingReportLink.reportCategory || !editingReportLink.reportSubCategory}
                    >
                        {language === 'fa' ? 'ذخیره تغییرات لینک' : 'Save Link Changes'}
                    </button>
                    <button
                        onClick={() => setEditingReportLink(null)}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                    >
                        {language === 'fa' ? 'لغو' : 'Cancel'}
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleAddReportLink}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                    disabled={!newReportNameFa || !newReportNameEn || !newReportUrl || !newReportOwnerId || !newReportCategory || !newReportSubCategory}
                >
                    {language === 'fa' ? 'افزودن لینک گزارش' : 'Add Report Link'}
                </button>
            )}

            <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-4">
                {language === 'fa' ? 'لینک‌های گزارش موجود' : 'Existing Report Links'}
            </h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="py-3 px-3 text-center text-sm font-semibold text-gray-700">
                                {language === 'fa' ? 'نام گزارش (فارسی)' : 'Report Name (Persian)'}
                            </th>
                            <th className="py-3 px-3 text-center text-sm font-semibold text-gray-700">
                                {language === 'fa' ? 'مسئول' : 'Owner'}
                            </th>
                            <th className="py-3 px-3 text-center text-sm font-semibold text-gray-700">
                                {language === 'fa' ? 'دسته بندی' : 'Category'}
                            </th>
                            <th className="py-3 px-3 text-center text-sm font-semibold text-gray-700">
                                {language === 'fa' ? 'زیر دسته' : 'Sub-Category'}
                            </th>
                            <th className="py-3 px-3 text-center text-sm font-semibold text-gray-700">
                                {language === 'fa' ? 'لینک' : 'Link'}
                            </th>
                            <th className="py-3 px-3 text-center text-sm font-semibold text-gray-700">
                                {language === 'fa' ? 'عملیات' : 'Actions'}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportLinks
                            .filter(link => link.url)
                            .map(link => (
                                <tr key={link.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-3 text-center text-sm text-gray-800">{language === 'fa' ? link.nameFa : link.nameEn}</td>
                                    <td className="py-3 px-3 text-center text-sm text-gray-800">{link.ownerId}</td>
                                    <td className="py-3 px-3 text-center text-sm text-gray-800">
                                        {getReportCategoryDisplayName(link.reportCategory, language)}
                                    </td>
                                    <td className="py-3 px-3 text-center text-sm text-gray-800">
                                        {getReportSubCategoryDisplayName(link.reportSubCategory, language)}
                                    </td>
                                    <td className="py-3 px-3 text-center text-sm text-blue-600 hover:underline">
                                        <a href={link.url} target="_blank" rel="noopener noreferrer">{language === 'fa' ? 'مشاهده' : 'View'}</a>
                                    </td>
                                    <td className="py-3 px-3 text-sm">
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => setEditingReportLink(link)}
                                                className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded-md text-xs shadow-sm"
                                            >
                                                {language === 'fa' ? 'ویرایش' : 'Edit'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteConfirmation(link.id, 'reportLink', language === 'fa' ? 'آیا از حذف این لینک گزارش اطمینان دارید؟' : 'Are you sure you want to delete this report link?')}
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

export default ReportLinkManagement;
