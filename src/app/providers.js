"use client"
import React, { useEffect, useState } from 'react';
import { AlertProvider } from './contexts/AlertContext';
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export function Providers({ children }) {
  const [theme, setTheme] = useState(dark);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mediaQuery.matches ? dark : '');

    const handleChange = (e) => {
      setTheme(e.matches ? dark : '');
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const bgColor = theme === dark ? "#171717" : "#ffffff";

  return (
    <ClerkProvider appearance={
      {
        baseTheme: theme,
        variables: {
          colorPrimary: "#0084ff",
          colorBackground: bgColor,
        },
        userButton: {
          showName: false,
          showAvatar: true,
          variables: {
            borderRadius: "0.3rem",
          },
        },
        signIn: {
          variables: {
            colorPrimary: "#0084ff",
          }
        },
      }
    }>
    <AlertProvider>
      {children}
    </AlertProvider>
    </ClerkProvider>
  )
}