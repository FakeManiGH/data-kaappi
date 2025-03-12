import React from 'react';
import { useAlert } from '@/app/contexts/AlertContext';
import { CircleAlert, CircleCheck, Info } from 'lucide-react';

const Alert = () => {
  const { alert } = useAlert();

  if (!alert.isOpen) return null;

  return (
    <div className={`fixed z-50 box-border bg-background inset-x-4 md:inset-x-auto md:right-4 bottom-4 
      md:w-fit flex items-center gap-4 p-6 shadow-black/25 shadow-lg text-foreground border-t-8
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