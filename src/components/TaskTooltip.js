import React from 'react';
import { formatJalaliDate, formatGregorianDate } from '../utils/dateUtils';

const TaskTooltip = ({ showTooltip, tooltipPosition, tooltipContent, language }) => {
    if (!showTooltip) return null;
    return (
        <div
            className="fixed bg-gray-800 text-white text-sm p-3 rounded-lg shadow-xl z-50 pointer-events-none font-vazirmatn"
            style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
        >
            <h4 className="font-bold mb-1">
                {language === 'fa' ? 'تسک:' : 'Task:'} {language === 'fa' ? tooltipContent.fa : tooltipContent.en}
            </h4>
            <p>
                {language === 'fa' ? 'شروع:' : 'Start:'}{' '}
                {language === 'fa' ? formatJalaliDate(tooltipContent.startDate) : formatGregorianDate(tooltipContent.startDate)}
            </p>
            <p>
                {language === 'fa' ? 'پایان:' : 'End:'}{' '}
                {language === 'fa' ? formatJalaliDate(tooltipContent.endDate) : formatGregorianDate(tooltipContent.endDate)}
            </p>
            <p>
                {language === 'fa' ? 'مسئول:' : 'Owner:'}{' '}
                {tooltipContent.ownerId}
            </p>
            <p>
                {language === 'fa' ? 'وضعیت:' : 'Status:'}{' '}
                <span className="font-semibold">
                    {tooltipContent.isComplete ? (language === 'fa' ? 'انجام شده' : 'Completed') : (language === 'fa' ? 'در حال انجام' : 'In Progress')}
                </span>
            </p>
        </div>
    );
};

export default TaskTooltip;
