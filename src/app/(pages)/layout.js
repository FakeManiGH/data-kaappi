"use client";
import SideNav from './_components/SideNav';
import TopHeader from './_components/TopHeader';
import Footer from './_components/Footer';
import Alert from '../_components/_common/Alert';

function layout({ children }) {

  return (
    <>
      <div className="fixed inset-y-0 w-64 hidden md:flex flex-col">
        <SideNav />
      </div>
      <div className='md:ml-64'>
        <TopHeader />
        {children}
      </div>
      <Footer />
      <Alert />
    </>
  )
}

export default layout