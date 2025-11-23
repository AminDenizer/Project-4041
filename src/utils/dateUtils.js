export const gregorian_to_jalaali = (gy, gm, gd) => {
    let g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
    let jy = (gy <= 1600) ? 0 : 979;
    gy -= (gy <= 1600) ? 621 : 1600;
    let gy2 = (gm > 2) ? (gy + 1) : gy;
    let days = (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
    jy += 33 * Math.floor(days / 12053);
    days %= 12053;
    jy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) {
        jy += Math.floor((days - 1) / 365);
        days = (days - 1) % 365;
    }
    let jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
    let jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
    return [jy, jm, jd];
};

export const convertToPersianDigits = (num) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().split('').map(digit => persianDigits[parseInt(digit)]).join('');
};

export const formatJalaliDate = (date) => {
    const d = new Date(date);
    const [jy, jm, jd] = gregorian_to_jalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    return `${convertToPersianDigits(jy)}/${convertToPersianDigits(jm).padStart(2, '۰')}/${convertToPersianDigits(jd).padStart(2, '۰')}`;
};

export const formatGregorianDate = (date) => {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}/${m}/${day}`;
};

export const formatJalaliHeaderDate = (date) => {
    const d = new Date(date);
    const [jy, jm, jd] = gregorian_to_jalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    const jalaliMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    return `${jalaliMonths[jm - 1]} ${convertToPersianDigits(jd)}`;
};

export const formatGregorianHeaderDate = (date) => {
    const d = new Date(date);
    const m = d.toLocaleString('en-US', { month: 'short' });
    const day = d.getDate();
    return `${m} ${day}`;
};

export const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    // Adjust to make Monday the first day (1) and Sunday the last day (0 becomes 7, so -6 for diff)
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
};

export const getStartOfMonth = (date) => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), 1);
};
