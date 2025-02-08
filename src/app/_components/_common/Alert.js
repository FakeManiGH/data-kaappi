import { useEffect } from 'react';

const Alert = ({ alert, setAlert }) => {

    /* useEffect(() => {
        if (alert.isOpen) {
            const timer = setTimeout(() => {
                setAlert({ ...alert, isOpen: false });
            }, 5000);
        }
    }, [alert.isOpen]); */

    if (!alert.isOpen) return null;

    return (
        <div className='absolute z-50 flex items-center gap-3 p-4 rounded-md top-3 bg-contrast text-foreground shadow-md text-sm'>
            <div className="flex items-center justify-center">
                {alert.type === 'success' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
            </div>
            <div className='flex flex-col'>
                {alert?.title && <h3 className={`text-lg ${alert.type === 'success' ? 'text-success' : 'text-red-500'}`}>{alert.title}</h3>}
                <p>{alert.message}</p>
            </div>
            
            {alert.check && (
                <button onClick={() => setAlert({ ...alert, isOpen: false })}>Sulje</button>
            )}
        </div>
    );
};

export default Alert;