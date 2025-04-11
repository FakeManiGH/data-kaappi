import React from 'react';

function PopupLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex flex-col items-center">
        {/* Spinning Loader */}
        <div className="w-16 h-16 border-4 border-t-white border-r-transparent border-b-white border-l-transparent rounded-full animate-spin"></div>
        {/* Loading Text */}
        <p className="mt-4 text-white text-lg font-semibold animate-pulse">Ladataan...</p>
      </div>
    </div>
  );
}

export default PopupLoader;