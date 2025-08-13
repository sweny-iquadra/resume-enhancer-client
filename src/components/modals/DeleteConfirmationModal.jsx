import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {/* Body */}
        <div className="p-6">
          {/* Text */}
          <div className="text-center mb-6">
            <p className="font-dmsans text-neutral-100 text-lg font-semibold">
              Are you sure you want to delete?
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onConfirm();
              }}
              className="btn btn-secondary flex-1"
            >
              Yes
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCancel();
              }}
              className="btn btn-ghost flex-1"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
