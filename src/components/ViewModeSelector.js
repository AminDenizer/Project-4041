import React from 'react';

const ViewModeSelector = ({ viewMode, setViewMode, language }) => (
    <div className="mb-6 flex flex-wrap gap-3 items-center">
        <span className="text-gray-700 font-semibold">
            {language === 'fa' ? 'حالت نمایش:' : 'View Mode:'}
        </span>
        <button
            onClick={() => setViewMode('daily')}
            className={`py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${viewMode === 'daily' ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
        >
            {language === 'fa' ? 'روزانه' : 'Daily'}
        </button>
        <button
            onClick={() => setViewMode('weekly')}
            className={`py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${viewMode === 'weekly' ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
        >
            {language === 'fa' ? 'هفتگی' : 'Weekly'}
        </button>
        <button
            onClick={() => setViewMode('monthly')}
            className={`py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${viewMode === 'monthly' ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
        >
            {language === 'fa' ? 'ماهانه' : 'Monthly'}
        </button>
    </div>
);

export default ViewModeSelector;
