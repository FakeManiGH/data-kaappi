"use client"
import React from 'react';
import { AlertProvider } from './contexts/AlertContext';

export function Providers({ children }) {
  return (
    <AlertProvider>
      {children}
    </AlertProvider>
  )
}