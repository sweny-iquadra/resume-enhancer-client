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

    // Map variants to brand-aware classes from tailwind.config.js
    const getVariant = () => {
        switch (type) {
            case 'error':
                return {
                    icon: '❌',
                    headerGrad: 'bg-gradient-to-br from-red-600 to-red-500',
                    iconChip: 'bg-red-100 text-red-700',
                    // no brand alert helper for error: use tailwind reds
                    msgBox: 'rounded-xl p-4 border border-red-200 bg-red-50',
                    msgText: 'text-red-700',
                    confirmBtn: 'btn btn-primary',     // use brand primary for destructive confirm
                    cancelBtn: 'btn btn-ghost',
                };
            case 'warning':
                return {
                    icon: '⚠️',
                    headerGrad: 'bg-gradient-to-br from-secondary to-secondary',
                    iconChip: 'bg-yellow-100 text-yellow-700',
                    // brand-provided alert style for warnings
                    msgBox: 'alert alert-warn',
                    msgText: '',
                    confirmBtn: 'btn btn-secondary',   // brand secondary (amber)
                    cancelBtn: 'btn btn-ghost',
                };
            case 'success':
                return {
                    icon: '✅',
                    headerGrad: 'bg-gradient-to-br from-emerald-600 to-emerald-500',
                    iconChip: 'bg-green-100 text-green-700',
                    msgBox: 'rounded-xl p-4 border border-green-200 bg-green-50',
                    msgText: 'text-green-700',
                    confirmBtn: 'btn grad-cta',        // celebratory gradient
                    cancelBtn: 'btn btn-ghost',
                };
            default: // 'info'
                return {
                    icon: 'ℹ️',
                    headerGrad: 'bg-gradient-to-br from-primary to-accent',
                    iconChip: 'bg-primary/10 text-primary',
                    // brand-provided alert style for info
                    msgBox: 'alert alert-info',
                    msgText: '',
                    confirmBtn: 'btn grad-cta',
                    cancelBtn: 'btn btn-ghost',
                };
        }
    };

    const { icon, headerGrad, iconChip, msgBox, msgText, confirmBtn, cancelBtn } = getVariant();

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        } else {
            setShowAlert(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
            onClick={handleOutsideClick}
        >
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 animate-fade-in">
                {/* Header */}
                <div className={`${headerGrad} text-white px-5 py-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconChip}`}>
                            <span className="text-sm">{icon}</span>
                        </div>
                        <h3 className="font-dmsans text-base font-semibold">{title}</h3>
                    </div>
                    <button
                        onClick={() => setShowAlert(false)}
                        className="rounded-full p-2 hover:bg-white/15 transition-colors"
                        aria-label="Close alert"
                    >
                        <span className="text-white text-sm">✕</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-5">
                    <div className={msgBox}>
                        <p className={`text-sm leading-relaxed ${msgText}`}>{message}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 px-5 pb-5">
                    {showCancel && (
                        <button
                            onClick={() => setShowAlert(false)}
                            className={`${cancelBtn}`}
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        onClick={handleConfirm}
                        className={`${confirmBtn}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;
