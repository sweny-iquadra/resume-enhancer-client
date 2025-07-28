
import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {/* Modal Text */}
        <div className="text-center mb-6">
          <p className="text-gray-800 text-lg font-medium">
            Are you sure you want to delete?
          </p>
        </div>

        {/* Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onConfirm();
            }}
            className="flex-1 text-white py-3 px-6 rounded-xl font-medium transition-colors"
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)'
            }}
          >
            Yes
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCancel();
            }}
            className="flex-1 bg-white text-black py-3 px-6 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
