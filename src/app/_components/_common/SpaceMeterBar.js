import React from 'react'
import { translateFileSize } from '@/utils/DataTranslation';

function SpaceMeterBar({ usedSpace, totalSpace }) {
    const percentage = (usedSpace / totalSpace) * 100;
    const roundedPercentage = Math.round(percentage);

    return (
        <div className="relative flex flex-col gap-1 w-full">
            <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm">Tallennustila</h3>
                <p className="text-sm text-navlink">
                    {translateFileSize(usedSpace)} / {translateFileSize(totalSpace)}
                </p>
            </div>
            <div className="w-full bg-gradient-to-b from-secondary to-contrast h-5 overflow-hidden">
                <span className="bg-gradient-to-b from-blue-800 via-primary to-blue-800 h-5" style={{ width: `${percentage}%` }}></span>
            </div>
        
            <p className={`text-sm absolute top-[105%] left-${roundedPercentage}`}>{roundedPercentage}%</p>  
        </div> 
    )
}

export default SpaceMeterBar