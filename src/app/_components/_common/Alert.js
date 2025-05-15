import React from 'react';
import { useAlert } from '@/app/contexts/AlertContext';
import { CircleAlert, CircleCheck, Info } from 'lucide-react';

const Alert = () => {
  const { alert } = useAlert();

  if (!alert.isOpen) return null;

  return (
    <div className={`fixed z-50 bottom-4 px-4 py-6 ml-auto inset-x-4 max-w-xl bg-white dark:bg-black 
      flex items-center gap-4 shadow-black/50 shadow-lg 
      ${alert.type === 'error' ? 'border-red-500' : (alert.type === 'success' ? 'border-success' : 'border-primary')}`
    }>
      {alert.type === 'success' && <CircleCheck className='text-success' size={24} />}
      {alert.type === 'error' && <CircleAlert className='text-red-500' size={24} />}
      {alert.type === 'info' && <Info className='text-primary' size={24} />}
      {alert.message}
    </div>
  );
};

export default Alert;