
import React from 'react';

const AlertModal = ({
    showAlert,
    setShowAlert,
    title = "Alert",
    message,
    type = "info", // info, warning, error, success
    onConfirm,
    confirmText = "OK",
    showCancel = false,
    cancelText = "Cancel"
}) => {
    if (!showAlert) return null;

    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowAlert(false);
        }
    };

    const getIconAndColors = () => {
        switch (type) {
            case 'error':
                return {
                    icon: '❌',
                    bgGradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                    iconBg: 'bg-red-100',
                    messageText: 'text-red-700',
                    messageBg: 'bg-red-50',
                    messageBorder: 'border-red-200'
                };
            case 'warning':
                return {
                    icon: '⚠️',
                    bgGradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                    iconBg: 'bg-yellow-100',
                    messageText: 'text-yellow-700',
                    messageBg: 'bg-yellow-50',
                    messageBorder: 'border-yellow-200'
                };
            case 'success':
                return {
                    icon: '✅',
                    bgGradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    iconBg: 'bg-green-100',
                    messageText: 'text-green-700',
                    messageBg: 'bg-green-50',
                    messageBorder: 'border-green-200'
                };
            default:
                return {
                    icon: 'ℹ️',
                    bgGradient: 'linear-gradient(135deg, #7f90fa 0%, #6366f1 100%)',
                    iconBg: 'bg-blue-100',
                    messageText: 'text-blue-700',
                    messageBg: 'bg-blue-50',
                    messageBorder: 'border-blue-200'
                };
        }
    };

    const { icon, bgGradient, iconBg, messageText, messageBg, messageBorder } = getIconAndColors();

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        } else {
            setShowAlert(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-start justify-center pt-20 px-4"
            onClick={handleOutsideClick}
        >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 ${iconBg} rounded-full flex items-center justify-center`}>
                            <span className="text-sm">{icon}</span>
                        </div>
                        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
                    </div>
                    <button
                        onClick={() => setShowAlert(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                        <span className="text-sm">✕</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className={`${messageBg} rounded-md p-3 border ${messageBorder}`}>
                        <p className={`${messageText} text-sm leading-relaxed`}>
                            {message}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 p-4 pt-0">
                    {showCancel && (
                        <button
                            onClick={() => setShowAlert(false)}
                            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200 transition-colors"
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 text-sm text-white rounded-md font-medium transition-all duration-200 hover:shadow-md transform hover:scale-[1.02]"
                        style={{ background: bgGradient }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;
