"use client";
import SideNav from './_components/SideNav';
import TopHeader from './_components/TopHeader';
import Footer from './_components/Footer';
import Alert from '../_components/_common/Alert';
import React, { useEffect, Suspense, useState } from 'react';
import PageLoading from '../_components/_common/PageLoading';
import { useUser } from '@clerk/nextjs';
import { useNavigation } from '../contexts/NavigationContext';


function Layout({ children }) {
  const { isLoaded, user } = useUser();
  const { navigatePage } = useNavigation();

  useEffect(() => {
    if (isLoaded && !user) {
      navigatePage('/sign-in');
    }
  }, [isLoaded, user, navigatePage]);

  // Show loading screen while user is being loaded
  if (!isLoaded) return <PageLoading />

  return (
    <>
      <div className="fixed inset-y-0 w-64 hidden md:flex flex-col">
        <SideNav />
      </div>
      <div className='md:ml-64'>
        <TopHeader />
        <Suspense fallback={<PageLoading />}>
          {children}
        </Suspense>
      </div>
      <Footer />
      <Alert />
    </>
  )
}

export default Layout;