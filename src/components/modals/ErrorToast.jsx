import React, { useEffect } from 'react';

const ErrorToast = ({ show, setShow, message }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                setShow(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [show, setShow]);

    if (!show) return null;

    return (
        <div
            className={`fixed top-4 right-4 z-50 transform transition-all duration-500 ease-out ${show
                    ? 'translate-y-0 opacity-100 scale-100'
                    : '-translate-y-full opacity-0 scale-95 pointer-events-none'
                }`}
        >
            <div className="text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm border border-red-400"
                style={{
                    background: 'linear-gradient(135deg, #e53e3e 0%, #f56565 50%, #feb2b2 100%)',
                    boxShadow: '0 8px 25px rgba(229, 62, 62, 0.3)'
                }}>
                <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">!</span>
                    </div>
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-sm">Error</h4>
                    <p className="text-red-100 text-xs mt-1">{message}</p>
                </div>
                <button
                    onClick={() => setShow(false)}
                    className="flex-shrink-0 text-red-200 hover:text-white transition-colors"
                >
                    <span className="text-lg">×</span>
                </button>
            </div>
        </div>
    );
};

export default ErrorToast; 