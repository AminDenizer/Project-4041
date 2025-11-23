// components/LoginPage.js
import React, { useState } from 'react';
// Removed useNavigate as navigation will be handled by App.js after data loads
import { loginUser } from '../api'; // Import API function

// Receive setError and setLoading as props from App.js
const LoginPage = ({ setLoggedIn, language, setError: setAppError, setLoading }) => { // Renamed setError prop to setAppError
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState(''); // Local error state for login form
    const [isLoggingIn, setIsLoggingIn] = useState(false); // Local loading state for the button

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true); // Activate local button loading spinner
        setError(''); // Clear local error for login form
        setAppError(''); // Clear global error from App.js (for any previous app-wide errors)

        try {
            const data = await loginUser(usernameInput, passwordInput);
            if (data.success) {
                // Call setLoggedIn (which is handleLoginSuccess in App.js)
                // App.js's handleLoginSuccess will then call loadInitialData() and navigate.
                // The global loading spinner will be activated by App.js before loadInitialData.
                setLoggedIn(data.role, data.username, data.timeTableUrl);
                // No setIsLoggingIn(false) here, as the component will unmount/re-render
                // and App.js's global loading will take over.
            } else {
                setError(data.message || (language === 'fa' ? 'ورود ناموفق بود.' : 'Login failed.'));
                setIsLoggingIn(false); // If login fails, turn off button loading
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || (language === 'fa' ? 'خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.' : 'An error occurred during login. Please try again.'));
            setIsLoggingIn(false); // If an error occurs, turn off button loading
        } finally {
            // No global setLoading(false) here. App.js's loadInitialData handles that.
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-vazirmatn" dir={language === 'fa' ? 'rtl' : 'ltr'}>
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center border border-blue-200">
                <h1 className="text-3xl font-bold text-blue-700 mb-6">
                    {language === 'fa' ? 'ورود به داشبورد مدیریتی' : 'Management Dashboard Login'}
                </h1>
                <p className="text-gray-600 mb-8">
                    {language === 'fa' ? 'لطفاً نام کاربری و رمز عبور خود را وارد کنید:' : 'Please enter your username and password:'}
                </p>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder={language === 'fa' ? 'نام کاربری' : 'Username'}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        required
                        disabled={isLoggingIn} // Disable input while logging in
                    />
                    <input
                        type="password"
                        placeholder={language === 'fa' ? 'رمز عبور' : 'Password'}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        required
                        disabled={isLoggingIn} // Disable input while logging in
                    />
                    {error && ( // Using local error state for LoginPage
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                    <button
                        onClick={handleLogin}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center"
                        disabled={isLoggingIn} // Disable button while logging in
                    >
                        {isLoggingIn ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            language === 'fa' ? 'ورود' : 'Login'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
