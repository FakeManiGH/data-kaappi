"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useNavigation } from '@/app/contexts/NavigationContext';
import { getUserFolders } from '@/app/file-requests/folders';
import PageLoading from '@/app/_components/_common/PageLoading';
import ErrorView from '../_components/ErrorView';
import FileUploadForm from '../_components/_forms/FileUploadForm';
import ContentNotFound from '@/app/_components/_common/ContentNotFound';
import CreateNewFolder from '../_components/_modals/CreateNewFolderPopup';


function Page() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState(null);
  const [serverError, setServerError] = useState(null);
  const { setCurrentIndex, navigatePage } = useNavigation();
  const [folders, setFolders] = useState([]);
  const [createFolder, setCreateFolder] = useState(false);

  useEffect(() => {
    setCurrentIndex('/tallenna');

    const getUserData = async () => {
      if (isLoaded && user) {
        try {
          const response = await getUserFolders(user.id);
          if (response.success) {
            setFolders(response.folders);
          } else {
            setDataError(response.message)
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
          setServerError("Virhe hakiessa käyttäjätietoja: " + error.message)
        } finally {
          setLoading(false);
        }
      } else {
        navigatePage('/sign-in');
      }
    };
    
    getUserData();
  }, [isLoaded, user, setCurrentIndex, navigatePage]);
  

  if (loading) return <PageLoading />;
  if (dataError) return <ContentNotFound message={dataError} />
  if (serverError) return <ErrorView message={error} />;

  return (
    <main>
      <div className='flex items-end min-h-72 bg-[url(/images/upload_hero.png)] bg-center bg-contain  overflow-hidden'>
        <div className='flex flex-col gap-2 px-6 py-4 w-full bg-black/50 text-white'>
          <h1 className="text-3xl font-black truncate">Tallenna</h1>
          <p className='text-sm'>Lisää tiedostoja kaappiisi.</p>
        </div>
      </div>

      <FileUploadForm folders={folders} setCreateFolder={setCreateFolder} />
      
      {createFolder && <CreateNewFolder setNewFolderPopup={setCreateFolder} folders={folders} setFolders={setFolders} />}
    </main>
  );
}

export default Page;