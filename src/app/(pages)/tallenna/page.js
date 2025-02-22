"use client";
import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from "firebase/firestore";
import { app, db } from '@/../firebaseConfig';
import UploadForm from './_components/UploadForm'
import FilePreview from './_components/FilePreview';
import { generateRandomString } from '@/utils/GenerateRandomString';
import { useUser } from '@clerk/nextjs';
import { useAlert } from '@/app/contexts/AlertContext';
import { useNavigation } from '@/app/contexts/NavigationContext'
import { formatDateToCollection } from '@/utils/DataTranslation';
import { getUser, updateUserDocumentValue } from '@/app/file-requests/api';


function Page() {
  const { user } = useUser();
  const { navigatePage } = useNavigation();
  const { showAlert } = useAlert();
  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  const [uploadProgress, setUploadProgress] = useState([]);
  const storage = getStorage(app);

  // Upload file to storage
  const uploadFile = async (file) => {
    const fileID = generateRandomString(11);
    const storageRef = ref(storage, `file-base/${fileID}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setUploadProgress((prevProgress) => prevProgress.map((prog, index) => index === files.indexOf(file) ? progress : prog));
    });

    try {
      await uploadTask;
      const downloadURL = await getDownloadURL(storageRef);
      const shortURL = process.env.NEXT_PUBLIC_BASE_URL + 'tiedosto/' + fileID;
      const fileData = {
        fileID: fileID,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileUrl: downloadURL,
        shortUrl: shortURL,
        shared: false,
        password: '',
        uploadedBy: user.fullName,
        userID: user.id,
        userEmail: user.primaryEmailAddress.emailAddress,
        uploadedAt: formatDateToCollection(new Date())
      };

      await setDoc(doc(db, 'files', fileID), fileData);
      setFiles((prevFiles) => prevFiles.filter(f => f !== file));
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setFileErrors((prevErrors) => [...prevErrors, error.message]);
    }
  }

  return (
    <main className='mt-4'>
      <h1 className='text-2xl md:text-3xl'><strong>Tallenna tiedostoja</strong></h1>
      <p className='text-sm'>Tallenna tiedostoja Datakaappiisi.</p>
      <UploadForm 
        uploadFile={uploadFile} 
        files={files} 
        setFiles={setFiles} 
        fileErrors={fileErrors}
        setFileErrors={setFileErrors}
        setUploadProgress={setUploadProgress}
      />
      <FilePreview 
        files={files} 
        removeFile={(file) => setFiles(files.filter(f => f !== file))} 
        uploadProgress={uploadProgress} 
      />
    </main>
  )
}

export default Page;