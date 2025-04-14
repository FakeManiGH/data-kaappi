"use client"
import React, { useEffect, useState, useRef } from 'react'
import FileNav from './_components/FileNav'
import FileContainer from './_components/FileContainer'
import { useUser } from '@clerk/nextjs'
import { useNavigation } from '@/app/contexts/NavigationContext'
import { useAlert } from '@/app/contexts/AlertContext'
import PageLoading from '@/app/_components/_common/PageLoading'
import SearchBar from './_components/SearchBar'
import SimpleLoading from '@/app/_components/_common/SimpleLoading'
import { ChevronDown } from 'lucide-react'
import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore'
import { db } from '../../../../firebaseConfig'
import { transformFileDataPublic } from '@/utils/DataTranslation'


function Page() {
  const { setCurrentIndex, navigatePage } = useNavigation()
  const { user, isLoaded } = useUser();
  const { showAlert } = useAlert();
  const observerRef = useRef(null);
  const hasFetchedFiles = useRef(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [fileState, setFileState] = useState({
    files: [],
    searchedFiles: [],
    searched: false,
    sortedFiles: [],
    sortedBy: 'date-desc', 
    sorted: false,
  })

  useEffect(() => {
    if (isLoaded && user) {
      if (!hasFetchedFiles.current) {
        fetchFiles();
        hasFetchedFiles.current = true;
      }
      setCurrentIndex('/selaa');
      setPageLoading(false);
    } else {
      navigatePage('/sign-in');
    }
  }, [isLoaded, user, setCurrentIndex, navigatePage]);

  // Files from Firebase
  const fetchFiles = async () => {
    if (contentLoading) return;
    setContentLoading(true);
    try {
      let q = query(
        collection(db, "files"),
        where("userID", "==", user.id),
        where("fileBase", "==", "media"),
        orderBy("uploadedAt", "desc"),
        limit(20)
      );

      if (lastDoc) q = query(q, startAfter(lastDoc));

      const querySnapshot = await getDocs(q);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];

      const files = querySnapshot.docs.map((doc) => doc.data());
      const publicFiles = files.map((file) => transformFileDataPublic(file));

      setLastDoc(lastVisible);
      setHasMore(publicFiles.length === 2)
      setFileState((prevState) => ({
        ...prevState,
        files: [...prevState.files, ...publicFiles]
      }));
    } catch (error) {
      console.error("Error fetching new patch of files: ", error);
    } finally {
      setContentLoading(false);
    }
  }


  // PAGE SCROLL / SEARCH STICKY
  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDelta, setScrollDelta] = useState(0);
  const scrollThreshold = 425 // Hide from top
  const sensitivityThreshold = 20 // Sensitivity

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY

      if (Math.abs(delta) > sensitivityThreshold) {
        if (delta > 0 && currentScrollY > scrollThreshold) {
          // Scrolling down
          setIsVisible(false)
        } else {
          // Scrolling up
          setIsVisible(true)
        }
        setLastScrollY(currentScrollY)
        setScrollDelta(0)
      } else {
        setScrollDelta(scrollDelta + delta)
      }
    }

    const handleMenuBackground = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > scrollThreshold) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    }

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleMenuBackground);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleMenuBackground);
    }
  }, [lastScrollY, scrollThreshold, sensitivityThreshold, scrollDelta])


  if (pageLoading) return <PageLoading />
    
  return (
    <main>
      <div className='flex items-end min-h-72 bg-[url(/images/browse_hero.png)] bg-center bg-contain rounded-lg overflow-hidden'>
        <div className='flex flex-col gap-2 px-6 py-4 w-full bg-black/50 text-white'>
          <h1 className="text-3xl font-black truncate">Selaa mediaa</h1>
          <p className='text-sm'>Selaa kuvia ja muita media-tiedostojasi.</p>
        </div>
      </div>
      
      <div 
        className={`sticky top-0 flex z-10 py-2 gap-2 duration-300 
          ${isVisible ? 'translate-y-0' : '-translate-y-full'}
          ${isSticky ? 'bg-background' : ' bg-transparent'}`}
      > 
        <SearchBar fileState={fileState} setFileState={setFileState} />
        <FileNav fileState={fileState} setFileState={setFileState} />
      </div>  
      <FileContainer 
        fileState={fileState} 
        setFileState={setFileState} 
        contentLoading={contentLoading}
      />

      {!contentLoading && hasMore &&
        <button 
          className='flex items-center gap-1 px-3 py-2 bg-primary text-white text-sm self-center rounded-lg' 
          onClick={() => fetchFiles()}
        >
          <ChevronDown />
          Näytä lisää...
        </button>
      }
      {contentLoading && <SimpleLoading />}
    </main>
  )
}

export default Page