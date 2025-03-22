"use client"
import React, { useEffect, useState, use } from 'react'
import PageLoading from '@/app/_components/_common/PageLoading';
import { getSharedContent } from '@/app/file-requests/api';
import ContentNotFound from '@/app/_components/_common/ContentNotFound';
import FilePreview from './_components/FilePreview';
import { UserCheck2 } from 'lucide-react';

function Page({ params }) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState(null)
  const [folder, setFolder] = useState(null);
  const [error, setError] = useState(null)

  useEffect(() => {
    const getContent = async () => {
      try {
        const response = await getSharedContent(id);
        if (response.success) {
          if (response.type === 'file') {
            setFile(response.data);
          } else if (response.type === 'folder') {
            setFolder(response.data.folder); 
            setFiles(response.data.publicFiles);
          }
        } else {
          setError(response.message);
        }
      } catch (error) {
        console.error("Error fetching shared content:", error);
        setError("Sisällön hakemisessa tapahtui virhe, yritä uudelleen.");
      } finally {
        setLoading(false);
      }
    };

    getContent();
  }, [id]);

  if (loading) return <PageLoading />;
  if (error) return <ContentNotFound message={error} />

  return (
    <main className='w-full max-w-7xl mx-auto'>
      {file && (
        <>
        <div className='flex flex-col'>
          <h1 className="text-2xl font-bold">{file.name}</h1>
          <p className='flex itmes-center gap-2 text-navlink'><UserCheck2 /> {file.user.name}</p>
        </div>

        <FilePreview file={file} />
        </>
      )}

      {folder && (
        <div>
          <h1 className="text-2xl font-bold">{folder.folder.name}</h1>
          <p>{folder.user.name}</p>
          <ul>
            {files.map((file) => (
              <li key={file.id}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}

export default Page