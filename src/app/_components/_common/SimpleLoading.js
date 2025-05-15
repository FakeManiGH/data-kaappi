import React from 'react'

function SimpleLoading() {
    return (
    <div className="flex items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-t-foreground border-r-transparent border-b-foreground border-l-transparent rounded-full animate-spin"></div>
        <p className="text-white text-lg font-semibold animate-pulse">Ladataan...</p>
      </div>
    )
}

export default SimpleLoading