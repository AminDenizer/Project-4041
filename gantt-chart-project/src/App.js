import React, { useState, useEffect, useRef, useCallback } from 'react';

// Import components
import AuthScreen from './components/AuthScreen';
import DashboardHeader from './components/DashboardHeader';
import AdminControls from './components/AdminControls';
import ViewModeSelector from './components/ViewModeSelector';
import DayColorLegend from './components/DayColorLegend';
import GanttChart from './components/GanttChart';
import TaskTooltip from './components/TaskTooltip';
import LLMModal from './components/LLMModal';

// Import utilities and constants
import { gregorian_to_jalaali, convertToPersianDigits, formatJalaliDate, formatGregorianDate, formatJalaliHeaderDate, formatGregorianHeaderDate, getStartOfWeek, getStartOfMonth } from './utils/dateUtils';
import { parseMarkdownToHtml } from './utils/markdownParser';
import { GEMINI_API_KEY, backendBaseUrl, currentAppId, dayColors, dayNamesFa, dayNamesEn, reportCategories } from './constants/appConstants';

// Inject the font CSS once when the app loads
import './styles/vazirFont'; // This file will contain the font injection logic

function App() {
    const [language, setLanguage] = useState('fa');
    const [loggedInUserRole, setLoggedInUserRole] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [availableUsers, setAvailableUsers] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);

    const [viewingUser, setViewingUser] = useState(null);

    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipContent, setTooltipContent] = useState({});
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const [show30HourReportDropdown, setShow30HourReportDropdown] = useState(false);
    const [showTwoWeekReportDropdown, setShowTwoWeekReportDropdown] = useState(false);

    const [viewMode, setViewMode] = useState('daily');

    const [showLLMModal, setShowLLMModal] = useState(false);
    const [selectedTaskForLLM, setSelectedTaskForLLM] = useState(null);
    const [llmDetails, setLlmDetails] = useState('');
    const [llmBreakdown, setLlmBreakdown] = useState('');
    const [llmRiskAssessment, setLlmRiskAssessment] = useState('');
    const [llmResourceSuggestions, setLlmResourceSuggestions] = useState('');
    const [llmLoadingDetails, setLlmLoadingDetails] = useState(false);
    const [llmErrorDetails, setLlmErrorDetails] = useState('');
    const [llmLoadingBreakdown, setLlmLoadingBreakdown] = useState(false);
    const [llmErrorBreakdown, setLlmErrorBreakdown] = useState('');
    const [llmLoadingRisk, setLlmLoadingRisk] = useState(false);
    const [llmErrorRisk, setLlmErrorRisk] = useState('');
    const [llmLoadingResources, setLlmLoadingResources] = useState(false);
    const [llmErrorResources, setLlmErrorResources] = useState('');
    const [activeLLMTab, setActiveLLMTab] = useState('details');

    const [dataLoading, setDataLoading] = useState(true);
    const [dataError, setDataError] = useState('');

    const [reportLinks, setReportLinks] = useState([]);
    const [userTimeTableUrl, setUserTimeTableUrl] = useState(null);
    const [dynamicReportSubCategories, setDynamicReportSubCategories] = useState([]);

    const ganttChartRef = useRef(null);
    const [ganttChartWidth, setGanttChartWidth] = useState(0);

    // Effect for updating gantt chart width on mount and resize
    useEffect(() => {
        const updateDimensions = () => {
            if (ganttChartRef.current) {
                setGanttChartWidth(ganttChartRef.current.offsetWidth);
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // --- Data Fetching Functions ---
    // Removed 'language' from dependencies as data fetching itself is not language dependent
    const fetchUsers = useCallback(async () => {
        setDataError('');
        try {
            const response = await fetch(`${backendBaseUrl}/users/${currentAppId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setAvailableUsers(data);
        } catch (e) {
            setDataError(language === 'fa' ? `خطا در دریافت کاربران: ${e.message}` : `Failed to fetch users: ${e.message}`);
            console.error("Error fetching users:", e);
        }
    }, [currentAppId, backendBaseUrl]); // Dependencies are now stable

    const fetchTasks = useCallback(async () => {
        setDataError('');
        try {
            const response = await fetch(`${backendBaseUrl}/tasks/${currentAppId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const fetchedTasks = data.map(task => ({
                ...task,
                startDate: task.startDate ? new Date(task.startDate) : null,
                endDate: task.endDate ? new Date(task.endDate) : null,
            }));
            fetchedTasks.sort((a, b) => (a.startDate?.getTime() || 0) - (b.startDate?.getTime() || 0));
            setAllTasks(fetchedTasks);
        } catch (e) {
            setDataError(language === 'fa' ? `خطا در دریافت تسک‌ها: ${e.message}` : `Failed to fetch tasks: ${e.message}`);
            console.error("Error fetching tasks:", e);
        }
    }, [currentAppId, backendBaseUrl]); // Dependencies are now stable

    const fetchReportLinks = useCallback(async () => {
        setDataError('');
        try {
            const response = await fetch(`${backendBaseUrl}/reportLinks/${currentAppId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const filteredLinks = data.filter(link => link.url);
            setReportLinks(filteredLinks);
        } catch (e) {
            setDataError(language === 'fa' ? `خطا در دریافت لینک‌های گزارش: ${e.message}` : `Failed to fetch report links: ${e.message}`);
            console.error("Error fetching report links:", e);
        }
    }, [currentAppId, backendBaseUrl]); // Dependencies are now stable

    const fetchSubCategories = useCallback(async () => {
        setDataError('');
        try {
            const response = await fetch(`${backendBaseUrl}/reportSubCategories/${currentAppId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setDynamicReportSubCategories(data);
        } catch (e) {
            setDataError(language === 'fa' ? `خطا در دریافت زیردسته‌های گزارش: ${e.message}` : `Failed to fetch report sub-categories: ${e.message}`);
            console.error("Error fetching report sub-categories:", e);
        }
    }, [currentAppId, backendBaseUrl]); // Dependencies are now stable


    // Initial data fetch on component mount or login status change
    useEffect(() => {
        const storedRole = localStorage.getItem('userRole');
        const storedUsername = localStorage.getItem('username');
        if (storedRole && storedUsername) {
            setLoggedInUserRole(storedRole);
            setUsername(storedUsername);
            setViewingUser(storedRole === 'admin' ? 'admin' : storedUsername);
            setDataLoading(true);
            Promise.all([fetchUsers(), fetchTasks(), fetchReportLinks(), fetchSubCategories()])
                .finally(() => setDataLoading(false));
        } else {
            setDataLoading(false);
        }
    }, [fetchUsers, fetchTasks, fetchReportLinks, fetchSubCategories]);


    // Filtering tasks based on logged-in user role and viewing user
    useEffect(() => {
        if (loggedInUserRole === 'admin') {
            if (viewingUser && viewingUser !== 'admin') {
                setFilteredTasks(allTasks.filter(task => task.ownerId === viewingUser));
                const selectedUser = availableUsers.find(u => u.username === viewingUser);
                setUserTimeTableUrl(selectedUser ? selectedUser.timeTableUrl : null);
            } else {
                setFilteredTasks(allTasks);
                setUserTimeTableUrl(null);
            }
        } else if (loggedInUserRole && username) {
            setFilteredTasks(allTasks.filter(task => task.ownerId === username));
            const currentUser = availableUsers.find(u => u.username === username);
            setUserTimeTableUrl(currentUser ? currentUser.timeTableUrl : null);
        } else {
            setFilteredTasks([]);
            setUserTimeTableUrl(null);
        }
    }, [loggedInUserRole, allTasks, viewingUser, username, availableUsers]);

    // Login function
    const handleLoginAttempt = useCallback(async () => {
        setLoginError('');
        setDataLoading(true);
        try {
            const response = await fetch(`${backendBaseUrl}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, appId: currentAppId }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setLoggedInUserRole(data.role);
                setUsername(data.username);
                setViewingUser(data.role === 'admin' ? 'admin' : data.username);
                setLoginError('');
                localStorage.setItem('userRole', data.role);
                localStorage.setItem('username', data.username);
                await Promise.all([fetchUsers(), fetchTasks(), fetchReportLinks(), fetchSubCategories()]);
            } else {
                setLoginError(data.message || (language === 'fa' ? 'نام کاربری یا رمز عبور اشتباه است.' : 'Invalid username or password.'));
            }
        } catch (e) {
            setLoginError(language === 'fa' ? `خطا در ارتباط با سرور: ${e.message}` : `Error communicating with server: ${e.message}`);
            console.error("Login backend call failed:", e);
        } finally {
            setDataLoading(false);
        }
    }, [username, password, language, fetchUsers, fetchTasks, fetchReportLinks, fetchSubCategories, currentAppId, backendBaseUrl]);

    const handleLogout = useCallback(() => {
        setLoggedInUserRole(null);
        setUsername('');
        setViewingUser(null);
        setFilteredTasks([]);
        setPassword('');
        setLoginError('');
        setUserTimeTableUrl(null);
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
    }, []);

    // Reverted useCallback for toggleLanguage. The setDataLoading(false) is removed as it's not needed here.
    const toggleLanguage = useCallback(() => {
        setLanguage(prevLang => (prevLang === 'fa' ? 'en' : 'fa'));
        // No setDataLoading(false) needed here, as language toggle doesn't initiate data loading.
    }, []); 

    const downloadFile = useCallback((url, fileName) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, []);

    const getReportLinksForUserAndCategory = useCallback((user, category) => {
        if (!reportLinks || reportLinks.length === 0) return [];
        return reportLinks.filter(link =>
            (link.ownerId === user || link.ownerId === 'All') && link.reportCategory === category
        ).sort((a, b) => {
            if (a.reportSubCategory === 'Overall') return -1;
            if (b.reportSubCategory === 'Overall') return 1;
            const numA = parseInt(a.reportSubCategory.replace('Report ', ''), 10);
            const numB = parseInt(b.reportSubCategory.replace('Report ', ''), 10);
            if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
            }
            return a.reportSubCategory.localeCompare(b.reportSubCategory);
        });
    }, [reportLinks]);

    // LLM API calls wrapped in useCallback
    const generateTaskDetails = useCallback(async (task) => {
        setLlmLoadingDetails(true);
        setLlmErrorDetails('');
        setLlmDetails('');

        const prompt = language === 'fa'
            ? `جزئیات بیشتری در مورد این تسک پروژه ارائه دهید: "${task.fa}". این جزئیات باید شامل توضیحات عمیق‌تر، مراحل احتمالی، و هر اطلاعات مرتبط دیگری باشد که به درک بهتر تسک کمک کند. پاسخ را به زبان فارسی ارائه دهید.`
            : `Provide more details about this project task: "${task.en}". These details should include potential sub-steps, key considerations, and any other relevant information that helps in better understanding the task. Provide the response in English.`;

        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        const payload = { contents: chatHistory };
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setLlmDetails(parseMarkdownToHtml(text));
            } else {
                setLlmErrorDetails(language === 'fa' ? 'خطا در دریافت جزئیات تسک از هوش مصنوعی.' : 'Error getting task details from AI.');
                console.error("ساختار پاسخ LLM غیرمنتظره برای جزئیات:", result);
            }
        } catch (error) {
            setLlmErrorDetails(language === 'fa' ? `خطا در ارتباط با هوش مصنوعی: ${error.message}` : `Error communicating with AI: ${error.message}`);
            console.error("فراخوانی API LLM برای جزئیات با شکست مواجه شد:", error);
        } finally {
            setLlmLoadingDetails(false);
        }
    }, [language]);

    const generateTaskBreakdown = useCallback(async (task) => {
        setLlmLoadingBreakdown(true);
        setLlmErrorBreakdown('');
        setLlmBreakdown('');

        const prompt = language === 'fa'
            ? `تسک پروژه زیر را به ۳ تا ۵ زیرتسک جزئی تقسیم کنید. برای هر زیرتسک، یک توضیح مختصر ارائه دهید. پاسخ را به صورت یک لیست شماره‌گذاری شده برگردانید. تسک: "${task.fa}"`
            : `Break down the following project task into 3 to 5 detailed sub-tasks. For each sub-task, provide a brief description. Return the response as a numbered list. Task: "${task.en}"`;

        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        const payload = { contents: chatHistory };
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setLlmBreakdown(parseMarkdownToHtml(text));
            } else {
                setLlmErrorBreakdown(language === 'fa' ? 'خطا در دریافت تقسیم‌بندی تسک از هوش مصنوعی.' : 'Error getting task breakdown from AI.');
                console.error("ساختار پاسخ LLM غیرمنتظره برای تفکیک:", result);
            }
        } catch (error) {
            setLlmErrorBreakdown(language === 'fa' ? `خطا در ارتباط با هوش مصنوعی: ${error.message}` : `Error communicating with AI: ${error.message}`);
            console.error("فراخوانی API LLM برای تفکیک با شکست مواجه شد:", error);
        } finally {
            setLlmLoadingBreakdown(false);
        }
    }, [language]);

    const generateTaskRiskAssessment = useCallback(async (task) => {
        setLlmLoadingRisk(true);
        setLlmErrorRisk('');
        setLlmRiskAssessment('');

        const prompt = language === 'fa'
            ? `ریسک‌های احتمالی، چالش‌ها و راهکارهای کاهش ریسک برای تسک پروژه زیر را ارائه دهید: "${task.fa}". پاسخ را به صورت یک لیست شماره‌گذاری شده برگردانید. هر ریسک را توضیح داده و راهکار مربوطه را ذکر کنید.`
            : `Provide potential risks, challenges, and mitigation strategies for the following project task: "${task.en}". Return the response as a numbered list. Explain each risk and its corresponding mitigation.`;

        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        const payload = { contents: chatHistory };
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setLlmRiskAssessment(parseMarkdownToHtml(text));
            } else {
                setLlmErrorRisk(language === 'fa' ? 'خطا در دریافت ارزیابی ریسک از هوش مصنوعی.' : 'Error getting risk assessment from AI.');
                console.error("ساختار پاسخ LLM غیرمنتظره برای ارزیابی ریسک:", result);
            }
        } catch (error) {
            setLlmErrorRisk(language === 'fa' ? `خطا در ارتباط با هوش مصنوعی: ${error.message}` : `Error communicating with AI: ${error.message}`);
            console.error("فراخوانی API LLM برای ارزیابی ریسک با شکست مواجه شد:", error);
        } finally {
            setLlmLoadingRisk(false);
        }
    }, [language]);

    const generateResourceSuggestions = useCallback(async (task) => {
        setLlmLoadingResources(true);
        setLlmErrorResources('');
        setLlmResourceSuggestions('');

        const prompt = language === 'fa'
            ? `منابع مورد نیاز (مانند مهارت‌ها، ابزارها، نرم‌افزارها، کتابخانه‌ها/APIهای خارجی) برای تکمیل تسک پروژه زیر را پیشنهاد دهید: "${task.fa}". پاسخ را به صورت یک لیست شماره‌گذاری شده برگردانید. هر منبع را توضیح داده و دلیل نیاز به آن را ذکر کنید.`
            : `Suggest necessary resources (e.g., skills, tools, software, external libraries/APIs) to complete the following project task: "${task.en}". Return the response as a numbered list. Explain each resource and why it's needed.`;

        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        const payload = { contents: chatHistory };
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setLlmResourceSuggestions(parseMarkdownToHtml(text));
            } else {
                setLlmErrorResources(language === 'fa' ? 'خطا در دریافت پیشنهاد منابع از هوش مصنوعی.' : 'Error getting resource suggestions from AI.');
                console.error("ساختار پاسخ LLM غیرمنتظره برای منابع:", result);
            }
        } catch (error) {
            setLlmErrorResources(language === 'fa' ? `خطا در ارتباط با هوش مصنوعی: ${error.message}` : `Error communicating with AI: ${error.message}`);
            console.error("فراخوانی API LLM برای منابع با شکست مواجه شد:", error);
        } finally {
            setLlmLoadingResources(false);
        }
    }, [language]);


    const handleTaskClickForLLM = useCallback((task) => {
        setSelectedTaskForLLM(task);
        setShowLLMModal(true);
        setActiveLLMTab('details');
        // Details will be generated by LLMModal's useEffect when it mounts/becomes active
    }, []);

    const handleMouseEnterTask = useCallback((e, task) => {
        setShowTooltip(true);
        setTooltipContent(task);
        setTooltipPosition({ x: e.clientX + 10, y: e.clientY + 10 });
    }, []);

    const handleMouseLeaveTask = useCallback(() => {
        setShowTooltip(false);
    }, []);

    const allDates = filteredTasks.flatMap(task => [task.startDate, task.endDate]).filter(Boolean);
    const minDate = allDates.length > 0 ? new Date(Math.min(...allDates.map(d => d.getTime()))) : new Date();
    const maxDate = allDates.length > 0 ? new Date(Math.max(...allDates.map(d => d.getTime()))) : new Date();


    if (!loggedInUserRole) {
        return (
            <AuthScreen
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                handleLoginAttempt={handleLoginAttempt}
                loginError={loginError}
                language={language}
            />
        );
    }

    if (dataLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 font-vazirmatn">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                <p className="mt-4 text-gray-700">{language === 'fa' ? 'در حال بارگذاری اطلاعات پروژه...' : 'Loading project data...'}</p>
            </div>
        );
    }

    if (dataError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4 font-vazirmatn text-red-700">
                <h2 className="text-xl font-bold mb-4">{language === 'fa' ? 'خطا در بارگذاری پروژه!' : 'Error Loading Project!'}</h2>
                <p>{dataError}</p>
                <p className="mt-4">{language === 'fa' ? 'لطفاً صفحه را رفرش کنید یا با پشتیبانی تماس بگیرید.' : 'Please refresh the page or contact support.'}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-vazirmatn flex flex-col items-center" dir={language === 'fa' ? 'rtl' : 'ltr'}>
            <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200 flex flex-col flex-grow">
                <DashboardHeader
                    language={language}
                    toggleLanguage={toggleLanguage}
                    loggedInUserRole={loggedInUserRole}
                    username={username}
                    handleLogout={handleLogout}
                    show30HourReportDropdown={show30HourReportDropdown}
                    setShow30HourReportDropdown={setShow30HourReportDropdown}
                    showTwoWeekReportDropdown={showTwoWeekReportDropdown}
                    setShowTwoWeekReportDropdown={setShowTwoWeekReportDropdown}
                    getReportLinksForUserAndCategory={getReportLinksForUserAndCategory}
                    downloadFile={downloadFile}
                    userTimeTableUrl={userTimeTableUrl}
                    viewingUser={viewingUser}
                    dynamicReportSubCategories={dynamicReportSubCategories}
                />

                <div className="text-lg text-gray-700 mb-4">
                    {language === 'fa' ? 'کاربر وارد شده:' : 'Logged in as:'}{' '}
                    <span className="font-bold text-blue-600">{loggedInUserRole}</span>
                </div>

                <AdminControls
                    loggedInUserRole={loggedInUserRole}
                    availableUsers={availableUsers}
                    setViewingUser={setViewingUser}
                    viewingUser={viewingUser}
                    language={language}
                />

                <ViewModeSelector
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    language={language}
                />

                <DayColorLegend language={language} />

                {filteredTasks.length === 0 && (
                    <div className="text-center text-gray-500 py-10">
                        {language === 'fa' ? 'وظیفه ای برای نمایش وجود ندارد.' : 'No tasks to display.'}
                    </div>
                )}

                {filteredTasks.length > 0 && (
                    <GanttChart
                        filteredTasks={filteredTasks}
                        ganttChartRef={ganttChartRef}
                        ganttChartWidth={ganttChartWidth}
                        viewMode={viewMode}
                        language={language}
                        minDate={minDate}
                        maxDate={maxDate}
                        handleMouseEnterTask={handleMouseEnterTask}
                        handleMouseLeaveTask={handleMouseLeaveTask}
                        handleTaskClickForLLM={handleTaskClickForLLM}
                    />
                )}
            </div>

            <TaskTooltip
                showTooltip={showTooltip}
                tooltipPosition={tooltipPosition}
                tooltipContent={tooltipContent}
                language={language}
            />

            <LLMModal
                showLLMModal={showLLMModal}
                setShowLLMModal={setShowLLMModal}
                selectedTaskForLLM={selectedTaskForLLM}
                language={language}
                llmLoadingDetails={llmLoadingDetails}
                llmErrorDetails={llmErrorDetails}
                llmDetails={llmDetails}
                llmLoadingBreakdown={llmLoadingBreakdown}
                llmErrorBreakdown={llmErrorBreakdown}
                llmBreakdown={llmBreakdown}
                llmLoadingRisk={llmLoadingRisk}
                llmErrorRisk={llmErrorRisk}
                llmRiskAssessment={llmRiskAssessment}
                llmLoadingResources={llmLoadingResources}
                llmErrorResources={llmErrorResources}
                llmResourceSuggestions={llmResourceSuggestions}
                activeLLMTab={activeLLMTab}
                setActiveLLMTab={setActiveLLMTab}
                generateTaskDetails={generateTaskDetails}
                generateTaskBreakdown={generateTaskBreakdown}
                generateTaskRiskAssessment={generateTaskRiskAssessment}
                generateResourceSuggestions={generateResourceSuggestions}
            />
        </div>
    );
}

export default App;
