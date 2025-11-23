import React from 'react';
import { dayColors, dayNamesFa, dayNamesEn } from '../constants/appConstants';

const DayColorLegend = ({ language }) => (
    <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
            {language === 'fa' ? 'راهنمای رنگ روزها (رنگ تسک‌ها):' : 'Day Color Legend (Task Bar Colors):'}
        </h3>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
            {Object.keys(dayColors).map((dayNum) => (
                <div key={dayNum} className="flex items-center">
                    <span className={`w-5 h-5 rounded-full ${language === 'fa' ? 'ml-2' : 'mr-2'} ${dayColors[dayNum]}`}></span>
                    <span className="text-gray-700">
                        {language === 'fa' ? dayNamesFa[dayNum] : dayNamesEn[dayNum]}
                    </span>
                </div>
            ))}
        </div>
    </div>
);

export default DayColorLegend;
