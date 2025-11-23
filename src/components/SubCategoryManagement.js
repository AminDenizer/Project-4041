// components/SubCategoryManagement.js
import React, { useState } from 'react';
import { createSubCategory, updateSubCategory } from '../api/index.js';

const SubCategoryManagement = ({ reportSubCategories, language, setAppError, setAppLoading, loadAllData, showMessage, handleDeleteConfirmation, isDeleting }) => {
    const [newSubCategoryFa, setNewSubCategoryFa] = useState('');
    const [newSubCategoryEn, setNewSubCategoryEn] = useState('');
    const [editingSubCategory, setEditingSubCategory] = useState(null);

    const handleAddSubCategory = async () => {
        if (!newSubCategoryFa || !newSubCategoryEn) {
            setAppError(language === 'fa' ? 'لطفاً نام فارسی و انگلیسی زیردسته را پر کنید.' : 'Please fill both Persian and English names for the sub-category.');
            return;
        }
        setAppLoading(true);
        setAppError('');
        try {
            await createSubCategory({
                fa: newSubCategoryFa,
                en: newSubCategoryEn,
            });
            showMessage(language === 'fa' ? 'زیردسته با موفقیت اضافه شد!' : 'Sub-category added successfully!', 'success');
            setNewSubCategoryFa('');
            setNewSubCategoryEn('');
            loadAllData();
        } catch (e) {
            setAppError(language === 'fa' ? `خطا در افزودن زیردسته: ${e.message}` : `Error adding sub-category: ${e.message}`);
            console.error("Error adding sub-category:", e);
        } finally {
            setAppLoading(false);
        }
    };

    const handleEditSubCategoryClick = (subCategory) => {
        setEditingSubCategory({ ...subCategory });
        setNewSubCategoryFa(subCategory.fa);
        setNewSubCategoryEn(subCategory.en);
    };

    const handleUpdateSubCategory = async () => {
        if (!editingSubCategory || !newSubCategoryFa || !newSubCategoryEn) {
            setAppError(language === 'fa' ? 'لطفاً نام فارسی و انگلیسی زیردسته را پر کنید.' : 'Please fill both Persian and English names for the sub-category.');
            return;
        }
        setAppLoading(true);
        setAppError('');
        try {
            await updateSubCategory(editingSubCategory.id, {
                fa: newSubCategoryFa,
                en: newSubCategoryEn,
            });
            showMessage(language === 'fa' ? 'زیردسته با موفقیت به‌روزرسانی شد!' : 'Sub-category updated successfully!', 'success');
            setEditingSubCategory(null);
            setNewSubCategoryFa('');
            setNewSubCategoryEn('');
            loadAllData();
        } catch (e) {
            setAppError(language === 'fa' ? `خطا در به‌روزرسانی زیردسته: ${e.message}` : `Error updating sub-category: ${e.message}`);
            console.error("Error updating sub-category:", e);
        } finally {
            setAppLoading(false);
        }
    };

    const handleCancelEditSubCategory = () => {
        setEditingSubCategory(null);
        setNewSubCategoryFa('');
        setNewSubCategoryEn('');
    };

    return (
        <div className="mt-12 p-4 bg-gray-100 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {editingSubCategory ? (language === 'fa' ? 'ویرایش زیردسته گزارش' : 'Edit Report Sub-Category') : (language === 'fa' ? 'مدیریت زیردسته‌های گزارش' : 'Manage Report Sub-Categories')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="newSubCategoryFa" className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'fa' ? 'نام زیردسته (فارسی):' : 'Sub-Category Name (Persian):'}
                    </label>
                    <input
                        type="text"
                        id="newSubCategoryFa"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                        value={newSubCategoryFa}
                        onChange={(e) => setNewSubCategoryFa(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="newSubCategoryEn" className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'fa' ? 'نام زیردسته (انگلیسی):' : 'Sub-Category Name (English):'}
                    </label>
                    <input
                        type="text"
                        id="newSubCategoryEn"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                        value={newSubCategoryEn}
                        onChange={(e) => setNewSubCategoryEn(e.target.value)}
                    />
                </div>
            </div>
            {editingSubCategory ? (
                <div className="flex gap-2">
                    <button
                        onClick={handleUpdateSubCategory}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                        disabled={!newSubCategoryFa || !newSubCategoryEn}
                    >
                        {language === 'fa' ? 'ذخیره تغییرات زیردسته' : 'Save Sub-Category Changes'}
                    </button>
                    <button
                        onClick={handleCancelEditSubCategory}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                    >
                        {language === 'fa' ? 'لغو' : 'Cancel'}
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleAddSubCategory}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                    disabled={!newSubCategoryFa || !newSubCategoryEn}
                >
                    {language === 'fa' ? 'افزودن زیردسته' : 'Add Sub-Category'}
                </button>
            )}

            <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">
                {language === 'fa' ? 'زیردسته‌های موجود:' : 'Existing Sub-Categories:'}
            </h3>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="py-3 px-3 text-center text-sm font-semibold text-gray-700">
                                {language === 'fa' ? 'نام (فارسی)' : 'Name (Persian)'}
                            </th>
                            <th className="py-3 px-3 text-center text-sm font-semibold text-gray-700">
                                {language === 'fa' ? 'نام (انگلیسی)' : 'Name (English)'}
                            </th>
                            <th className="py-3 px-3 text-center text-sm font-semibold text-gray-700">
                                {language === 'fa' ? 'عملیات' : 'Actions'}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportSubCategories.map(subCat => (
                            <tr key={subCat.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-3 text-center text-sm text-gray-800">{subCat.fa}</td>
                                <td className="py-3 px-3 text-center text-sm text-gray-800">{subCat.en}</td>
                                <td className="py-3 px-3 text-sm">
                                    <div className="flex gap-2 justify-center">
                                        <button
                                            onClick={() => handleEditSubCategoryClick(subCat)}
                                            className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded-md text-xs shadow-sm"
                                        >
                                            {language === 'fa' ? 'ویرایش' : 'Edit'}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteConfirmation(subCat.id, 'subCategory', language === 'fa' ? 'آیا از حذف این زیردسته اطمینان دارید؟' : 'Are you sure you want to delete this sub-category?')}
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

export default SubCategoryManagement;
