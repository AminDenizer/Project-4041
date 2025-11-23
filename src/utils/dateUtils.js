// utils/dateUtils.js
import moment from 'moment-jalaali';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";


/**
 * یک رشته تاریخ میلادی (e.g., '2025-07-22') گرفته و به رشته شمسی (e.g., '1404/05/01') برای نمایش تبدیل می‌کند.
 * @param {string} gregorianDateString - تاریخ در فرمت YYYY-MM-DD.
 * @returns {string} تاریخ شمسی یا 'N/A'
 */
export const formatGregorianToJalaliForDisplay = (gregorianDateString) => {
    if (!gregorianDateString) return 'N/A';
    // با استفاده از moment، رشته میلادی را به فرمت شمسی مورد نظر تبدیل می‌کنیم
    return moment(gregorianDateString, 'YYYY-MM-DD').format('jYYYY/jMM/jDD');
};

/**
 * یک رشته تاریخ میلادی گرفته و برای نمایش انگلیسی فرمت‌بندی می‌کند.
 * @param {string} gregorianDateString - تاریخ در فرمت YYYY-MM-DD.
 * @returns {string} تاریخ میلادی با فرمت جدید یا 'N/A'
 */
export const formatGregorianForDisplay = (gregorianDateString) => {
    if (!gregorianDateString) return 'N/A';
    // فرمت نمایش را می‌توان به 'DD/MM/YYYY' یا هر چیز دیگری تغییر داد
    return moment(gregorianDateString, 'YYYY-MM-DD').format('YYYY/MM/DD');
};

/**
 * یک رشته تاریخ شمسی (e.g., '۱۴۰۴/۰۴/۳۱' یا '1404/04/31') گرفته و به رشته شمسی (e.g., '1404/04/31') برای نمایش تبدیل می‌کند.
 * این تابع ارقام فارسی را به انگلیسی تبدیل کرده و فرمت را استاندارد می‌کند.
 * @param {string} jalaliDateString - تاریخ در فرمت شمسی (مثلاً '۱۴۰۴/۰۴/۳۱' یا '۱۴۰۴-۰۴-۳۱').
 * @returns {string} تاریخ شمسی با ارقام انگلیسی یا 'N/A'
 */
export const formatJalaliStringForJalaliDisplay = (jalaliDateString) => {
    if (!jalaliDateString) return 'N/A';
    // moment-jalaali می‌تواند رشته‌های شمسی را با فرمت‌های مختلف پارس کند
    // و سپس آن را به فرمت استاندارد شمسی (با ارقام انگلیسی) برمی‌گرداند.
    // اضافه کردن 'jYYYY-jMM-jDD' به لیست فرمت‌های قابل تشخیص
    const m = moment(jalaliDateString, ['jYYYY/jMM/jDD', 'jYYYY-jMM-jDD']);
    return m.isValid() ? m.format('jYYYY/jMM/jDD') : 'N/A';
};

/**
 * یک رشته تاریخ شمسی (e.g., '۱۴۰۴/۰۴/۳۱' یا '1404/04/31') گرفته و به رشته میلادی (e.g., '2025/07/22') برای نمایش تبدیل می‌کند.
 * @param {string} jalaliDateString - تاریخ در فرمت شمسی (مثلاً '۱۴۰۴/۰۴/۳۱' یا '۱۴۰۴-۰۴-۳۱').
 * @returns {string} تاریخ میلادی یا 'N/A'
 */
export const convertJalaliStringToGregorianForDisplay = (jalaliDateString) => {
    if (!jalaliDateString) return 'N/A';
    // ابتدا رشته شمسی را با فرمت‌های مختلف پارس می‌کنیم
    const m = moment(jalaliDateString, ['jYYYY/jMM/jDD', 'jYYYY-jMM-jDD']);
    // سپس آن را به فرمت میلادی مورد نظر تبدیل می‌کنیم
    return m.isValid() ? m.format('YYYY/MM/DD') : 'N/A';
};


/**
 * ارقام انگلیسی در یک رشته یا عدد را به معادل فارسی آن‌ها تبدیل می‌کند.
 * @param {string | number} num
 * @returns {string}
 */
export const convertToPersianDigits = (num) => {
    if (num === null || num === undefined) return '';
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, d => persianDigits[d]);
};

/**
 * تنظیمات تقویم و زبان برای استفاده در کامپوننت DatePicker.
 */
export const calendarConfig = {
    fa: {
        calendar: persian,
        locale: persian_fa
    },
    en: {
        calendar: gregorian,
        locale: gregorian_en
    }
};

/**
 * کد CSS برای فونت وزیرمتن را به صفحه تزریق می‌کند تا در کل برنامه در دسترس باشد.
 * این کار فقط یک بار انجام می‌شود.
 */
export const injectVazirFontCss = () => {
    if (!document.getElementById('vazirmatn-font-style')) {
        const style = document.createElement('style');
        style.id = 'vazirmatn-font-style';
        style.innerText = `
            @font-face {
                font-family: 'Vazirmatn';
                src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Regular.woff2') format('woff2');
                font-weight: 400;
                font-style: normal;
                font-display: swap;
            }
            @font-face {
                font-family: 'Vazirmatn';
                src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Bold.woff2') format('woff2');
                font-weight: 700;
                font-style: normal;
                font-display: swap;
            }
            body {
                font-family: 'Vazirmatn', 'Inter', sans-serif;
            }
        `;
        document.head.appendChild(style);
    }
};
