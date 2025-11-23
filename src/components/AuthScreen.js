import React from 'react';

const AuthScreen = ({ username, setUsername, password, setPassword, handleLoginAttempt, loginError, language }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-vazirmatn" dir={language === 'fa' ? 'rtl' : 'ltr'}>
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center border border-blue-200">
            <h1 className="text-3xl font-bold text-blue-700 mb-6">
                {language === 'fa' ? 'ورود به داشبورد پروژه' : 'Project Dashboard Login'}
            </h1>
            <p className="text-gray-600 mb-8">
                {language === 'fa' ? 'لطفاً نام کاربری و رمز عبور خود را وارد کنید:' : 'Please enter your username and password:'}
            </p>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder={language === 'fa' ? 'نام کاربری' : 'Username'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder={language === 'fa' ? 'رمز عبور' : 'Password'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {loginError && (
                    <p className="text-red-500 text-sm mt-2">{loginError}</p>
                )}
                <button
                    onClick={handleLoginAttempt}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                    {language === 'fa' ? 'ورود' : 'Login'}
                </button>
            </div>
        </div>
    </div>
);

export default AuthScreen;
