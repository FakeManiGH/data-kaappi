"use client";
import React, { useState, useEffect } from 'react';
import UploadForm from './_components/UploadForm';
import FilePreview from './_components/FilePreview';
import { useUser } from '@clerk/nextjs';
import { useNavigation } from '@/app/contexts/NavigationContext';
import SpaceMeterBar from '@/app/_components/_common/SpaceMeterBar';
import { getUserDocument } from '@/app/file-requests/api';
import { getUserFolders } from '@/app/file-requests/folders';
import PageLoading from '@/app/_components/_common/PageLoading';
import ErrorView from '../_components/ErrorView';
import CreateFolder from './_components/CreateFolder';


function Page() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLoaded = user !== undefined;
  const { setCurrentIndex, navigatePage } = useNavigation();
  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  const [folders, setFolders] = useState([]);
  const [newFolder, setNewFolder] = useState(false);
  const [uploadProgress, setUploadProgress] = useState([]);

  useEffect(() => {
    setCurrentIndex('/tallenna');

    const getUserData = async () => {
      if (isLoaded && user) {
        try {
          const response = await getUserFolders(user.id);
          if (response.success) {
            setFolders(foldersResponse.folders);
          } else {
            throw new Error(foldersResponse.message || "Kansiotietojen hakemisessa tapahtui virhe.")
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
          setError(error.message);
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
  if (error) return <ErrorView message={error} />;

  return (
    <main>
      <div className='flex items-end min-h-72 bg-[url(/images/upload_hero.png)] bg-center bg-contain rounded-lg overflow-hidden'>
        <div className='flex flex-col gap-2 px-6 py-4 w-full bg-black/50 text-white'>
          <h1 className="text-3xl font-black truncate">Tallenna</h1>
          <p className='text-sm'>Lisää tiedostoja kaappiisi.</p>
        </div>
      </div>

  
      <UploadForm 
        files={files} 
        setFiles={setFiles} 
        fileErrors={fileErrors}
        setFileErrors={setFileErrors}
        setUploadProgress={setUploadProgress}
      />

      <FilePreview 
        files={files}
        folders={folders}
        setNewFolder={setNewFolder}
        removeFile={(file) => setFiles(files.filter(f => f !== file))} 
        uploadProgress={uploadProgress}
        setFiles={setFiles}
      />
      
      {newFolder && <CreateFolder setNewFolder={setNewFolder} folders={folders} setFolders={setFolders} files={files} setFiles={setFiles} />}
    </main>
  );
}

export default Page;