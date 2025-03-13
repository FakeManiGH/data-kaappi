import React from 'react'

function ProgressBar({ progress }) {
  return (
    <div className='text-center w-full bg-gray-300 rounded-full dark:bg-gray-600'>
        <div 
            className={`h-full text-center text-xs text-white rounded-xl ${progress == 100 ? 'bg-success' : 'bg-primary'}`}
            style={{ width: `${progress}%` }}
        >
            {`${Number(progress).toFixed(0)}%`}
        </div>
    </div>
  )
}

export default ProgressBar