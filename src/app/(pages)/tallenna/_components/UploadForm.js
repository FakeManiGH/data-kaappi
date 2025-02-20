import React, { useState } from 'react';
import { generateRandomString } from '@/utils/GenerateRandomString';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from "firebase/firestore";
import FilePreview from './FilePreview';
import AlertMsg from './AlertMsg';
import { validateFile } from '@/utils/FileValidation';
import { app, db } from '@/../firebaseConfig';
import { useUser } from '@clerk/nextjs';
import { useAlert } from '@/app/contexts/AlertContext';
import { useNavigation } from '@/app/contexts/NavigationContext'
import { formatDateToCollection } from '@/utils/DataTranslation';
import { FilePlus2, Music2 } from 'lucide-react';

function UploadForm() {
  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const { showAlert } = useAlert();
  const storage = getStorage(app);
  const { user } = useUser();
  const { navigatePage } = useNavigation();

  // Handle drag enter
  const handleDragEnter = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  // Handle drag leave
  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  }; 
  
  // Handle file drop
  const handleFileDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    processFiles(event.dataTransfer.files);
  };

  // Handle file change
  const handleFileChange = (event) => {
    processFiles(event.target.files);
  };

  // Process files
  const processFiles = (fileList) => {
    setFileErrors([]);
    let filesArray = [...files];
    let fileErrors = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const error = validateFile(file);
      if (error) {
        fileErrors.push(error);
        filesArray = filesArray.filter(f => f !== file);
      } else {
        filesArray.push(file);
      }
    }

    setFiles(filesArray);
    setFileErrors(fileErrors);
    setUploadProgress(new Array(filesArray.length).fill(0));
  };

  // Upload files to Firebase Storage
  const uploadFiles = async (files) => {
    const uploadPromises = files.map((file, index) => {
      return new Promise((resolve, reject) => {
        const metadata = {
          contentType: file?.type
        };
        const uniqueFileName = `${file?.name}_${generateRandomString(6)}`;
        const fileRef = ref(storage, 'file-base/' + uniqueFileName);
        const uploadTask = uploadBytesResumable(fileRef, file, metadata);

        uploadTask.on('state_changed',
          (snapshot) => {
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
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              await saveFileData(file, downloadURL, uniqueFileName);
              resolve();
            } catch (error) {
              console.error('Error getting download URL or saving file data:', error);
              setFileErrors((prevErrors) => [...prevErrors, error.message]);
              reject(error);
            }
          }
        );
      });
    });

    try {
      await Promise.all(uploadPromises);
      showAlert('Tiedosto(t) tallennettu onnistuneesti!', 'success');
      setTimeout(() => {
        setFileErrors([]);
        setFiles([]);
        setUploadProgress([]);
        navigatePage('/omat-tiedostot');
      }, 2000);
    } catch (error) {
      showAlert('Tiedoston tallennus epäonnistui!', 'error');
    }
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
      createdAt: formatDateToCollection(new Date()),
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
        <div 
          className={`flex items-center justify-center w-full ${isDragging ? 'border-primary' : ''}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary hover:bg-contrast
            ${isDragging ? 'bg-contrast border-primary' : 'border-contrast2'}`}>
            <div className="flex flex-col items-center justify-center p-4 text-center pt-5 pb-6">
              {isDragging ?   
                <p className="flex items-center gap-2 mb-2 text-xl text-foreground">
                  <Music2 size={24} className="text-primary" />
                  "<strong className='text-primary'>Let it go</strong>, let it go..."
                </p> :
                <p className="flex items-center gap-2 mb-2 text-xl text-foreground">
                  <FilePlus2 size={24} className="text-primary" />
                  <strong className="text-primary">Klikkaa</strong> tai <strong className="text-primary">tiputa</strong> tiedostoja
                </p>
            }
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