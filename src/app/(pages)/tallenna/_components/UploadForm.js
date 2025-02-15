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
import { useRouter } from 'next/navigation';
import { useAlert } from '@/app/contexts/AlertContext';

function UploadForm() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  const [uploadProgress, setUploadProgress] = useState([]);
  const { showAlert } = useAlert();
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
      const uniqueFileName = `${file?.name}_${generateRandomString(6)}`;
      const fileRef = ref(storage, 'file-base/' + uniqueFileName);
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
        },
        (error) => {
          console.error('Upload failed:', error);
          setFileErrors((prevErrors) => [...prevErrors, error.message]);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await saveFileData(file, downloadURL, uniqueFileName);
            showAlert('Tiedosto(t) tallennettu onnistuneesti!', 'success');
            setTimeout(() => {
              setFileErrors([]);
              setFiles([]);
              setUploadProgress([]);
              router.push('/tiedostot');
            }, 2000);
          } catch (error) {
            showAlert('Tiedoston tallennus epäonnistui!', 'error');
            console.error('Error getting download URL or saving file data:', error);
            setFileErrors((prevErrors) => [...prevErrors, error.message]);
          }
        }
      );
    });
  };

  // Save file data to Firestore
  const saveFileData = async (file, fileUrl, uniqueFileName) => {
    const docID = generateRandomString(6).toString();
    const fileDocRef = doc(db, 'files', docID);
    const shortUrl = process.env.NEXT_PUBLIC_BASE_URL + 'tiedosto/' + docID;

    await setDoc(fileDocRef, {
      fileID: docID,
      fileName: uniqueFileName,
      fileSize: file.size,
      fileType: file.type,
      fileUrl: fileUrl,
      owner: user.id,
      userEmail: user.primaryEmailAddress.emailAddress,
      shared: false,
      password: '',
      shortUrl: shortUrl,
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
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border border-foreground border-dashed rounded-xl cursor-pointer hover:border-primary">
            <div className="flex flex-col items-center justify-center p-4 text-center pt-5 pb-6">
              <p className="mb-2 text-xl text-foreground">
                <strong className="text-primary">Klikkaa</strong> tai <strong className="text-primary">tiputa</strong> tiedostoja
              </p>
              <p className="text-sm text-navlink">Kuva, Video ja Dokumetti -tiedostot (max. 5Mt / tiedosto)</p>
            </div>
            <input id="dropzone-file" type="file" accept='media_type' className="hidden" multiple onChange={handleFileChange} />
          </label>
        </div>
        <button 
          type="submit"
          {...(files.length === 0 && { disabled: true })}
          className="mt-4 px-4 py-3 w-[30%] min-w-fit disabled:bg-secondary bg-primary text-white rounded-full"
        >Tallenna</button>
      </form>
      {fileErrors?.length > 0 && fileErrors.map((error, index) => (
        <AlertMsg msg={error} success={false} key={index} />
      ))}
      <FilePreview files={files} removeFile={(file) => setFiles(files.filter(f => f !== file))} uploadProgress={uploadProgress} />
    </div>
  );
}

export default UploadForm;