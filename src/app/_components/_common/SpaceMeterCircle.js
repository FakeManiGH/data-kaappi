import React from 'react'
import { translateFileSize } from '@/utils/DataTranslation';

function SpaceMeterCircle({ usedSpace, totalSpace }) {
    const percentage = (usedSpace / totalSpace) * 100; // Adjusted to 100% of the circle
    const strokeDasharray = `${percentage} 100`;

    return (
        <>
        <div className="relative size-40">
            <svg className="rotate-[90deg] size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                {/* Background circle */}
                <circle cx="18" cy="18" r="15" fill="none" className="stroke-current text-background" strokeWidth="4" strokeDasharray="100 25"></circle>
                {/* Progress circle */}
                <circle cx="18" cy="18" r="15" fill="none" className="stroke-current text-primary" strokeWidth="4" strokeDasharray={strokeDasharray}></circle>
            </svg>

            {/* Text */}
            <div className="absolute top-1/2 start-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-lg font-black">{translateFileSize(usedSpace)}</p>
                <p className="text-md">/ {translateFileSize(totalSpace)}</p>
            </div>
        </div>
        </>
    )
}

export default SpaceMeterCircle