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
  const [userDoc, setUserDoc] = useState(null);
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
          const [userDocResponse, foldersResponse] = await Promise.all([
            getUserDocument(user.id),
            getUserFolders(user.id)
          ]);

          if (userDocResponse.success) {
            setUserDoc(userDocResponse.document);
          } else {
            throw new Error(userDocResponse.message || "Käyttäjätietojen hakemisessa tapahtui virhe.");
          }

          if (foldersResponse.success) {
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
      <div className='flex items-end min-h-96 p-2 bg-[url(/images/upload_hero.png)] bg-center bg-contain rounded-lg'>
        <div className='flex flex-col gap-2 px-6 py-4 bg-black/50 rounded-lg text-white'>
          <h1 className="page-title text-6xl font-black truncate"><strong>Tallenna</strong></h1>
          <p className='text-sm'>Talleta tiedostoja kaappiisi.</p>
        </div>
      </div>

  
      <UploadForm 
        files={files} 
        setFiles={setFiles} 
        fileErrors={fileErrors}
        setFileErrors={setFileErrors}
        setUploadProgress={setUploadProgress}
        setUserDoc={setUserDoc}
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