import React, { useState } from 'react';
import AlertMsg from './AlertMsg';
import { validateFile } from '@/utils/FileValidation';
import { useAlert } from '@/app/contexts/AlertContext';
import { getUser, updateUserDocumentValue } from '@/app/file-requests/api';
import { FilePlus2, Music2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

function UploadForm({ uploadFile, files, setFiles, fileErrors, setFileErrors, setUploadProgress, setUserDoc }) {
  const [isDragging, setIsDragging] = useState(false);
  const { showAlert } = useAlert();
  const { user } = useUser();

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

  // Process files and validate
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
    const userDoc = await getUser(user.id);
    console.log(userDoc);
    
    if (!userDoc) {
      showAlert('Käyttäjää ei löytynyt.', 'error');
      return;
    }

    if (userDoc.usedSpace >= userDoc.totalSpace) {
      showAlert('Tilasi on täynnä. Poista tiedostoja tai ota yhteyttä ylläpitoon.', 'error');
      return;
    }

    // Upload files
    const uploadPromises = files.map(file => uploadFile(file));
    await Promise.all(uploadPromises);

    // Update used space
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    await updateUserDocumentValue(user.id, 'usedSpace', userDoc.usedSpace + totalSize);
    
    // Update user document used space
    setUserDoc({ ...userDoc, usedSpace: userDoc.usedSpace + totalSize });

    showAlert('Tiedosto(t) ladattu onnistuneesti.', 'success');
    setFiles([]);
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
          <label htmlFor="dropzone-file" className={`flex flex-col items-center w-full max-w-full justify-center h-72 
            cursor-pointer bg-background border-2 hover:border-primary  
            ${isDragging ? 'border-primary' : 'border-contrast'}`}>
            <div className="flex flex-col max-w-full items-center justify-center p-4 text-center pt-5 pb-6">
              {isDragging ?   
                <p className="flex items-center flex-wrap gap-2 mb-2 text-xl text-foreground">
                  <Music2 size={24} className="text-primary" />
                  "<strong className='text-primary'>Let it go</strong>, let it go..."
                </p> :
                <p className="flex items-center flex-wrap gap-2 mb-2 text-xl text-foreground">
                  <FilePlus2 size={24} className="text-primary" />
                  <strong className="text-primary">Klikkaa</strong> tai <strong className="text-primary">Tiputa</strong>
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
          className="mt-4 px-4 py-3 w-full disabled:bg-contrast disabled:text-gray-500 
            text-white bg-primary hover:bg-primary/75 transition-colors"
        >Tallenna</button>
      </form>
      {fileErrors?.length > 0 && fileErrors.map((error, index) => (
        <AlertMsg msg={error} success={false} key={index} />
      ))}
    </div>
  );
}

export default UploadForm;