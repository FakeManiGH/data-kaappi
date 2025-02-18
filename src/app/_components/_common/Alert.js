import React from 'react';
import { useAlert } from '@/app/contexts/AlertContext';
import { CircleAlert, CircleCheck } from 'lucide-react';

const Alert = () => {
  const { alert } = useAlert();

  if (!alert.isOpen) return null;

  return (
    <div className={`fixed z-50 box-border inset-x-4 md:inset-x-auto md:right-4 bottom-4 md:w-fit flex items-center gap-4 p-4 rounded-lg shadow-black/25 shadow-lg text-white ${alert.type === 'error' ? 'bg-red-500' : 'bg-green-700'}`}>
      {alert.type === 'success' && <CircleCheck size={24} />}
      {alert.type === 'error' && <CircleAlert size={24} />}
      {alert.message}
    </div>
  );
};

export default Alert;