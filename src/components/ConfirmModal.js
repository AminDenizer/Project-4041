// components/ConfirmModal.js
import React from 'react';

const ConfirmModal = ({ show, message, onConfirm, onCancel, isDeleting, language }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4 font-vazirmatn">
            <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {language === 'fa' ? 'تأیید عملیات' : 'Confirm Action'}
                </h3>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                        disabled={isDeleting}
                    >
                        {language === 'fa' ? 'تأیید' : 'Confirm'}
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                        disabled={isDeleting}
                    >
                        {language === 'fa' ? 'لغو' : 'Cancel'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
