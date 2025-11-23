import React from 'react';
import { formatJalaliHeaderDate, formatGregorianHeaderDate, getStartOfWeek, getStartOfMonth, convertToPersianDigits } from '../utils/dateUtils';
import { dayColors, dayNamesFa, dayNamesEn } from '../constants/appConstants';

const GanttChart = ({
    filteredTasks, ganttChartRef, ganttChartWidth, viewMode, language,
    minDate, maxDate, handleMouseEnterTask, handleMouseLeaveTask, handleTaskClickForLLM
}) => {
    const minUnitWidth = 120;
    const taskNameColumnFixedPx = 48;
    const availableGanttAreaWidth = ganttChartWidth > taskNameColumnFixedPx ? ganttChartWidth - taskNameColumnFixedPx : 0;

    const dateHeaders = [];
    let currentHeaderUnit = new Date(minDate);
    currentHeaderUnit.setHours(0, 0, 0, 0);

    let headerEndDate = new Date(maxDate);
    if (viewMode === 'daily') {
        headerEndDate.setDate(headerEndDate.getDate() + 7);
    } else if (viewMode === 'weekly') {
        headerEndDate.setDate(headerEndDate.getDate() + 28);
    } else if (viewMode === 'monthly') {
        headerEndDate.setMonth(headerEndDate.getMonth() + 3);
    }

    if (viewMode === 'weekly') {
        currentHeaderUnit = getStartOfWeek(minDate);
    } else if (viewMode === 'monthly') {
        currentHeaderUnit = getStartOfMonth(minDate);
    }

    while (currentHeaderUnit <= headerEndDate) {
        dateHeaders.push(new Date(currentHeaderUnit));
        if (viewMode === 'daily') {
            currentHeaderUnit.setDate(currentHeaderUnit.getDate() + 1);
        } else if (viewMode === 'weekly') {
            currentHeaderUnit.setDate(currentHeaderUnit.getDate() + 7);
        } else if (viewMode === 'monthly') {
            currentHeaderUnit.setMonth(currentHeaderUnit.getMonth() + 1);
        }
    }

    let totalDaysInViewSpan = 0;
    let effectiveUnitWidth = minUnitWidth;

    if (viewMode === 'daily') {
        totalDaysInViewSpan = (headerEndDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
        if (totalDaysInViewSpan > 0 && availableGanttAreaWidth >= totalDaysInViewSpan * minUnitWidth) {
            effectiveUnitWidth = availableGanttAreaWidth / totalDaysInViewSpan;
        }
    } else if (viewMode === 'weekly') {
        const chartStartOfWeek = getStartOfWeek(minDate);
        const chartEndOfWeek = getStartOfWeek(headerEndDate);
        totalDaysInViewSpan = (chartEndOfWeek.getTime() - chartStartOfWeek.getTime()) / (1000 * 60 * 60 * 24);
        if (totalDaysInViewSpan > 0 && availableGanttAreaWidth >= (totalDaysInViewSpan / 7) * minUnitWidth) {
            effectiveUnitWidth = (availableGanttAreaWidth / (totalDaysInViewSpan / 7));
        } else {
            effectiveUnitWidth = minUnitWidth;
        }
    } else if (viewMode === 'monthly') {
        const chartStartOfMonth = getStartOfMonth(minDate);
        const chartEndOfMonth = getStartOfMonth(headerEndDate);
        let totalMonths = (chartEndOfMonth.getFullYear() - chartStartOfMonth.getFullYear()) * 12 + (chartEndOfMonth.getMonth() - chartStartOfMonth.getMonth()) + 1;
        totalDaysInViewSpan = totalMonths * 30.44; // Approximation for average days in a month
        if (totalMonths > 0 && availableGanttAreaWidth >= totalMonths * minUnitWidth) {
            effectiveUnitWidth = availableGanttAreaWidth / totalMonths;
        } else {
            effectiveUnitWidth = minUnitWidth;
        }
    }

    let ganttContentWidth = 0;
    if (viewMode === 'daily') {
        ganttContentWidth = dateHeaders.length * effectiveUnitWidth;
    } else if (viewMode === 'weekly') {
        ganttContentWidth = dateHeaders.length * effectiveUnitWidth;
    } else if (viewMode === 'monthly') {
        ganttContentWidth = dateHeaders.length * effectiveUnitWidth;
    }

    let rowHeight = 48;
    let dynamicTaskRowsHeight = filteredTasks.length * rowHeight;
    const taskBarPadding = 2;
    const taskBarHeight = rowHeight - (2 * taskBarPadding);
    const taskBarVerticalOffset = taskBarPadding;

    const getTaskBarColorClass = (date) => {
        return dayColors[date.getDay()];
    };

    return (
        <div ref={ganttChartRef} className="border border-gray-300 rounded-lg shadow-inner relative flex flex-grow overflow-hidden">
            <div className={`flex-shrink-0 w-12 p-3 font-semibold text-gray-700 text-center flex items-center justify-center ${language === 'fa' ? 'border-l' : 'border-r'} border-gray-200`} style={{ height: `${dynamicTaskRowsHeight + rowHeight}px` }}>
                <span className="transform rotate-90 whitespace-nowrap origin-center">
                    {language === 'fa' ? 'تسک' : 'Task'}
                </span>
            </div>

            <div className="flex-grow overflow-x-auto">
                <div className="min-w-full inline-block align-middle" style={{ width: `${ganttContentWidth}px` }}>
                    <div className="flex bg-gray-100 border-b border-gray-300 sticky top-0 z-10">
                        {dateHeaders.map((date, index) => {
                            let headerText = '';
                            let headerSubText = '';
                            let cellWidth;
                            let cellBorderClass = `${language === 'fa' ? 'border-l' : 'border-r'} border-gray-200`;

                            if (viewMode === 'daily') {
                                headerText = language === 'fa' ? dayNamesFa[date.getDay()] : dayNamesEn[date.getDay()];
                                headerSubText = language === 'fa' ? formatJalaliHeaderDate(date) : formatGregorianHeaderDate(date);
                                cellWidth = effectiveUnitWidth;
                            } else if (viewMode === 'weekly') {
                                const startOfWeek = getStartOfWeek(date);
                                const endOfWeek = new Date(startOfWeek);
                                endOfWeek.setDate(endOfWeek.getDate() + 6);
                                headerText = language === 'fa' ? `هفته ${convertToPersianDigits(index + 1)}` : `Week ${index + 1}`;
                                headerSubText = language === 'fa' ? `${formatJalaliHeaderDate(startOfWeek)} - ${formatJalaliHeaderDate(endOfWeek)}` : `${formatGregorianHeaderDate(startOfWeek)} - ${formatGregorianHeaderDate(endOfWeek)}`;
                                cellWidth = effectiveUnitWidth;
                            } else if (viewMode === 'monthly') {
                                headerText = language === 'fa' ? date.toLocaleString('fa-IR', { month: 'long', year: 'numeric' }).replace(/\d/g, d => convertToPersianDigits(d)) : date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
                                headerSubText = ''; // No sub-text for monthly view
                                cellWidth = effectiveUnitWidth;
                            }

                            return (
                                <div
                                    key={index}
                                    className={`flex-shrink-0 text-center p-3 text-sm font-medium ${cellBorderClass} bg-gray-50`}
                                    style={{ width: `${cellWidth}px` }}
                                >
                                    <div className="text-gray-700 font-bold">
                                        {headerText}
                                    </div>
                                    {headerSubText && (
                                        <div className="text-xs text-gray-500">
                                            {headerSubText}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ height: `${dynamicTaskRowsHeight}px` }}>
                        {filteredTasks
                            .map((task) => {
                                let offsetInDays = (task.startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
                                let durationInDays = (task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24);

                                const actualDurationDays = Math.max(1, durationInDays); // Ensure at least 1 day duration

                                let taskBarCalculatedWidth;
                                let taskBarCalculatedOffset;

                                if (viewMode === 'daily') {
                                    taskBarCalculatedWidth = actualDurationDays * effectiveUnitWidth;
                                    taskBarCalculatedOffset = offsetInDays * effectiveUnitWidth;
                                } else if (viewMode === 'weekly') {
                                    taskBarCalculatedWidth = actualDurationDays * (effectiveUnitWidth / 7);
                                    taskBarCalculatedOffset = offsetInDays * (effectiveUnitWidth / 7);
                                } else if (viewMode === 'monthly') {
                                    taskBarCalculatedWidth = actualDurationDays * (effectiveUnitWidth / 30.44); // Approx days per month
                                    taskBarCalculatedOffset = offsetInDays * (effectiveUnitWidth / 30.44);
                                }

                                const minTaskBarPixelWidth = 2; // Minimum width to ensure visibility
                                if (taskBarCalculatedWidth < minTaskBarPixelWidth) {
                                    taskBarCalculatedWidth = minTaskBarPixelWidth;
                                }

                                const taskBarColorClass = task.isComplete ? 'bg-green-600' : getTaskBarColorClass(task.startDate);

                                return (
                                    <div key={task._id} className="flex border-b border-gray-200 hover:bg-blue-50" style={{ height: `${rowHeight}px` }}>
                                        <div className="relative flex-grow h-auto py-3" style={{ minWidth: `${ganttContentWidth}px` }}>
                                            <div
                                                className={`absolute rounded-md shadow-md flex items-center justify-center text-white text-xs font-semibold px-2 cursor-pointer transition-colors duration-200 ${taskBarColorClass}`}
                                                style={{
                                                    [language === 'fa' ? 'right' : 'left']: `${taskBarCalculatedOffset + taskBarPadding}px`,
                                                    width: `${taskBarCalculatedWidth - (2 * taskBarPadding)}px`,
                                                    height: `${taskBarHeight}px`,
                                                    top: `${taskBarVerticalOffset}px`,
                                                }}
                                                onMouseEnter={(e) => handleMouseEnterTask(e, task)}
                                                onMouseLeave={handleMouseLeaveTask}
                                                onClick={() => handleTaskClickForLLM(task)}
                                            >
                                                {/* No text directly inside the bar now, only color indicates day */}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GanttChart;
