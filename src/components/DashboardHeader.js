import React from 'react';

const DashboardHeader = ({
    language, toggleLanguage, loggedInUserRole, username, handleLogout,
    show30HourReportDropdown, setShow30HourReportDropdown,
    showTwoWeekReportDropdown, setShowTwoWeekReportDropdown,
    getReportLinksForUserAndCategory, downloadFile, userTimeTableUrl,
    viewingUser, dynamicReportSubCategories
}) => {
    const getReportSubCategoryDisplayName = (subCategoryEn, lang, dynamicSubCategories) => {
        const subCategory = dynamicSubCategories.find(sc => sc.en === subCategoryEn);
        return subCategory ? (subCategory[lang] || subCategory.en) : subCategoryEn;
    };

    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
                {language === 'fa' ? 'گانت چارت پروژه' : 'Project Gantt Chart'}
            </h1>
            <div className="flex space-x-4 rtl:space-x-reverse">
                <button
                    onClick={toggleLanguage}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm"
                >
                    {language === 'fa' ? 'English' : 'فارسی'}
                </button>

                <div className="relative">
                    <button
                        onClick={() => setShow30HourReportDropdown(!show30HourReportDropdown)}
                        className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm flex items-center
                            ${loggedInUserRole === 'admin' && viewingUser === 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loggedInUserRole === 'admin' && viewingUser === 'admin'}
                    >
                        {language === 'fa' ? 'گزارش ۳۰ ساعته' : '30-Hour Report'}
                        <svg className={`w-4 h-4 ${language === 'fa' ? 'mr-2' : 'ml-2'} transition-transform duration-200 ${show30HourReportDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    {show30HourReportDropdown && !(loggedInUserRole === 'admin' && viewingUser === 'admin') && (
                        <div className={`absolute ${language === 'fa' ? 'left-0' : 'right-0'} mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200`}>
                            {getReportLinksForUserAndCategory(loggedInUserRole === 'admin' ? viewingUser : username, '30 Hours').map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => {
                                        downloadFile(link.url, `${link.nameEn || link.nameFa}.pdf`);
                                        setShow30HourReportDropdown(false);
                                    }}
                                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full ${language === 'fa' ? 'text-right' : 'text-left'}`}
                                >
                                    {getReportSubCategoryDisplayName(link.reportSubCategory, language, dynamicReportSubCategories)}
                                </button>
                            ))}
                            {getReportLinksForUserAndCategory(loggedInUserRole === 'admin' ? viewingUser : username, '30 Hours').length === 0 && (
                                <div className="px-4 py-2 text-sm text-gray-500">
                                    {language === 'fa' ? 'گزارشی یافت نشد.' : 'No reports found.'}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowTwoWeekReportDropdown(!showTwoWeekReportDropdown)}
                        className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm flex items-center
                            ${loggedInUserRole === 'admin' && viewingUser === 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loggedInUserRole === 'admin' && viewingUser === 'admin'}
                    >
                        {language === 'fa' ? 'گزارش دو هفته' : 'Two-Week Report'}
                        <svg className={`w-4 h-4 ${language === 'fa' ? 'mr-2' : 'ml-2'} transition-transform duration-200 ${showTwoWeekReportDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    {showTwoWeekReportDropdown && !(loggedInUserRole === 'admin' && viewingUser === 'admin') && (
                        <div className={`absolute ${language === 'fa' ? 'left-0' : 'right-0'} mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200`}>
                            {getReportLinksForUserAndCategory(loggedInUserRole === 'admin' ? viewingUser : username, 'Twice a week').map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => {
                                        downloadFile(link.url, `${link.nameEn || link.nameFa}.pdf`);
                                        setShowTwoWeekReportDropdown(false);
                                    }}
                                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full ${language === 'fa' ? 'text-right' : 'text-left'}`}
                                >
                                    {getReportSubCategoryDisplayName(link.reportSubCategory, language, dynamicReportSubCategories)}
                                </button>
                            ))}
                            {getReportLinksForUserAndCategory(loggedInUserRole === 'admin' ? viewingUser : username, 'Twice a week').length === 0 && (
                                <div className="px-4 py-2 text-sm text-gray-500">
                                    {language === 'fa' ? 'گزارشی یافت نشد.' : 'No reports found.'}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <button
                    onClick={() => window.open(userTimeTableUrl, '_blank')}
                    className={`bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm ${userTimeTableUrl ? 'hover:bg-orange-600' : 'opacity-50 cursor-not-allowed'}`}
                    disabled={!userTimeTableUrl}
                >
                    {language === 'fa' ? 'برنامه زمانی' : 'Time Table'}
                </button>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm"
                >
                    {language === 'fa' ? 'خروج' : 'Logout'}
                </button>
            </div>
        </div>
    );
};

export default DashboardHeader;
