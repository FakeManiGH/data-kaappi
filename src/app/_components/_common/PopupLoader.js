import React from 'react';

function PopupLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex flex-col items-center">
        {/* Spinning Loader */}
        <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent rounded-full animate-spin"></div>
        {/* Loading Text */}
        <p className="mt-4 text-foreground text-lg font-semibold animate-pulse">Ladataan...</p>
      </div>
    </div>
  );
}

export default PopupLoader;