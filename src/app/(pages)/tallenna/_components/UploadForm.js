import React, { useState } from 'react';
import { validateFile } from '@/utils/FileValidation';
import { useAlert } from '@/app/contexts/AlertContext';
import { generateRandomString } from '@/utils/GenerateRandomString';
import { FilePlus2, Music2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { app, db } from '@/../firebaseConfig';
import { getStorage, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { doc, increment, Timestamp, runTransaction } from "firebase/firestore";

function UploadForm({ files, setFiles, fileErrors, setFileErrors, setUploadProgress, setUserDoc }) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = React.useRef(0);
  const { showAlert } = useAlert();
  const { user } = useUser();
  const storage = getStorage(app);

  // Handle drag enter
  const handleDragEnter = (event) => {
    event.preventDefault();
    dragCounter.current += 1; // Increment drag counter
    setIsDragging(true);
  };

  // Handle drag leave
  const handleDragLeave = (event) => {
    event.preventDefault();
    dragCounter.current -= 1; // Decrement drag counter
    if (dragCounter.current === 0) {
      setIsDragging(false); // Only reset if no more drag events
    }
  }; 
  
  // Handle file drop
  const handleFileDrop = (event) => {
    event.preventDefault();
    dragCounter.current = 0; // Reset drag counter
    setIsDragging(false);
    processFiles(event.dataTransfer.files);
  };

  // Handle file change
  const handleFileChange = (event) => {
    processFiles(event.target.files);
  };

  // Process files and validate
  const processFiles = (fileList) => {
    setFileErrors([]);
    let filesArray = [...files];

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

  // Handle form reset
  const handleFormReset = (e) => {
    setFiles([]);
    setFileErrors([]);
  }

  // Upload files
  const uploadFiles = async (files) => {
    const uploadPromises = files.map(async (file, index) => {
      const fileID = generateRandomString(11);
      const storageRef = ref(storage, `file-base/${user.id}/${fileID}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress((prevProgress) =>
              prevProgress.map((prog, i) => (i === index ? progress : prog))
            );
          },
          (error) => {
            console.error('Error uploading file:', error);
            setFileErrors((prevErrors) => [...prevErrors, error.message]);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(storageRef);
              const shareURL = process.env.NEXT_PUBLIC_BASE_URL + 'jaettu-tiedosto/' + fileID;
  
              const fileData = {
                docType: 'file',
                fileID,
                fileName: file.name,
                fileSize: parseFloat(file.size),
                fileType: file.type,
                fileUrl: downloadURL,
                folderID: file.folderID || '',
                linkShare: false,
                shareUrl: shareURL,
                groupShare: false,
                shareGroups: [],
                pwdProtected: false,
                pwd: '',
                userName: user.fullName,
                userID: user.id,
                userEmail: user.primaryEmailAddress.emailAddress,
                uploadedAt: Timestamp.fromDate(new Date()),
                modifiedAt: Timestamp.fromDate(new Date()),
              };
  
              // Use Firestore transaction for atomic updates
              await runTransaction(db, async (transaction) => {
                // Perform all reads first
                let folderSnap, userSnap;
                if (file.folderID) {
                  const folderRef = doc(db, 'folders', file.folderID);
                  folderSnap = await transaction.get(folderRef);
  
                  if (!folderSnap.exists()) {
                    throw new Error(`Kansiota ei löytynyt tiedostolle ${file.name}`);
                  }
                }
  
                const userRef = doc(db, 'users', user.id);
                userSnap = await transaction.get(userRef);
  
                if (!userSnap.exists()) {
                  throw new Error('Käyttäjätietoja ei löytynyt.');
                }
  
                // Perform all writes after reads
                const fileRef = doc(db, 'files', fileID);
                transaction.set(fileRef, fileData);
  
                if (file.folderID) {
                  const folderRef = doc(db, 'folders', file.folderID);
                  transaction.update(folderRef, { fileCount: increment(1) });
                }
  
                const currentUsedSpace = userSnap.data().usedSpace || 0;
                transaction.update(userRef, { usedSpace: currentUsedSpace + file.size });
              });
  
              // Remove the file from the upload queue
              setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
              resolve();
            } catch (error) {
              console.error('Error saving file data or updating Firestore:', error);
              setFileErrors((prevErrors) => [...prevErrors, error.message]);
              reject(error);
            }
          }
        );
      });
    });
  
    try {
      await Promise.all(uploadPromises);
      showAlert('Tiedosto(t) ladattu onnistuneesti.', 'success');
      setFiles([]);
    } catch (error) {
      showAlert('Virhe tiedostojen lataamisessa. Yritä uudelleen.', 'error');
    }
  };
    
  // Handle form submit
  const handleSubmit = (event) => {
    event.preventDefault();
    uploadFiles(files);
  };


  return (
    <div className="flex flex-col items-center justify-center w-full">
      <form className="w-full mb-1 text-center" onSubmit={handleSubmit}>
        <div
          className={`relative flex items-center justify-center w-full ${isDragging ? 'border-primary' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={(e) => e.preventDefault()} // Prevent default behavior
          onDrop={handleFileDrop}
        >
          {isDragging && (
            <span
              className="absolute w-full top-0 left-0 h-full z-10"
              onDragOver={(e) => e.preventDefault()} // Prevent default behavior
              onDrop={handleFileDrop} // Handle file drop
            ></span>
          )}

          <label
            htmlFor="dropzone-file"
            className={`flex flex-col items-center w-full max-w-full justify-center h-72 rounded-xl
              cursor-pointer border-2 border-dashed hover:border-solid transition-all
              ${isDragging ? 'border-solid bg-primary/10' : 'border-primary bg-background'}`}

          >
            <div className="flex flex-col max-w-full items-center justify-center p-4 text-center pt-5 pb-6">
              {isDragging ? (
                <p className="flex items-center flex-wrap gap-2 mb-2 text-xl text-foreground">
                  <Music2 size={24} className="text-primary" />
                  "<strong className='text-primary'>Let it go</strong>, let it go..."
                </p>
              ) : (
                <p className="flex items-center flex-wrap gap-2 mb-2 text-xl text-foreground">
                  <FilePlus2 size={24} className="text-primary" />
                  <strong className="text-primary">Klikkaa</strong> tai <strong className="text-primary">Tiputa</strong>
                </p>
              )}
              <p className="text-sm text-navlink">Kuva, Video ja Dokumetti -tiedostot (max. 5Mt / tiedosto)</p>
            </div>
            <input id="dropzone-file" type="file" accept="media_type" className="hidden" multiple onChange={handleFileChange} />
          </label>
        </div>
        
        <div className='flex items-center gap-1 mt-2 '>
          <button 
            type="submit"
            className='w-full px-3 py-2.5 rounded-full bg-gradient-to-br from-primary to-blue-800 shadow-black/25 shadow-md 
              text-white transition-all disabled:from-secondary disabled:to-contrast disabled:text-contrast disabled:shadow-none hover:to-primary'
            {...(files.length === 0 && { disabled: true })}
          >
            Tallenna
          </button>
          {files.length > 0 &&
            <button 
              type="reset"
              onClick={handleFormReset}
              className='w-full px-3 py-2.5 rounded-full bg-gradient-to-br from-contrast to-navlink text-white shadow-black/25 shadow-md transition-colors
                hover:from-navlink hover:to-navlink'
            >
              Tyhjennä
            </button>
          }
        </div>
      </form>
    </div>
  );
}

export default UploadForm;