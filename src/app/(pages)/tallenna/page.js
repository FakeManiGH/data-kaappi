"use client";
import React, { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { app, db } from '@/../firebaseConfig';
import UploadForm from './_components/UploadForm'
import FilePreview from './_components/FilePreview';
import { generateRandomString } from '@/utils/GenerateRandomString';
import { useUser } from '@clerk/nextjs';
import { useNavigation } from '@/app/contexts/NavigationContext'
import { formatDateToCollection } from '@/utils/DataTranslation';


function Page() {
  const { user } = useUser();
  const { setCurrentIndex } = useNavigation();
  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  const [uploadProgress, setUploadProgress] = useState([]);
  const storage = getStorage(app);
  
  useEffect(() => {
    setCurrentIndex('/tallenna');
  }, [setCurrentIndex]);

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
        fileID: fileID, // String
        fileName: file.name,  // String
        fileSize: parseInt(file.size), // Number
        fileType: file.type, // String
        fileUrl: downloadURL, // String
        shortUrl: shortURL, // String
        shared: false,  // Boolean
        password: '', // String
        uploadedBy: user.fullName, // String
        userID: user.id,  // String
        userEmail: user.primaryEmailAddress.emailAddress, // String
        uploadedAt: Timestamp.fromDate(new Date())  // Firestore timestamp
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