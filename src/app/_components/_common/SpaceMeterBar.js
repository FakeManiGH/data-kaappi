import React from 'react'
import { translateFileSize } from '@/utils/DataTranslation';

function SpaceMeterBar({ usedSpace, totalSpace }) {
    const percentage = (usedSpace / totalSpace) * 100;
    const roundedPercentage = Math.round(percentage);

    return (
        <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center justify-between gap-2 px-1">
                <h3 className="text-md">Tallennustila</h3>
                <p className="text-sm">
                    {translateFileSize(usedSpace)} / {translateFileSize(totalSpace)}
                </p>
            </div>
            <div className="w-full bg-contrast rounded-full relative h-4">
                <div className="bg-primary rounded-full h-4" style={{ width: `${percentage}%` }}></div>
                <p className='text-sm px-1 absolute left-0'>{roundedPercentage}%</p>
            </div>
        </div> 
    )
}

export default SpaceMeterBar