import React, { useState } from 'react';
import { generateRandomString } from '@/utils/GenerateRandomString';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from "firebase/firestore";
import FilePreview from './FilePreview';
import AlertMsg from './AlertMsg';
import Alert from '@/app/_components/_common/Alert';
import { validateFile } from '@/utils/FileValidation';
import { app, db } from '@/../firebaseConfig';
import { useUser } from '@clerk/nextjs';

function UploadForm() {
  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  const [alert, setAlert] = useState({ isOpen: false, type: '', message: '', check: false });
  const [uploadProgress, setUploadProgress] = useState([]);
  const storage = getStorage(app);
  const { user } = useUser();

  // Handle file change
  const handleFileChange = (event) => {
    setFileErrors([]);
    let filesArray = [...files];
    let fileErrors = [];

    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      const error = validateFile(file);
      if (error) {
        fileErrors.push(error);
        filesArray = filesArray.filter(f => f !== file);
      } else {
        filesArray.push(file);
      }

    setFiles(filesArray);
    setFileErrors(fileErrors);
    setUploadProgress(new Array(filesArray.length).fill(0));
    };
  };

  // Upload files to Firebase Storage
  const uploadFiles = (files) => {
    files.forEach((file, index) => {
      const metadata = {
        contentType: file?.type
      };
      const fileRef = ref(storage, 'file-base/' + file?.name);
      const uploadTask = uploadBytesResumable(fileRef, file, metadata);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prevProgress) => {
            const newProgress = [...prevProgress];
            newProgress[index] = progress;
            return newProgress;
          });

          if (progress === 100) {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);
              saveFileData(file, downloadURL);
            });
          }
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        () => {
          setFileErrors([]);
          setFiles([]);
          setAlert({ isOpen: true, type: 'error',title: 'Tallennettu' , message: 'Tiedostot tallennettu onnistuneesti!', check: true });
        }
      );
    });
  };

  // Save file data to Firestore
  const saveFileData = async (file, fileUrl) => {
    const docID = generateRandomString(6).toString();
    await setDoc(doc(db, 'files', docID), {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileUrl: fileUrl,
      userEmail: user.primaryEmailAddress.emailAddress,
      userName: user.fullName,
      password: '',
      shortUrl: process.env.NEXT_PUBLIC_BASE_URL + docID,
    });
  };


  // Handle form submit
  const handleSubmit = (event) => {
    event.preventDefault();
    uploadFiles(files);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <form onSubmit={handleSubmit} className="w-full mb-1 text-center">
        <div className="flex items-center justify-center w-full">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-500 border-dashed rounded-xl cursor-pointer bg-contrast hover:bg-contrast2">
            <div className="flex flex-col items-center justify-center p-4 text-center pt-5 pb-6">
              <p className="mb-2 text-xl text-foreground">
                <strong className="text-primary">Klikkaa</strong> tai <strong className="text-primary">tiputa</strong> tiedostoja
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Kuva, Video ja Dokumetti -tiedostot (max. 5Mt / tiedosto)</p>
            </div>
            <input id="dropzone-file" type="file" accept='media_type' className="hidden" multiple onChange={handleFileChange} />
          </label>
        </div>
        <button 
          type="submit" 
          className="mt-4 px-4 py-3 w-[30%] min-w-fit bg-primary text-white rounded-full disabled:bg-secondary disabled:opacity-50"
          {...(files.length === 0 && { disabled: true })}
        >Tallenna</button>
      </form>
      {fileErrors?.length > 0 && fileErrors.map((error, index) => (
        <AlertMsg msg={error} success={false} key={index} />
      ))}
      <FilePreview files={files} removeFile={(file) => setFiles(files.filter(f => f !== file))} uploadProgress={uploadProgress} />
      <Alert alert={alert} setAlert={setAlert} />
    </div>
  );
}

export default UploadForm;