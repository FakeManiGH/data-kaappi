"use client";
import SideNav from './_components/SideNav';
import TopHeader from './_components/TopHeader';
import Footer from './_components/Footer';
import Alert from '../_components/_common/Alert';
import React, { Suspense } from 'react';
import PageLoading from '../_components/_common/PageLoading';
import { useUser } from '@clerk/nextjs';
import { useAlert } from '../contexts/AlertContext';
import { useNavigation } from '../contexts/NavigationContext';

function layout({ children }) {
  const { user, isLoaded } = useUser();
  const { showAlert } = useAlert();
  const { navigatePage } = useNavigation();

  // Show loading screen while user is being loaded
  if (!isLoaded) return <PageLoading />

  // Redirect if user is not logged in
  if (isLoaded && !user) {
    showAlert('error', 'Palveluun pääsy vaatii kirjautumisen');
    navigatePage('/sign-in');
  }

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

export default layout