import React, { createContext, useState, useContext } from 'react';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ message: '', type: '', isOpen: false });

  const showAlert = (message, type = '') => {
    setAlert({ message, type, isOpen: true });
    setTimeout(() => {
      setAlert({ message: '', type: '', isOpen: false });
    }, 3000);
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);