"use client"
import React, { useEffect, useState, use } from 'react'
import PageLoading from '@/app/_components/_common/PageLoading';
import { getSharedFile } from '@/app/file-requests/api';
import ContentNotFound from '@/app/_components/_common/ContentNotFound';
import FilePreview from './_components/FilePreview';
import { UserCheck2 } from 'lucide-react';
import PasswordPrompt from './_components/PasswordPrompt';
import FileInfo from './_components/FileInfo';
import DownloadBtn from '@/app/_components/_common/DownloadBtn';

function Page({ params }) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [pwdVerified, setPwdVerified] = useState(true);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null)

  useEffect(() => {
    const getContent = async () => {
      try {
        const response = await getSharedFile(id);
        if (response.success) {
            if (response.protected) {
                setPwdVerified(false);
                return
            } else {
                setFile(response.data);
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
  if (!pwdVerified) return <PasswordPrompt fileID={id} setFile={setFile} setPwdVerified={setPwdVerified} />
  if (error) return <ContentNotFound message={error} />

  return (
    <main className='w-full max-w-7xl mx-auto'>
        <p>Jaettu tiedosto:</p>

        <div className='flex flex-col'>
          <h1 className="text-4xl font-bold">{file.name}</h1>
          <p className='flex itmes-center gap-2 text-navlink'><UserCheck2 /> {file.user.name}</p>
        </div>

        <FilePreview file={file} />
        <FileInfo file={file} />
        <DownloadBtn url={file.url} fileName={file.name} />
    </main>
  )
}

export default Page